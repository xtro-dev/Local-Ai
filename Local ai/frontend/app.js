const API = "http://127.0.0.1:8000";
const STORAGE_KEY = "my-local-ai-chats-v2";

let chats = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentId = null;
let busy = false;

const messagesEl = document.getElementById("messages");
const welcomeEl = document.getElementById("welcome");
const inputEl = document.getElementById("message");
const sendButton = document.getElementById("sendButton");

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function newChat() {
    const chat = { id: uid(), title: "New chat", messages: [] };
    chats.unshift(chat);
    currentId = chat.id;
    save();
    renderSidebar();
    renderMessages();
    inputEl.focus();
}

function currentChat() {
    return chats.find(c => c.id === currentId);
}

function ensureChat() {
    if (!currentId || !currentChat()) newChat();
    return currentChat();
}

function selectChat(id) {
    currentId = id;
    renderSidebar();
    renderMessages();
    inputEl.focus();
}

function deleteChat(id, event) {
    event.stopPropagation();
    chats = chats.filter(c => c.id !== id);
    if (currentId === id) currentId = chats[0]?.id || null;
    save();
    renderSidebar();
    renderMessages();
}

function clearAllChats() {
    if (!chats.length) return;
    if (!confirm("Delete all local chats?")) return;
    chats = [];
    currentId = null;
    save();
    renderSidebar();
    renderMessages();
}

function renderSidebar() {
    const list = document.getElementById("chatList");
    list.innerHTML = "";
    chats.forEach(chat => {
        const row = document.createElement("button");
        row.className = "chat-item" + (chat.id === currentId ? " active" : "");
        row.onclick = () => selectChat(chat.id);
        row.innerHTML = `<span>▱</span><span class="chat-title"></span><span class="delete-chat" title="Delete">×</span>`;
        row.querySelector(".chat-title").textContent = chat.title;
        row.querySelector(".delete-chat").onclick = (e) => deleteChat(chat.id, e);
        list.appendChild(row);
    });
}

function renderMessages() {
    const chat = currentChat();
    messagesEl.innerHTML = "";
    if (!chat || !chat.messages.length) {
        welcomeEl.style.display = "block";
        return;
    }
    welcomeEl.style.display = "none";
    chat.messages.forEach(m => addRenderedMessage(m.role, m.content));
    scrollToBottom();
}

function addRenderedMessage(role, content) {
    const row = document.createElement("div");
    row.className = "message-row";
    const avatar = document.createElement("div");
    avatar.className = `avatar ${role === "user" ? "user" : "ai"}`;
    avatar.textContent = role === "user" ? "U" : "✦";
    const body = document.createElement("div");
    body.className = "message-content";
    if (role === "assistant") body.innerHTML = renderMarkdown(content);
    else body.textContent = content;
    row.append(avatar, body);
    messagesEl.appendChild(row);
    return body;
}

function renderMarkdown(text) {
    // Small local markdown renderer: safe because text is escaped before formatting.
    let s = escapeHtml(text);
    s = s.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    s = s.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    s = s.replace(/^# (.*)$/gm, "<h1>$1</h1>");
    s = s.replace(/^[-*] (.*)$/gm, "<li>$1</li>");
    s = s.replace(/(<li>.*<\/li>\n?)+/g, block => `<ul>${block}</ul>`);
    s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\n\n/g, "</p><p>");
    s = s.replace(/\n/g, "<br>");
    return `<p>${s}</p>`;
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}

async function sendMessage() {
    if (busy) return;
    const text = inputEl.value.trim();
    if (!text) return;

    const chat = ensureChat();
    if (!chat.messages.length) chat.title = text.slice(0, 34) + (text.length > 34 ? "…" : "");

    chat.messages.push({ role: "user", content: text });
    inputEl.value = "";
    autoResize(inputEl);
    save();
    renderSidebar();
    renderMessages();

    busy = true;
    sendButton.disabled = true;
    const aiBody = addRenderedMessage("assistant", "Thinking…");
    scrollToBottom();

    try {
        const response = await fetch(`${API}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chat.messages })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        aiBody.innerHTML = renderMarkdown(data.response);
        chat.messages.push({ role: "assistant", content: data.response });
        document.getElementById("modelLabel").textContent = data.model || "Local AI";
        save();
        scrollToBottom();
    } catch (err) {
        aiBody.innerHTML = `<p><strong>Connection error.</strong><br>Make sure FastAPI and Ollama are running.<br><small>${escapeHtml(err.message)}</small></p>`;
    } finally {
        busy = false;
        sendButton.disabled = false;
        inputEl.focus();
    }
}

function useSuggestion(text) {
    inputEl.value = text;
    autoResize(inputEl);
    inputEl.focus();
}

function handleKey(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
}

function scrollToBottom() {
    requestAnimationFrame(() => messagesEl.scrollTop = messagesEl.scrollHeight);
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

// Restore previous local chats after reload.
if (chats.length) currentId = chats[0].id;
renderSidebar();
renderMessages();
inputEl.focus();
