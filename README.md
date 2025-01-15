# nifty-agent-starter

This repo is an example implementation of an AI agent that is compatible with Nifty Island.
It uses OpenRouter for LLM inference, and the agent API endpoint uses Next.js and can be hosted on Vercel.

Currently, the agent is a simple chatbot that only replies to the latest message without previous message history.

To customize the agent, you can modify the prompt, model, and other LLM settings in the `app/api/chat/route.ts` file.

## Running locally

Set up a `.env.local` file with your OpenRouter API key:

```bash
OPENROUTER_API_KEY=your_api_key
```

Run the development server:

```bash
npm run dev
```

The website has a UI where you can chat with the agent for testing.

## Deploying to Vercel

Link your GitHub repo to your Vercel account. In your project settings in Vercel, set the `OPENROUTER_API_KEY` environment variable to your OpenRouter API key.

## Run for free (for testing)

Google Gemini API has a free tier (currently 15 requests per minute, 1 million tokens per minute, 1,500 requests per day). If you decide to use a Gemini model (e.g. `google/gemini-flash-1.5-8b`), you can run the agent effectively for free for testing or low usage scenarios.

To do this, get your Google AI Studio API key. Go to OpenRouter > Settings > Integrations, select Google AI Studio, and set your API key.