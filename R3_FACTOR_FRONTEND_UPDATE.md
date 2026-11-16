# R3 Factor frontend update

- Passes the existing `question.questionNumber` to the R3 dialog.
- Sends `{ paperId, questionId: String(questionNumber), questionNumber }` to generation, verification and expansion endpoints.
- Does not create or modify any MongoDB question ID.
- I Learnt flow is unchanged.
