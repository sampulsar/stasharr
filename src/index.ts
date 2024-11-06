import { ButtonController } from "./controller/ButtonController";
import { StudioSummaryController } from "./controller/StudioSummaryController";
import { Settings } from "./settings/Settings";

(async function () {
  const settings = new Settings();

  // Initialize on initial load
  ButtonController.initializeButtons(settings.config);
  StudioSummaryController.initialize(settings.config);

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (
              node.matches(".SceneCard, .card-header") ||
              node.querySelector(".SceneCard, .card-header")
            ) {
              // Re-initializes when there are new SceneCards or Card Headers
              ButtonController.initializeButtons(settings.config);
            } else if (
              node.matches(".studio-title") ||
              node.querySelector(".studio-title")
            ) {
              // Re-initializes when there are new studio Titel
              StudioSummaryController.initialize(settings.config);
            }
          }
        });
      }
    }
  });

  const observerConfig = { childList: true, subtree: true };
  observer.observe(document.body, observerConfig);

  // Initialize the menu
  await GM_registerMenuCommand("Settings", settings.openSettingsModal);


})();
