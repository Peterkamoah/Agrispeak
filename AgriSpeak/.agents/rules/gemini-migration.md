## Model Migration & Integration Rule

- **Provider Switch**: Change the primary LLM provider from OpenAI to **Google Gemini 1.5 Pro** (or Gemini 1.5 Flash for lower latency).
- **API Routing**: Route all agricultural queries involving Ghanaian languages (Twi, Ewe, Ga, etc.) through the **Khaya/GhanaNLP API** first for translation or localized context before processing with Gemini.
- **Formatting**: Ensure all outputs for Agrispeak follow a "Farmer-First" style: concise, actionable, and compatible with SMS/USSD if required.
- **Environment Reference**: Always pull credentials from the `.env` file using the keys `GOOGLE_API_KEY` and `KHAYA_API_KEY`.

---

### The `.env` Configuration File

Create a file named `.env` in your project's root directory. This keeps your keys secure and allows Antigravity to toggle between the global model (Gemini) and the local specialized model (Khaya).

```bash
# Google Gemini Configuration
# Get your key at https://aistudio.google.com/
GOOGLE_API_KEY="your_google_gemini_api_key_here"
GEMINI_MODEL="gemini-2.5-flash"

# GhanaNLP / Khaya Configuration
# Get your key at https://ghananlp.org/
KHAYA_API_KEY="your_khaya_api_key_here"
KHAYA_BASE_URL="https://translation-api.ghananlp.org/v1/"

# Project Settings
PROJECT_NAME="Agrispeak"
DEFAULT_LANGUAGE="twi" # Default local language for agricultural queries
```

---

### Implementation Steps in Antigravity

To apply these changes effectively:

1. **Select the Model**: In the Antigravity interface, go to the model selector and ensure **Gemini 1.5 Pro** or **3.1 Pro** is selected (this replaces your previous OpenAI selection).
2. **Verify Connections**: Use the command `/mcp list` or check the `Connections` sidebar to confirm that your environment can see the Google AI services.
3. **Localize Logic**: If you are using the **GhanaNLP** tools for translation, you can trigger a custom workflow in Antigravity by typing:

   > *"Refactor my translation module to use the Khaya API endpoint defined in my .env file instead of the OpenAI translation library."*
