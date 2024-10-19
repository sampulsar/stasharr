import { ScenePayloadBuilder } from "../models/ScenePayloadBuilder";
import { WhisparrScene } from "../types/types";
import { Config } from "../models/Config";
import {
  faDownload,
  faCircleCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

// Utility function to create headers
export function createHeaders(config: Config, additionalHeaders = {}) {
  return {
    Accept: "*/*",
    "X-Api-Key": config.whisparrAPIKey,
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
  button.innerHTML = icon(faDownload).html[0]; // Icon only
  return button;
}

export function createHeaderButton(): HTMLButtonElement {
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
  button.innerHTML = icon(faDownload).html[0]; // Icon only
  return button;
}

// Utility function to display a custom toast message
export function showToast(message: string, isSuccess = true) {
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

export function addButtonsToSceneCards(config: Config) {
  const sceneCards = document.querySelectorAll<HTMLElement>(".SceneCard");
  sceneCards.forEach((sceneCard) => {
    if (!sceneCard.querySelector(".whisparrButton")) {
      const button = createCardButton();
      button.classList.add("whisparrButton");
      sceneCard.style.position = "relative"; // Ensure the scene card has positioning to allow absolute button placement
      sceneCard.appendChild(button);
      const sceneUrl = sceneCard.querySelector("a")?.href;
      const sceneID = sceneUrl?.split("/scenes/")[1];
      if (sceneUrl && sceneID) {
        handleSceneLookup(config, button, sceneID, false);
      }
    }
  });
}

export function addButtonToCardHeader(config: Config) {
  const cardHeader = document.querySelector(".scene-info .card-header");
  if (cardHeader && !document.querySelector("#whisparrButtonHeader")) {
    const triggerButton = createHeaderButton();
    cardHeader.appendChild(triggerButton);
    const sceneID = window.location.href.split(
      "https://stashdb.org/scenes/",
    )[1];
    handleSceneLookup(config, triggerButton, sceneID, true);
  }
}

export function handleSceneLookup(
  config: Config,
  button: HTMLButtonElement,
  sceneID: string,
  isHeader: boolean,
) {
  if (sceneID) {
    const fullApiUrl = `${config.whisparrAPIUrl}?term=${encodeURIComponent(sceneID)}`;
    fetch(fullApiUrl, { method: "GET", headers: createHeaders(config) })
      .then((response) => response.json())
      .then((data) => {
        if (data?.length > 0 && hasBeenAdded(data[0].movie.added)) {
          updateButtonForExistingScene(button, isHeader);
        } else {
          if (isHeader) {
            updateButtonForNewScene(button);
          }
          button.addEventListener("click", () =>
            addSceneToWhisparr(config, sceneID, button, isHeader),
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

export function updateButtonForExistingScene(
  button: HTMLButtonElement,
  isHeader: boolean,
) {
  button.disabled = true;
  button.style.color = "#ffffffcc";
  if (isHeader) {
    button.innerHTML = `${icon(faCircleCheck).html[0]} Already in Whisparr`;
  } else {
    button.innerHTML = `${icon(faCircleCheck).html[0]}`; // Update icon for card button
  }
  button.style.backgroundColor = "#4CAF50";
}

export function updateButtonForNewScene(button: HTMLButtonElement) {
  button.innerHTML = `${icon(faDownload).html[0]} Add to Whisparr`;
  button.style.backgroundColor = "#e385ed";
  button.style.color = "#ffffffcc";
}

export function hasBeenAdded(dateString: string) {
  return !(
    dateString.startsWith("0001-01-01") || isNaN(new Date(dateString).getTime())
  );
}

// Add loading state to buttons when clicked
export function setLoadingState(button: HTMLButtonElement, isHeader: boolean) {
  button.disabled = true;
  button.style.backgroundColor = "#cccccc";
  if (isHeader) {
    button.innerHTML = `${icon(faSpinner).html[0]} Loading`;
  } else {
    button.innerHTML = `${icon(faSpinner).html[0]}`; // Loading icon only for card button
  }
}

// Function to add the scene to Whisparr
export function addSceneToWhisparr(
  config: Config,
  sceneID: string,
  button: HTMLButtonElement,
  isHeader: boolean,
) {
  setLoadingState(button, isHeader);
  const fullApiUrl = `${config.whisparrAPIUrl}?term=${encodeURIComponent(sceneID)}`;
  fetch(fullApiUrl, { method: "GET", headers: createHeaders(config) })
    .then((response) => response.json())
    .then((data) => {
      if (data?.length > 0) {
        const sceneData = data[0];
        const payload = createPayload(config, sceneData);
        fetch(
          `${config.scheme}://${config.whisparrDomainOrIPWithPort}/api/v3/movie`,
          {
            method: "POST",
            headers: createHeaders(config, {
              "Content-Type": "application/json",
            }),
            body: JSON.stringify(payload),
          },
        )
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
export function createPayload(config: Config, sceneData: WhisparrScene) {
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
