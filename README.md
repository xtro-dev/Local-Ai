# Local.AI 🤖

A locally hosted AI chatbot powered by **Ollama** and **Llama 3.1 8B**, with a browser-based interface built using Python, FastAPI, HTML, CSS, and JavaScript.

The application communicates with a locally running LLM, allowing users to interact with an AI model without relying on cloud-based AI APIs.

## 🚀 Features

- Run AI models locally using Ollama.
- Chat through a browser-based interface.
- Python FastAPI backend.
- HTML, CSS, and JavaScript frontend.
- Local inference without requiring an external AI API key.
- Uses Llama 3.1 8B by default.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | Backend API |
| Ollama | Local LLM runtime |
| Llama 3.1 8B | Language model |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend functionality |

## 📋 Prerequisites

Install the following before running the project:

1. **Python 3.10 or newer**
   - https://www.python.org/downloads/

2. **Ollama**
   - https://ollama.com/download

3. **Git**
   - https://git-scm.com/downloads

4. **Hardware requirements**
   - 16 GB RAM recommended.
   - GPU acceleration is optional but recommended.
   - Sufficient storage for downloading the model.

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/xtro-dev/Local-Ai.git
```

Navigate into the project directory:

```bash
cd Local-Ai
```

### 2. Set up Python environment

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

**Windows:**

```powershell
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Install Ollama

Download and install Ollama:

https://ollama.com/download

Pull the Llama 3.1 8B model:

```bash
ollama pull llama3.1:8b
```

Verify installation:

```bash
ollama list
```

You should see `llama3.1:8b` in the installed models.

### 4. Start Ollama

Ollama generally runs automatically in the background after installation.

If it is not running, start it:

```bash
ollama serve
```

Keep it running.

### 5. Start the backend

Open another terminal in the project directory.

Activate your virtual environment if necessary.

Run the FastAPI server:

```bash
uvicorn backend.main:app --reload --port 8000
```

The backend should now be available at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 6. Launch the frontend

Open the frontend's `index.html` file in your browser.

If a local HTTP server is required, run:

```bash
cd frontend
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

## ⚙️ Configuration

Default language model:

```text
llama3.1:8b
```

Ollama API endpoint:

```text
http://localhost:11434
```

No external AI API key is required.

## 📁 Project Structure

```text
Local-Ai/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── requirements.txt
└── README.md
```

*The structure above is an example. Adjust it to match the actual repository.*

## 🔧 Troubleshooting

**Ollama connection error**

Make sure Ollama is running:

```bash
ollama serve
```

**Model not found**

Download the model:

```bash
ollama pull llama3.1:8b
```

**Python dependency errors**

Activate your virtual environment and run:

```bash
pip install -r requirements.txt
```

**Backend connection error**

Verify that FastAPI is running on port `8000` and that the frontend is configured with the correct backend URL.

## 🔒 Privacy

The language model runs locally through Ollama. Prompts are sent to the local Ollama service rather than an external AI API. Privacy also depends on the application code and any external services it may use.

## 📌 Future Improvements

- [ ] Streaming AI responses
- [ ] Persistent chat history
- [ ] Support for multiple LLMs
- [ ] Chat with PDF documents (RAG)
- [ ] Custom system prompts
- [ ] Improved UI and user experience

## 👨‍💻 Author

**xtro-dev**

GitHub: https://github.com/xtro-dev

Repository: https://github.com/xtro-dev/Local-Ai

---

⭐ If you find this project useful, consider giving it a star!
