import { config } from '../config.js';

// Restaurant analogy: the outside supplier. LangChain's ChatGoogle talks to Gemini.
// The key is read here, on the server, and never sent to the browser.

let model = null;

export async function getModel() {
  if (!config.geminiApiKey) {
    throw new Error('No GEMINI_API_KEY. Add it in Replit Secrets (or your .env file).');
  }
  if (!model) {
    // Loaded only when needed, so the app still starts in mock mode.
    const { ChatGoogle } = await import('@langchain/google/node');
    model = new ChatGoogle({
      model: config.model,
      apiKey: config.geminiApiKey,
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
    });
  }
  return model;
}

// Turn provider errors into messages a student can act on.
export function friendlyAiError(err) {
  const status = err?.status ?? err?.response?.status;
  const text = String(err?.message ?? '');
  if (status === 429 || /quota|rate limit/i.test(text)) return 'Impact Explorer is receiving too many requests. Try again in a minute.';
  if ([400, 401, 403, 404].includes(status) || /api key|not found/i.test(text)) return 'Impact Explorer cannot reach its AI service right now. You can still read the source links and notes.';
  return 'The AI could not answer right now. Try again in a moment.';
}
