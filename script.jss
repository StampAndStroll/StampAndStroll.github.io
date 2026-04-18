function goTo(page) {
  window.location.href = page;
}

function showOtpHint() {
  const status = document.getElementById("signupStatus");
  if (status) {
    status.textContent = "Demo OTP sent: 123456";
    status.style.color = "#2f8a5a";
  }
}

function verifyOtpAndContinue() {
  const countryCode = document.getElementById("countryCode");
  const phoneNumber = document.getElementById("phoneNumber");
  const otpInput = document.getElementById("otpInput");
  const status = document.getElementById("signupStatus");

  const language = countryCode.value;
  const phone = phoneNumber.value.trim();
  const otp = otpInput.value.trim();

  if (!phone) {
    status.textContent = "Please enter your phone number.";
    status.style.color = "#b85d47";
    return;
  }

  if (otp !== "123456") {
    status.textContent = "OTP incorrect. Use 123456 for demo.";
    status.style.color = "#b85d47";
    return;
  }

  localStorage.setItem("stamp_language", language);
  localStorage.setItem("stamp_phone", phone);
  localStorage.setItem("stamp_mode", "");
  localStorage.setItem("stamp_buggy_paid", "false");

  goTo("home.html");
}

function updateLanguagePreview() {
  const countryCode = document.getElementById("countryCode");
  const preview = document.getElementById("languagePreview");
  if (countryCode && preview) {
    preview.textContent = countryCode.value;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const countryCode = document.getElementById("countryCode");
  if (countryCode) {
    updateLanguagePreview();
    countryCode.addEventListener("change", updateLanguagePreview);
  }
});

function loadHomePage() {
  const language = localStorage.getItem("stamp_language") || "English";
  const languageText = document.getElementById("homeLanguage");

  if (languageText) {
    languageText.textContent = `Language: ${language}`;
  }
}

function selectPath(mode) {
  localStorage.setItem("stamp_mode", mode);

  if (mode === "walker") {
    goTo("walker.html");
  } else if (mode === "buggy") {
    localStorage.setItem("stamp_buggy_paid", "false");
    goTo("buggy.html");
  }
}

function openDynamicMapPage() {
  const mode = localStorage.getItem("stamp_mode");
  const buggyPaid = localStorage.getItem("stamp_buggy_paid");

  if (mode === "walker") {
    goTo("walker.html");
    return;
  }

  if (mode === "buggy" && buggyPaid === "true") {
    goTo("trail.html");
    return;
  }

  if (mode === "buggy" && buggyPaid !== "true") {
    goTo("queue.html");
    return;
  }

  alert("Choose your path first.");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebar || !overlay) return;

  sidebar.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
}

function signOut() {
  localStorage.removeItem("stamp_mode");
  localStorage.removeItem("stamp_buggy_paid");
  goTo("index.html");
}
