# Ai-Event-Planner-
This Event Planning app allows users to create a guest list, set a budget, add categories with costs, and track tasks for a wedding or large event. The app gives helpful suggestions based on guest count, budget per person, and tasks. Data is saved automatically so nothing is lost on refresh. Built with HTML, CSS, and JavaScript.

## Run locally

1. Install dependencies:
   ```
   npm install
   ```

2. Copy .env.example to .env and set your OpenAI API key:
   ```
   cp .env.example .env
   ```
   (Edit .env and set OPENAI_API_KEY)

3. Start the server:
   ```
   npm start
   ```

4. Open http://localhost:3000

**Notes:**
- Do NOT commit your real .env with OPENAI_API_KEY.
- This app requires a Node-capable host (Heroku, Render, Railway, Cloud Run, etc.). GitHub Pages serves only static sites and cannot run the backend.
- If you deploy to a host with Node >=18 you may remove the node-fetch import; node-fetch is included here to support older runtimes.
