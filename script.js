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
  kampungLiving: {
    title: "Kampung Living",
    image: "Daily village life",
    focus: "Focus: Daily village life and community.",
    history:
      "This stop introduces visitors to the authentic kampung experience by showing how locals live, interact, and go about their simple everyday lifestyle.",
    knownFor:
      "Known for reflecting the social and communal side of village life, helping tourists understand the human side of Kampung Sungai Melayu.",
    stamp: "🏠"
  },

  tasteOfTheKampung: {
    title: "Taste of the Kampung",
    image: "Local snacks and food culture",
    focus: "Focus: Local snacks and food culture.",
    history:
      "This stop highlights the food traditions of the kampung through local snacks, flavours, and everyday food culture found in the community.",
    knownFor:
      "Known for helping tourists explore local tastes and appreciate how food is part of daily village interaction and culture.",
    stamp: "🍴"
  },

  heritageAndFaith: {
    title: "Heritage and Faith",
    image: "Cultural identity and religious significance",
    focus: "Focus: Cultural identity and religious significance.",
    history:
      "This stop highlights the mosque and surrounding cultural practices, showing how faith and heritage shape the identity of the kampung community.",
    knownFor:
      "Known for promoting awareness, understanding, and respect for local traditions, customs, and religious values.",
    stamp: "🕌"
  },

  lifeByTheSea: {
    title: "Life by the Sea",
    image: "Fishing lifestyle and coastal environment",
    focus: "Focus: Fishing lifestyle and coastal environment.",
    history:
      "This stop reflects boats, fishing activities, and seaside living, showing how the community has long depended on the sea for livelihood and daily life.",
    knownFor:
      "Known for connecting tourists to the maritime character of the village and its relationship with the coastal environment.",
    stamp: "⚓"
  },

  naturesRoots: {
    title: "Nature’s Roots",
    image: "Mangrove ecosystem and sustainability",
    focus: "Focus: Mangrove ecosystem and sustainability.",
    history:
      "This stop introduces the mangrove environment and its ecological importance, linking the village to nature-based learning and environmental stewardship.",
    knownFor:
      "Known for emphasising environmental awareness and supporting eco-tourism and sustainability goals within Kampung Sungai Melayu.",
    stamp: "🌿"
  },

  twoLandsOneHorizon: {
    title: "Two Lands, One Horizon",
    image: "View of Singapore and Johor",
    focus: "Focus: View of Singapore and Johor.",
    history:
      "This stop highlights the rare geographical view across both Singapore and Johor, making it a memorable visual landmark within the route.",
    knownFor:
      "Known for being a distinctive wow-factor location that gives tourists a broader sense of place and cross-border perspective.",
    stamp: "🌅"
  }
};

