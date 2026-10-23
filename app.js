const chat = document.getElementById("chat");
const mic = document.getElementById("mic");
const form = document.getElementById("form");
const messageInput = document.getElementById("message");
const language = document.getElementById("language");
const speakToggle = document.getElementById("speakToggle");
const statusEl = document.getElementById("status");
const note = document.getElementById("note");

function addMessage(text, who) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${who}`;
  bubble.textContent = text;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}
function speak(text) {
  if (!speakToggle.checked || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language.value;
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}
function replyTo(raw) {
  const q = raw.toLowerCase().trim();
  if (!q) return "Please say or type a question.";
  if (/(hello|hi|hey|namaste|नमस्ते|हैलो)/i.test(q))
    return "Namaste! 😊 Main aapka personal voice assistant hoon. Aap mujhse time, help, motivation, ya general questions pooch sakte hain.";
  if (/(your name|who are you|tum kaun|aap kaun|naam kya)/i.test(q))
    return "Main aapka personal voice chatbot hoon. Aap app.js file mein mera naam aur replies customize kar sakte hain.";
  if (/(time|samay|kitne baje)/i.test(q))
    return "Aapke device par abhi " + new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) + " baj rahe hain.";
  if (/(date|today|tarikh|aaj ki date)/i.test(q))
    return "Aaj ki date " + new Date().toLocaleDateString() + " hai.";
  if (/(thank|thanks|shukriya|dhanyavaad)/i.test(q))
    return "You're welcome! 😊 Main madad karke khush hoon.";
  if (/(joke|mazaak|funny)/i.test(q))
    return "Ek computer doctor ke paas gaya. Doctor bola: tumhe virus hai! Computer bola: par maine to sirf websites kholi thi! 😄";
  if (/(motivate|motivation|thak gaya|give up)/i.test(q))
    return "Aap chhote steps lete rahiye. Har expert kabhi beginner tha. Aaj ka ek chhota step bhi progress hai! 💪";
  if (/(help|madad|kya kar sakte)/i.test(q))
    return "Main greetings, time/date, jokes aur motivation mein help kar sakta hoon. Is starter version mein smart internet AI connected nahi hai.";
  return "Mainne aapka sawal suna: “" + raw + "”. Is basic version mein main har sawal ka smart jawab nahi de sakta. Aap app.js mein apne responses add kar sakte hain; ChatGPT-jaisa jawab dene ke liye baad mein AI model/API connect karna hoga.";
}
function handleMessage(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, "user");
  const answer = replyTo(clean);
  addMessage(answer, "bot");
  speak(answer);
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleMessage(messageInput.value);
  messageInput.value = "";
  messageInput.focus();
});

document.getElementById("clear").addEventListener("click", () => {
  window.speechSynthesis?.cancel();
  chat.innerHTML = "";
  addMessage("Chat clear ho gayi. Namaste! Aap dobara baat kar sakte hain.", "bot");
});
document.getElementById("stopVoice").addEventListener("click", () => window.speechSynthesis?.cancel());

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  mic.disabled = true;
  note.textContent = "Is browser mein voice input support nahi mila. Latest Chrome ya Microsoft Edge use karein; typing aur spoken replies phir bhi work kar sakte hain.";
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => {
    mic.classList.add("listening");
    mic.innerHTML = "🔴 <span>Listening…</span>";
    statusEl.textContent = "Listening";
  };
  recognition.onend = () => {
    mic.classList.remove("listening");
    mic.innerHTML = "🎤 <span>Talk</span>";
    statusEl.textContent = "Ready";
  };
  recognition.onerror = (event) => {
    statusEl.textContent = "Mic issue";
    note.textContent = "Microphone error: " + event.error + ". Browser permissions check karein aur localhost par page kholein.";
  };
  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    messageInput.value = spoken;
    handleMessage(spoken);
    messageInput.value = "";
  };
  mic.addEventListener("click", () => {
    recognition.lang = language.value;
    try { recognition.start(); } catch (e) { note.textContent = "Mic already active hai. Thodi der baad try karein."; }
  });
}
