# R3 Factor frontend update

- Passes the original question object's existing `_id` unchanged to the R3 dialog.
- Sends `{ paperId, questionId, questionNumber }` to generation, verification and expansion endpoints.
- Does not generate or modify question IDs.
- I Learnt flow is unchanged.
- If the question object has no existing `_id`, the dialog explains this and does not fabricate a reference.