function openMapPopup(locationKey) {
  const popup = document.getElementById("mapPopup");
  const overlay = document.getElementById("mapPopupOverlay");
  const data = mapLocations[locationKey];

  if (!popup || !overlay || !data) return;

  document.getElementById("popupTitle").textContent = data.title;
  document.getElementById("popupImage").textContent = data.image;
  document.getElementById("popupFocus").textContent = data.focus;
  document.getElementById("popupHistory").textContent = `Description: ${data.history}`;
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
  kampungLiving: {
    title: "Kampung Living",
    image: "Daily village life",
    focus: "Focus: Daily village life and community.",
    history:
      "This stop introduces visitors to the authentic kampung experience by showing how locals live, interact, and go about their simple everyday lifestyle.",
    knownFor:
      "Known for reflecting the social and communal side of village life, helping tourists understand the human side of Kampung Sungai Melayu.",
    stamp: "🏠"
  },

  tasteOfTheKampung: {
    title: "Taste of the Kampung",
    image: "Local snacks and food culture",
    focus: "Focus: Local snacks and food culture.",
    history:
      "This stop highlights the food traditions of the kampung through local snacks, flavours, and everyday food culture found in the community.",
    knownFor:
      "Known for helping tourists explore local tastes and appreciate how food is part of daily village interaction and culture.",
    stamp: "🍴"
  },

  heritageAndFaith: {
    title: "Heritage and Faith",
    image: "Cultural identity and religious significance",
    focus: "Focus: Cultural identity and religious significance.",
    history:
      "This stop highlights the mosque and surrounding cultural practices, showing how faith and heritage shape the identity of the kampung community.",
    knownFor:
      "Known for promoting awareness, understanding, and respect for local traditions, customs, and religious values.",
    stamp: "🕌"
  },

  lifeByTheSea: {
    title: "Life by the Sea",
    image: "Fishing lifestyle and coastal environment",
    focus: "Focus: Fishing lifestyle and coastal environment.",
    history:
      "This stop reflects boats, fishing activities, and seaside living, showing how the community has long depended on the sea for livelihood and daily life.",
    knownFor:
      "Known for connecting tourists to the maritime character of the village and its relationship with the coastal environment.",
    stamp: "⚓"
  },

  naturesRoots: {
    title: "Nature’s Roots",
    image: "Mangrove ecosystem and sustainability",
    focus: "Focus: Mangrove ecosystem and sustainability.",
    history:
      "This stop introduces the mangrove environment and its ecological importance, linking the village to nature-based learning and environmental stewardship.",
    knownFor:
      "Known for emphasising environmental awareness and supporting eco-tourism and sustainability goals within Kampung Sungai Melayu.",
    stamp: "🌿"
  },

  twoLandsOneHorizon: {
    title: "Two Lands, One Horizon",
    image: "View of Singapore and Johor",
    focus: "Focus: View of Singapore and Johor.",
    history:
      "This stop highlights the rare geographical view across both Singapore and Johor, making it a memorable visual landmark within the route.",
    knownFor:
      "Known for being a distinctive wow-factor location that gives tourists a broader sense of place and cross-border perspective.",
    stamp: "🌅"
  }
};

function openMapPopup(locationKey) {
  const popup = document.getElementById("mapPopup");
  const overlay = document.getElementById("mapPopupOverlay");
  const data = mapLocations[locationKey];

  if (!popup || !overlay || !data) return;

  document.getElementById("popupTitle").textContent = data.title;
  document.getElementById("popupImage").textContent = data.image;
  document.getElementById("popupFocus").textContent = data.focus;
  document.getElementById("popupHistory").textContent = `Description: ${data.history}`;
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

function loadTrailPage() {
  localStorage.setItem("stamp_mode", "buggy");
  localStorage.setItem("stamp_buggy_paid", "true");

  const route = localStorage.getItem("stamp_buggy_route") || "Route 1";
  const display = document.getElementById("trailRouteDisplay");
  if (display) {
    display.textContent = `Route: ${route}`;
  }
}

function loadPhotohuntPage() {
  const status = document.getElementById("photohuntStatus");
  if (status) {
    status.textContent = "Photo hunt not completed yet.";
    status.style.color = "#7a6d68";
  }
}

function completePhotohunt() {
  const photo1 = document.getElementById("photo1");
  const photo2 = document.getElementById("photo2");
  const status = document.getElementById("photohuntStatus");

  const hasPhoto1 = photo1 && photo1.files.length > 0;
  const hasPhoto2 = photo2 && photo2.files.length > 0;

  if (!hasPhoto1 && !hasPhoto2) {
    status.textContent = "Upload at least one photo to complete the demo.";
    status.style.color = "#b85d47";
    return;
  }

  status.textContent = "Photo hunt completed. Reward unlocked: Soft Toy Mascot.";
  status.style.color = "#2f8a5a";
}

function submitReview() {
  const nameInput = document.getElementById("reviewName");
  const ratingInput = document.getElementById("reviewRating");
  const commentInput = document.getElementById("reviewComment");
  const reviewList = document.getElementById("reviewList");

  if (!nameInput || !ratingInput || !commentInput || !reviewList) return;

  const name = nameInput.value.trim() || "Anonymous";
  const rating = ratingInput.value;
  const comment = commentInput.value.trim();

  if (!comment) {
    alert("Please write a review first.");
    return;
  }

  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";
  reviewCard.innerHTML = `
    <div class="review-stars">${rating}</div>
    <strong>${name}</strong>
    <p class="muted">${comment}</p>
  `;

  reviewList.appendChild(reviewCard);

  nameInput.value = "";
  ratingInput.value = "★★★★★";
  commentInput.value = "";
}
