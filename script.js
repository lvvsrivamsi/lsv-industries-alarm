// ===== FIREBASE DATABASE URL =====
const firebaseURL =
  "https://lsv-industries-alarm-default-rtdb.asia-southeast1.firebasedatabase.app/alarm/status.json";

// UI Elements
let armed = false;
const statusText = document.getElementById("statusText");
const toggleBtn = document.getElementById("toggleBtn");
const signalAnim = document.getElementById("signalAnim");

// ---------------- FETCH STATUS ----------------
async function fetchStatus() {
  try {
    const res = await fetch(firebaseURL);
    const mode = await res.json();

    armed = mode === "armed";
    updateUI();
  } catch (err) {
    statusText.innerText = "CLOUD OFFLINE";
  }
}

// Auto refresh every 2 sec
setInterval(fetchStatus, 2000);

// ---------------- UPDATE UI ----------------
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

  // 5 sec Stark animation delay
  setTimeout(async () => {
    const newMode = armed ? "disarmed" : "armed";

    await fetch(firebaseURL, {
      method: "PUT",
      body: JSON.stringify(newMode),
    });

    signalAnim.classList.add("hidden");
    toggleBtn.disabled = false;

    fetchStatus();
  }, 5000);
});

// Initial load
fetchStatus();
