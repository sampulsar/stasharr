import { faDownload, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

(async function () {
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

  addButtonToCardHeader();
  addButtonsToSceneCards();
})();
