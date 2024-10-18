import { ScenePayloadBuilder } from "../models/ScenePayloadBuilder";
import { WhisparrScene } from "../types/types";
import { Config } from "../models/Config";

// Utility function to create headers
export function createHeaders(additionalHeaders = {}) {
  return {
    Accept: "*/*",
    "X-Api-Key": config.apiKey,
    Connection: "keep-alive",
    ...additionalHeaders,
  };
}

export function createCardButton() {
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

export function createHeaderButton() {
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

export function addButtonsToSceneCards() {
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

export function addButtonToCardHeader() {
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

export function handleSceneLookup(button, sceneID, isHeader) {
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

export function updateButtonForExistingScene(button, isHeader) {
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

export function updateButtonForNewScene(button) {
  button.innerHTML = '<i class="fa-solid fa-download"></i> Add to Whisparr';
  button.style.backgroundColor = "#e385ed";
  button.style.color = "#ffffffcc";
}

export function hasBeenAdded(dateString) {
  return !(
    dateString.startsWith("0001-01-01") || isNaN(new Date(dateString).getTime())
  );
}

// Add loading state to buttons when clicked
export function setLoadingState(button, isHeader) {
  button.disabled = true;
  button.style.backgroundColor = "#cccccc";
  if (isHeader) {
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading';
  } else {
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; // Loading icon only for card button
  }
}

// Function to add the scene to Whisparr
export function addSceneToWhisparr(sceneID, button, isHeader) {
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
                showToast(postData[0].errorMessage || "Error occurred.", false);
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
export function createPayload(sceneData: WhisparrScene, config: Config) {
  return new ScenePayloadBuilder()
    .setTitle(sceneData.movie.title)
    .setStudio(sceneData.movie.studioTitle)
    .setForeignId(sceneData.foreignId)
    .setMonitored(true)
    .setSearchForMovie(true)
    .setRootFolderPath(config.rootFolderPath)
    .setQualityProfileId(config.qualityProfileId)
    .build();
}
