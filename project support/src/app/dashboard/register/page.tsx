import { AttendancePredictor } from "@/components/attendance-predictor";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold tracking-tight">Automated Registration & Prediction</h1>
      <p className="text-muted-foreground mb-8">Manage sign-ups and leverage AI to predict event turnout.</p>
      {/* A full registration form could be built here. For now, we focus on the prediction model. */}
      <AttendancePredictor />
    </div>
  );
}
