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
  localStorage.setItem("stamp_buggy_route", "Route 1");
  localStorage.setItem("stamp_queue_number", "089");

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
  localStorage.removeItem("stamp_buggy_route");
  goTo("index.html");
}

let currentZoom = 1;

function loadWalkerPage() {
  localStorage.setItem("stamp_mode", "walker");
  const mapLayer = document.getElementById("mapZoomLayer");
  if (mapLayer) {
    currentZoom = 1;
    mapLayer.style.transform = `scale(${currentZoom})`;
  }
}

function zoomMap(step) {
  const mapLayer = document.getElementById("mapZoomLayer");
  if (!mapLayer) return;

  currentZoom += step;
  if (currentZoom < 0.8) currentZoom = 0.8;
  if (currentZoom > 2) currentZoom = 2;

  mapLayer.style.transform = `scale(${currentZoom})`;
}

const mapLocations = {
  mainBooth: {
    title: "Layered Stamp Booth",
    image: "Main booth image",
    history: "This is the main stamp trail booth where visitors begin collecting stamps.",
    knownFor: "Known for helping visitors collect layered stamps that form a complete picture.",
    stamp: "⬢"
  },
  foodBooth: {
    title: "Local Food Booth",
    image: "Food booth image",
    history: "This stop highlights local food vendors and supports small businesses in the village.",
    knownFor: "Known for local snacks and bonus stamp opportunities.",
    stamp: "◉"
  },
  coastalStop: {
    title: "Coastal Trail Stop",
    image: "Coastal stop image",
    history: "This section follows the coastal side of the kampung and gives visitors a scenic route.",
    knownFor: "Known for seaside views and nature exploration.",
    stamp: "△"
  },
  lookout: {
    title: "Lookout Point",
    image: "Lookout image",
    history: "This upper trail stop acts as a key navigation and viewing point on the route.",
    knownFor: "Known for orientation, views, and navigation support.",
    stamp: "✦"
  }
};

function openMapPopup(locationKey) {
  const popup = document.getElementById("mapPopup");
  const overlay = document.getElementById("mapPopupOverlay");
  const data = mapLocations[locationKey];
  if (!popup || !overlay || !data) return;

  document.getElementById("popupTitle").textContent = data.title;
  document.getElementById("popupImage").textContent = data.image;
  document.getElementById("popupHistory").textContent = `History: ${data.history}`;
  document.getElementById("popupKnownFor").textContent = `Known for: ${data.knownFor}`;
  document.getElementById("popupStamp").textContent = data.stamp;

  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeMapPopup() {
  const popup = document.getElementById("mapPopup");
  const overlay = document.getElementById("mapPopupOverlay");
  if (!popup || !overlay) return;

  popup.classList.add("hidden");
  overlay.classList.add("hidden");
}

function loadBuggyPage() {
  localStorage.setItem("stamp_mode", "buggy");
  highlightSelectedRoute();
}

function selectBuggyRoute(route) {
  localStorage.setItem("stamp_buggy_route", route);
  highlightSelectedRoute();

  const status = document.getElementById("buggyRouteStatus");
  if (status) {
    status.textContent = `${route} selected.`;
    status.style.color = "#2f8a5a";
  }
}

function highlightSelectedRoute() {
  const savedRoute = localStorage.getItem("stamp_buggy_route") || "Route 1";
  const route1Btn = document.getElementById("route1Btn");
  const route2Btn = document.getElementById("route2Btn");

  if (route1Btn) route1Btn.classList.toggle("selected", savedRoute === "Route 1");
  if (route2Btn) route2Btn.classList.toggle("selected", savedRoute === "Route 2");
}

function goToQueuePage() {
  const route = localStorage.getItem("stamp_buggy_route");
  if (!route) {
    alert("Please select a route first.");
    return;
  }
  goTo("queue.html");
}

function loadQueuePage() {
  localStorage.setItem("stamp_mode", "buggy");

  const route = localStorage.getItem("stamp_buggy_route") || "Route 1";
  const queue = localStorage.getItem("stamp_queue_number") || "089";
  const paid = localStorage.getItem("stamp_buggy_paid") === "true";

  const routeDisplay = document.getElementById("selectedRouteDisplay");
  const queueDisplay = document.getElementById("queueNumberDisplay");
  const paymentDisplay = document.getElementById("paymentStatusDisplay");

  if (routeDisplay) routeDisplay.textContent = `Selected route: ${route}`;
  if (queueDisplay) queueDisplay.textContent = queue;

  if (paymentDisplay) {
    paymentDisplay.textContent = paid ? "Status: Payment Confirmed" : "Status: Pending Payment";
    paymentDisplay.className = paid ? "ticket-status paid" : "ticket-status pending";
  }
}

function refreshQueueNumber() {
  let queue = parseInt(localStorage.getItem("stamp_queue_number") || "89", 10);
  queue += 1;
  const formatted = String(queue).padStart(3, "0");
  localStorage.setItem("stamp_queue_number", formatted);

  const queueDisplay = document.getElementById("queueNumberDisplay");
  if (queueDisplay) queueDisplay.textContent = formatted;
}

function simulatePayment() {
  localStorage.setItem("stamp_buggy_paid", "true");
  goTo("trail.html");
}
