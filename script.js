const $ = (id) => document.getElementById(id);

const storageKey = "ahc_demo_requests_v1";

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
  const items = getRequests();

  if (!list) return;

  if (!items.length) {
    list.innerHTML = '<p class="empty-state">No requests saved yet.</p>';
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

if ($("menuBtn")) {
  $("menuBtn").addEventListener("click", () =>
    $("nav").classList.toggle("open")
  );
}

if ($("nav")) {
  $("nav").querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () =>
      $("nav").classList.remove("open")
    )
  );
}

if ($("chatForm")) {
  $("chatForm").addEventListener("submit", e => {
    e.preventDefault();

    const input = $("chatInput");
    const question = input.value.trim();
    if (!question) return;

    const messages = $("chatMessages");

    const user = document.createElement("div");
    user.className = "bubble user";
    user.textContent = question;
    messages.append(user);

    const answer = document.createElement("div");
    answer.className = "bubble bot";
    answer.textContent =
      "Thanks for your question. This demo cannot provide medical assessments or personalized treatment advice. Please consult a qualified healthcare professional. For emergencies, contact local emergency services.";

    messages.append(answer);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  });
}

if ($("roomForm")) {
  $("roomForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    saveRequest("Room enquiry", data);

    $("roomStatus").textContent =
      "Saved on this device only. Contact the hospital directly.";

    e.currentTarget.reset();
  });
}

if ($("helpForm")) {
  $("helpForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    saveRequest("Help request", data);

    $("helpStatus").textContent =
      "Saved on this device only. No hospital or emergency service was contacted.";

    e.currentTarget.reset();
  });
}

if ($("clearRequests")) {
  $("clearRequests").addEventListener("click", () => {
    if (confirm("Clear all saved demo requests?")) {
      localStorage.removeItem(storageKey);
      renderRequests();
    }
  });
}

if ($("searchHospitals")) {
  $("searchHospitals").addEventListener("click", () => {
    const q = $("hospitalSearch").value.trim();

    $("hospitalList").innerHTML = `
      <article class="hospital-card">
        <h3>Search for "${escapeHtml(q || "a hospital")}"</h3>
        <p>This demo does not have a live hospital directory. Verify hospitals through their official websites.</p>
      </article>
    `;
  });
}

renderRequests();
