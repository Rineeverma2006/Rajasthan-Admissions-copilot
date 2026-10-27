# Rajasthan Admission Copilot (frontend demo)
Setup: `npm install` then `npm run dev` and open http://localhost:5173
Routes: / , /dashboard , /explore , /predictor , /assistant
Data: edit `src/data/colleges.ts` (all values are illustrative samples, verified:false).
Chatbot: replace `reply()` in `src/lib/chat.ts` with a call to a RAG backend.
Simulated: recommendations (rule-based, not ML), chatbot (keyword KB), all college data.
Not yet built: college details page, comparison, scholarships, knowledge centre, profile page, admin page.
