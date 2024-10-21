import { Config } from "./models/Config";
import { addButtonToCardHeader, addButtonsToSceneCards } from "./util/util";
import { initGeneralSettings } from "./settings/general";
import { initMenu } from "./settings/menu";
import { initSettingsWindow } from "./settings/settings";

const config: Config = new Config(
  "https",
  "localhost:6969",
  "API_KEY",
  0,
  "/path/to/media/",
);

(async function () {
  // Mutation observer to handle dynamically loaded content
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        addButtonToCardHeader(config);
        addButtonsToSceneCards(config);
      }
    }
  });

  const observerConfig = { childList: true, subtree: true };
  observer.observe(document.body, observerConfig);

  addButtonToCardHeader(config);
  addButtonsToSceneCards(config);

  initSettingsWindow();
  // initGeneralSettings();

  await initMenu();
})();
