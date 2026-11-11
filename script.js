
const $ = (id) => document.getElementById(id);

const storageKey = "ahc_demo_requests_v1";
const WORKER_URL = "https://aihealth.ramtulasisuravarapu.workers.dev";

function getRequests() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function saveRequest(type, data) {
  const requests = getRequests();

  requests.unshift({
    type,
    data,
    created: new Date().toLocaleString()
  });

  localStorage.setItem(storageKey, JSON.stringify(requests));
  renderRequests();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function renderRequests() {
  const list = $("requestList");
  if (!list) return;

  const items = getRequests();

  if (!items.length) {
    list.innerHTML =
      '<p class="empty-state">No requests saved yet.</p>';
    return;
  }

  list.innerHTML = items.map(item => `
    <div class="request-item">
      <b>${escapeHtml(item.type)} · ${escapeHtml(item.created)}</b>
      ${Object.entries(item.data).map(([k, v]) =>
        `<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v || "Not provided")}</div>`
      ).join("")}
    </div>
  `).join("");
}

// Navigation

if ($("menuBtn")) {
  $("menuBtn").addEventListener("click", () => {
    $("nav").classList.toggle("open");
  });
}

if ($("nav")) {
  $("nav").querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      $("nav").classList.remove("open");
    });
  });
}

// AI Assistant

   
function getDemoReply(question) {
  const q = question.toLowerCase();

  if (q.includes("fever")) {
    return "Demo health information: Fever can have many causes. Rest, drink enough fluids, and tell a parent or trusted adult. Seek medical advice if symptoms are severe or persistent.";
  }

  if (q.includes("headache")) {
    return "Demo health information: Headaches can have different causes. Rest, drink water, and tell a trusted adult if it continues or becomes severe.";
  }

  if (q.includes("cough") || q.includes("cold")) {
    return "Demo health information: Coughs and colds are common. Rest and drink fluids. Ask a healthcare professional if symptoms worsen or you have difficulty breathing.";
  }

  if (q.includes("stomach") || q.includes("belly")) {
    return "Demo health information: Stomach discomfort can have many causes. Tell a trusted adult, especially if the pain is severe or persistent.";
  }

  if (q.includes("hello") || q.includes("hi")) {
    return "Hello! Welcome to AI Health Companion. I can share general health information and help you understand common health topics.";
  }

  return "Thank you for your question! I am currently in Demo Mode. I can share basic health information, but I cannot diagnose conditions or recommend treatment. Please consult a healthcare professional for personal medical advice.";
}

if ($("chatForm")) {
  $("chatForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const input = $("chatInput");
    const messages = $("chatMessages");
    const question = input.value.trim();

    if (!question) return;

    const userBubble = document.createElement("div");
    userBubble.className = "bubble user";
    userBubble.textContent = question;
    messages.append(userBubble);

    const answer = document.createElement("div");
    answer.className = "bubble bot";
    answer.textContent = "Demo Mode: " + getDemoReply(question);
    messages.append(answer);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  });
}
