# Ai-Event-Planner-
This Event Planning app allows users to create a guest list, set a budget, add categories with costs, and track tasks for a wedding or large event. The app gives helpful suggestions based on guest count, budget per person, and tasks. Data is saved automatically so nothing is lost on refresh. Built with HTML, CSS, and JavaScript.

## Run locally

### Prerequisites
- Node.js version 16 or higher

### Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set your OpenAI API key:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and add your actual OpenAI API key

### Start the server
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Hosting
This app can be hosted on any Node.js hosting platform (e.g., Heroku, Render, Railway, Vercel). Make sure to:
- Set the `OPENAI_API_KEY` environment variable in your hosting platform's settings
- The hosting platform should auto-detect the Node.js app via `package.json`
- Ensure Node.js version 16 or higher is used
