// ===== ESP32 DETAILS =====
const esp32IP = "http://192.168.29.204";
const key = "LSV1234"; // Must match ESP32 key

let armed = false;

const statusText = document.getElementById("statusText");
const toggleBtn = document.getElementById("toggleBtn");
const signalAnim = document.getElementById("signalAnim");

// ---------------- LIVE STATUS SYNC ----------------
async function fetchStatus() {
  try {
    const res = await fetch(esp32IP + "/status");
    const mode = await res.text();

    armed = (mode.trim() === "armed");
    updateUI();
  } catch (err) {
    statusText.innerText = "ESP32 OFFLINE";
  }
}

// Auto refresh every 2 sec
setInterval(fetchStatus, 2000);

// ---------------- UI UPDATE ----------------
function updateUI() {
  if (armed) {
    statusText.innerText = "ARMED 🚨";
    toggleBtn.innerText = "DISARM SYSTEM";
    toggleBtn.className = "disarmBtn";
  } else {
    statusText.innerText = "DISARMED ✅";
    toggleBtn.innerText = "ARM SYSTEM";
    toggleBtn.className = "armBtn";
  }
}

// ---------------- TOGGLE BUTTON ----------------
toggleBtn.addEventListener("click", async () => {

  toggleBtn.disabled = true;
  signalAnim.classList.remove("hidden");

  // Stark delay animation (5 sec)
  setTimeout(async () => {

    if (!armed) {
      await fetch(`${esp32IP}/arm?key=${key}`);
    } else {
      await fetch(`${esp32IP}/disarm?key=${key}`);
    }

    signalAnim.classList.add("hidden");
    toggleBtn.disabled = false;

    fetchStatus();

  }, 5000);
});

// Initial load
fetchStatus();