MY LOCAL AI - UI + MEMORY UPGRADE

1. Replace your existing files with:
   backend/main.py
   frontend/index.html
   frontend/style.css
   frontend/app.js

2. Keep Ollama running.

3. In PowerShell from C:\Local ai:
   python -m uvicorn backend.main:app --reload --port 8000

4. Open frontend/index.html in your browser.

What changed:
- ChatGPT-style dark UI and sidebar
- Multiple chats
- New chat / delete / clear chats
- Chat history saved in browser localStorage
- Conversation history is sent to Ollama on every message
- Markdown-ish rendering and code blocks
- Responsive mobile layout
- Backend /health endpoint

IMPORTANT:
The memory here is conversation history, not permanent model memory. The browser stores each chat locally and the backend sends that chat's previous messages to Ollama. Ollama's model itself is not being retrained.

If your model is not llama3.1:8b, set it before starting the server:
PowerShell:
$env:OLLAMA_MODEL="qwen3:8b"
python -m uvicorn backend.main:app --reload --port 8000
