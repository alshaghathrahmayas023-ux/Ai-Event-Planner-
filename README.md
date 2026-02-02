# AI Event Planner

This Event Planning app allows users to create a guest list, set a budget, add categories with costs, and track tasks for a wedding or large event. The app gives helpful suggestions based on guest count, budget per person, and tasks. Data is saved automatically so nothing is lost on refresh. Built with HTML, CSS, and JavaScript.

## Features

- AI-powered event planning suggestions
- Guest list management
- Budget tracking with cost categories
- Task management
- Auto-save functionality

## Setup & Running Locally

### Prerequisites
- Node.js >= 16
- OpenAI API key

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/alshaghathrahmayas023-ux/Ai-Event-Planner-.git
cd Ai-Event-Planner-
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Then edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```

4. Start the server:
```bash
npm start
```

5. Open your browser and visit `http://localhost:3000`

## Deployment

This app requires a Node.js backend to function (for the AI chat features). 

**Recommended hosting options:**
- Render.com (free tier available)
- Railway.app
- Heroku
- Any Node.js hosting platform

**Important:** Static hosts like GitHub Pages will NOT work for this app since it requires a backend server to proxy OpenAI API requests.

### Deployment Notes:
- Set the `OPENAI_API_KEY` environment variable in your hosting platform
- Ensure Node.js version 16 or higher is available
- The app will automatically use `process.env.PORT` if provided by the host

## Environment Variables

- `OPENAI_API_KEY` (required) - Your OpenAI API key
- `OPENAI_MODEL` (optional) - Defaults to "gpt-4.1-mini"
- `PORT` (optional) - Defaults to 3000
