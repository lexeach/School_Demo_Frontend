# R3 Factor API trigger fix (no database migration)

## What changed
- R3 generation is now triggered directly by the student's R3 Factor button click in `LearningAccordion`.
- The request sends `paperId`, `questionId` (the existing `questionNumber` string), and `questionNumber` to `POST /api/r3/generate`.
- Loading and API errors are surfaced in the dialog; Retry reissues the same request.
- Verification and Explore Further continue sending the same question reference to their existing endpoints.
- The existing I Learnt flow is not changed.

## Database
- No migration script needs to be run for this frontend fix.
- No Paper question IDs or question objects are created, changed, or regenerated.
- The backend already mounted `/api/r3` and resolves questions by their existing `questionNumber` within the paper.

## Deploy
Deploy this frontend ZIP to the existing Netlify site. Keep the currently deployed compatible backend. Test a fresh question by opening DevTools > Network > Fetch/XHR, clicking R3 Factor, and checking for `POST /api/r3/generate`.
