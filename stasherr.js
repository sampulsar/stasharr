// ==UserScript==
// @name         Add StashID to Whisparr
// @namespace    http://tampermonkey.net/
// @version      2024-10-17
// @description  Add a StashDB scene to your local Whisparr instance with a single click.
// @author       enymawse
// @match        https://stashdb.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // EDIT THESE VALUES //
  let config = {
    scheme: "https",
    userDomain: "*****", // Your Whisparr instance URL{:PORT}/IP{:PORT} ex. whisparr.local or whisparr.lan
    apiKey: "*****", // Your Whisparr API key
    quality: "*****", // Quality profile ID, can be found at the /api/v3/qualityprofile endpoint of your local instance
    rootFolderPath: "/root/folder/path", // Path to where you keep your stuff
  };
  config.apiUrl = `${config.scheme}://${config.userDomain}/api/v3/lookup/scene`;

  // Load FontAwesome if not already present
  function injectFontAwesomeStyles() {
    if (!document.querySelector("#fontAwesomeCDN")) {
      const link = document.createElement("link");
      link.id = "fontAwesomeCDN";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css";
      document.head.appendChild(link);
      console.log("FontAwesome injected");
    }
  }

  // Utility function to create headers
  function createHeaders(additionalHeaders = {}) {
    return {
      Accept: "*/*",
      "X-Api-Key": config.apiKey,
      Connection: "keep-alive",
      ...additionalHeaders,
    };
  }

  // Utility function to display a custom toast message
  function showToast(message, isSuccess = true) {
    const toastContainer = document.querySelector(".ToastContainer");
    if (toastContainer) {
      const customToast = document.createElement("div");
      customToast.className = "Toast";
      customToast.style.cssText = `
                padding: 10px;
                background-color: ${isSuccess ? "#4CAF50" : "#F44336"};
                color: white;
                margin: 10px;
                border-radius: 5px;
            `;
      customToast.innerText = message;
      toastContainer.appendChild(customToast);
      setTimeout(() => customToast.remove(), 5000);
    } else {
      console.log("ToastContainer not found.");
    }
  }

  // Function to add the button when the card-header element is found
  function addButtonToCardHeader() {
    const cardHeader = document.querySelector(".scene-info .card-header");
    if (cardHeader && !document.querySelector("#whisparrButtonHeader")) {
      const triggerButton = createHeaderButton();
      cardHeader.appendChild(triggerButton);
      const sceneID = window.location.href.split(
        "https://stashdb.org/scenes/",
      )[1];
      handleSceneLookup(triggerButton, sceneID, true);
    }
  }

  function createHeaderButton() {
    const button = document.createElement("button");
    button.id = "whisparrButtonHeader";
    button.style.cssText = `
            background-color: #e385ed;
            color: #ffffffcc;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
    return button;
  }

  // Function to add buttons to each SceneCard
  function addButtonsToSceneCards() {
    const sceneCards = document.querySelectorAll(".SceneCard");
    sceneCards.forEach((sceneCard) => {
      if (!sceneCard.querySelector(".whisparrButton")) {
        const button = createCardButton();
        button.classList.add("whisparrButton");
        sceneCard.style.position = "relative"; // Ensure the scene card has positioning to allow absolute button placement
        sceneCard.appendChild(button);
        const sceneUrl = sceneCard.querySelector("a").href;
        const sceneID = sceneUrl.split("/scenes/")[1];
        handleSceneLookup(button, sceneID, false);
      }
    });
  }

  function createCardButton() {
    const button = document.createElement("button");
    button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #e385ed;
            border: none;
            border-radius: 10%;
            padding: 5px;
            cursor: pointer;
            color: #ffffffcc;
        `;
    button.innerHTML = '<i class="fa-solid fa-download"></i>'; // Icon only
    return button;
  }

  function handleSceneLookup(button, sceneID, isHeader) {
    if (sceneID) {
      const fullApiUrl = `${config.apiUrl}?term=${encodeURIComponent(sceneID)}`;
      fetch(fullApiUrl, { method: "GET", headers: createHeaders() })
        .then((response) => response.json())
        .then((data) => {
          if (data?.length > 0 && hasBeenAdded(data[0].movie.added)) {
            updateButtonForExistingScene(button, isHeader);
          } else {
            if (isHeader) {
              updateButtonForNewScene(button);
            }
            button.addEventListener("click", () =>
              addSceneToWhisparr(sceneID, button, isHeader),
            );
          }
        })
        .catch((error) => {
          console.error("API Call Error:", error);
          showToast("Error checking scene in Whisparr.", false);
        });
    } else {
      console.log("No StashID in the URL.");
      showToast("No valid StashID found in the URL.", false);
    }
  }

  function updateButtonForExistingScene(button, isHeader) {
    button.disabled = true;
    button.style.color = "#ffffffcc";
    if (isHeader) {
      button.innerHTML =
        '<i class="fa-solid fa-check-circle"></i> Already in Whisparr';
    } else {
      button.innerHTML = '<i class="fa-solid fa-check-circle"></i>'; // Update icon for card button
    }
    button.style.backgroundColor = "#4CAF50";
  }

  function updateButtonForNewScene(button) {
    button.innerHTML = '<i class="fa-solid fa-download"></i> Add to Whisparr';
    button.style.backgroundColor = "#e385ed";
    button.style.color = "#ffffffcc";
  }

  function hasBeenAdded(dateString) {
    return !(
      dateString.startsWith("0001-01-01") ||
      isNaN(new Date(dateString).getTime())
    );
  }

  // Add loading state to buttons when clicked
  function setLoadingState(button, isHeader) {
    button.disabled = true;
    button.style.backgroundColor = "#cccccc";
    if (isHeader) {
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading';
    } else {
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; // Loading icon only for card button
    }
  }

  // Function to add the scene to Whisparr
  function addSceneToWhisparr(sceneID, button, isHeader) {
    setLoadingState(button, isHeader);
    const fullApiUrl = `${config.apiUrl}?term=${encodeURIComponent(sceneID)}`;
    fetch(fullApiUrl, { method: "GET", headers: createHeaders() })
      .then((response) => response.json())
      .then((data) => {
        if (data?.length > 0) {
          const sceneData = data[0];
          const payload = createPayload(sceneData);
          fetch(`${config.scheme}://${config.userDomain}/api/v3/movie`, {
            method: "POST",
            headers: createHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(payload),
          })
            .then((postResponse) => {
              if (!postResponse.ok) {
                return postResponse.json().then((postData) => {
                  console.log("POST Response:", postData);
                  showToast(
                    postData[0].errorMessage || "Error occurred.",
                    false,
                  );
                });
              }
              return postResponse.json().then((postData) => {
                console.log("POST Response:", postData);
                updateButtonForExistingScene(button, isHeader);
                showToast("Scene added to Whisparr successfully!", true);
              });
            })
            .catch((postError) => {
              console.error("POST Call Error:", postError);
              showToast("Error adding scene to Whisparr.", false);
            });
        } else {
          console.log("No scene data returned from API.");
          showToast("No scene data found for this URL.", false);
        }
      })
      .catch((error) => {
        console.error("API Call Error:", error);
        showToast("Error fetching scene data.", false);
      });
  }

  // Create payload for Whisparr
  function createPayload(sceneData) {
    return {
      title: sceneData.movie.title,
      studio: sceneData.movie.studioTitle,
      foreignId: sceneData.foreignId,
      rootFolderPath: config.rootFolderPath,
      monitored: true,
      addOptions: { searchForMovie: true },
      qualityProfileId: parseInt(config.quality),
    };
  }

  // Mutation observer to handle dynamically loaded content
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        addButtonToCardHeader();
        addButtonsToSceneCards();
      }
    }
  });

  const observerConfig = { childList: true, subtree: true };
  observer.observe(document.body, observerConfig);

  injectFontAwesomeStyles();
  addButtonToCardHeader();
  addButtonsToSceneCards();
})();
