import { Config } from "./models/Config";
import { Settings } from "./settings/settings";
import Stasherr from "./Stasher";

(async function () {
  let settings = new Settings(new Config());
  console.log(settings);

  // Mutation observer to handle dynamically loaded content
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Stasherr.init(settings);
      }
    }
  });

  const observerConfig = { childList: true, subtree: true };
  observer.observe(document.body, observerConfig);

  // Stasherr.init(settings);
  console.log("settings initialized");

  await Stasherr.initMenu(settings).then(() => {
    console.log("Menu initialized");
  });
})();
