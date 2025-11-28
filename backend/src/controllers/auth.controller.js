import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import EmailOTP from "../models/EmailOTP.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import generateToken from "../utils/generateToken.js";
import sendMail from "../utils/emailService.js";

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, __v, ...rest } = user.toObject();
  return rest;
};

const generateOtpCode = () => crypto.randomInt(100000, 999999).toString();

export const requestRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const code = generateOtpCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await EmailOTP.findOneAndUpdate(
      { email: normalizedEmail, purpose: "register" },
      { email: normalizedEmail, purpose: "register", codeHash, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendMail({
      to: normalizedEmail,
      subject: "Your CampusEvents verification code",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
          <h2 style="color:#4f46e5;">Verify your email</h2>
          <p>Use the one-time password below to complete your CampusEvents registration. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">${code}</div>
          <p>If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Failed to send registration OTP", error.message);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, otp, college, phone } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "Name, email, password, and OTP are required" });
    }

    const normalizedCollege = typeof college === "string" ? college.trim() : "";
    if (!normalizedCollege) {
      return res.status(400).json({ message: "College is required to complete registration" });
    }

    const normalizedPhone = typeof phone === "string" ? phone.trim() : "";
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const otpRecord = await EmailOTP.findOne({ email: normalizedEmail, purpose: "register" });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await EmailOTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), otpRecord.codeHash);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "student",
      college: normalizedCollege,
      phone: normalizedPhone,
    });

    await EmailOTP.deleteOne({ _id: otpRecord._id });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    const code = generateOtpCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailOTP.findOneAndUpdate(
      { email: normalizedEmail, purpose: "password-reset" },
      { email: normalizedEmail, purpose: "password-reset", codeHash, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendMail({
      to: normalizedEmail,
      subject: "Reset your CampusEvents password",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
          <h2 style="color:#4f46e5;">Password reset request</h2>
          <p>Use the one-time password below to reset your CampusEvents account password. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">${code}</div>
          <p>If you did not request this reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Password reset OTP sent" });
  } catch (error) {
    console.error("Failed to send password reset OTP", error.message);
    return res.status(500).json({ message: "Failed to send password reset OTP" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await EmailOTP.findOne({ email: normalizedEmail, purpose: "password-reset" });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await EmailOTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), otpRecord.codeHash);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    await user.save();

    await EmailOTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};
