# R3 Factor Explorer UI update

## What changed
- Replaced the always-visible factor cards with a collapsible, VS Code-style hierarchical tree.
- The root `R3 Structure` has its own expand/collapse arrow.
- Every factor with children has its own independent expand/collapse arrow.
- Clicking an arrow only expands/collapses that branch; it does not open verification.
- Clicking a factor name selects that factor and opens only that factor's learning content and verification set in a separate panel.
- Selecting another factor switches the panel to that factor; no other factor's verification questions are displayed at the same time.
- This works recursively at every depth.
- Factor status remains based on the existing `effectiveVerified` value from the backend.
- Existing API calls, paper/question references, question IDs, verification submission and expansion endpoints are unchanged.

## Deployment
Replace the frontend project files with this ZIP's contents and deploy through Netlify. No backend deployment or MongoDB migration is part of this UI-only change.

## Validation note
The source was updated, but a production build could not be run in this environment because `npm ci` timed out before dependencies were installed. Run `npm install` and `npm run build` locally or in Netlify to complete the build validation.
