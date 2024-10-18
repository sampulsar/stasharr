import { Config } from "./models/Config";
import { addButtonToCardHeader, addButtonsToSceneCards } from "./util/util";

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
})();
