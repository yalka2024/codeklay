// Trial API Route (Stub)
import { TrialService } from "./trial.service";

const trial = new TrialService();

export async function POST(req, res) {
  // TODO: Start a trial for a user
  const { userId } = req.body;
  const result = trial.startTrial(userId);
  res.json(result);
}

export async function GET(req, res) {
  // TODO: Get trial status for a user
  const { userId } = req.query;
  const result = trial.getTrialStatus(userId);
  res.json(result);
} 