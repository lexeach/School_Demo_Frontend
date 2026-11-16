# R3 Factor frontend deployment

1. Deploy this frontend ZIP to the same Netlify site used by the existing application.
2. The R3 Factor button is added beside the existing I Learnt button in `LearningAccordion`.
3. R3 starts only when the student clicks R3 Factor.
4. The frontend calls the backend `/api/r3` endpoints through the existing API base URL and bearer token.
5. The active page integration is `Pages/Paper/LearningView_Cleaned_No_YoutubePDF.tsx`.
