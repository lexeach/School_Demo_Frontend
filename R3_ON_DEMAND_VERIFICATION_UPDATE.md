# R3 On-Demand Verification Questions (Frontend)

- Adds one `Generate Verification Questions` action per selected factor.
- Displays no verification questions until the learner requests a set.
- Loads three questions from `POST /api/r3/questions` and keeps the set active for the current factor.
- Submits answers with the returned `attemptId` to `POST /api/r3/verify`.
- After submission, clears the current set so the same single generation button is available for the next attempt.
- Keeps the existing one-question-at-a-time flow, answer selection, Previous/Next, result popup, sequential factor gating, and existing question references.
- Learning Content tab is unlocked only after a failed attempt; content remains on-demand.
