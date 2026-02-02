# Ai-Event-Planner-
This Event Planning app allows users to create a guest list, set a budget, add categories with costs, and track tasks for a wedding or large event. The app gives helpful suggestions based on guest count, budget per person, and tasks. Data is saved automatically so nothing is lost on refresh. Built with HTML, CSS, and JavaScript.

## Run Locally

To run this application on your local machine:

```bash
npm install
cp .env.example .env
# Edit .env to set your OPENAI_API_KEY
npm start
```

Then open your browser to http://localhost:3000

**Important Notes:**
- This app can be hosted on any Node-capable hosting platform (Heroku, Render, Railway, etc.)
- Set your `OPENAI_API_KEY` environment variable on your hosting platform
- Never commit your `.env` file or real API keys to the repository
- Node.js version 16 or higher is required
