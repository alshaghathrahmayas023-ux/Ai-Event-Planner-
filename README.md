# Ai-Event-Planner-
This Event Planning app allows users to create a guest list, set a budget, add categories with costs, and track tasks for a wedding or large event. The app gives helpful suggestions based on guest count, budget per person, and tasks. Data is saved automatically so nothing is lost on refresh. Built with HTML, CSS, and JavaScript.

## Run Locally

To run this app on your local machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your OpenAI API key. Get one from [OpenAI Platform](https://platform.openai.com/api-keys).

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Important Notes

- **Security:** Never commit your `.env` file with real API keys to version control. The `.gitignore` file should already exclude it.
- **Hosting:** This app requires a Node.js-capable host (e.g., Heroku, Render, Railway, or any VPS). GitHub Pages only serves static sites and cannot run the Node.js server.
- **Node Version:** Requires Node.js version 16 or higher. The app uses `node-fetch` for compatibility with older Node runtimes that lack the global `fetch` API.

### Testing the API

- Without an API key: The `/api/chat` endpoint will return an error about missing `OPENAI_API_KEY`.
- With a valid API key: The endpoint will call OpenAI and return event planning suggestions.
