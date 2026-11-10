from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os

app = FastAPI(title="My Local AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL}

@app.post("/chat")
def chat(request: ChatRequest):
    messages = [
        {"role": m.role, "content": m.content}
        for m in request.messages
        if m.role in ("user", "assistant") and m.content.strip()
    ]

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "messages": messages,
            "stream": False,
        },
        timeout=300,
    )
    response.raise_for_status()
    data = response.json()

    return {
        "response": data["message"]["content"],
        "model": MODEL,
    }
