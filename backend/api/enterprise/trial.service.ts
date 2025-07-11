// Enterprise Trial Service (Stub)

export class TrialService {
  // In-memory trial status (replace with DB in production)
  private trialStatus: Record<string, { started: Date; expires: Date }> = {};

  startTrial(userId: string) {
    const started = new Date();
    const expires = new Date(started.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.trialStatus[userId] = { started, expires };
    return { started, expires };
  }

  getTrialStatus(userId: string) {
    return this.trialStatus[userId] || null;
  }
} 