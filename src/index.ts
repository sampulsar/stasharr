import { ButtonController } from "./controller/ButtonController";
import { NavbarController } from "./controller/NavbarController";
import { ScenesListController } from "./controller/ScenesListController";
import { StudioSummaryController } from "./controller/StudioSummaryController";
import { StashDB } from "./enums/StashDB";
import { Settings } from "./settings/Settings";
import {
  shouldButtonsInit,
  shouldScenesListInit,
  shouldStudioInit,
} from "./util/util";

(async function () {
  const settings = new Settings();

  // Initialize on initial load
  ButtonController.initializeButtons(settings.config);
  StudioSummaryController.initialize(settings.config);
  ScenesListController.initialize(settings.config);
  const navbarController = new NavbarController(document.body);

  const observer = new MutationObserver((mutationsList) => {
    const path: string[] = window.location.pathname.split("/");
    const module: string | null = path.length > 1 ? path[1] : null;
    const stashId: string | null = path.length > 2 ? path[2] : null;

    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (shouldButtonsInit(node)) {
              observer.disconnect();
              ButtonController.initializeButtons(settings.config);
              observer.observe(document.body, observerConfig);
            }
            if (shouldStudioInit(node)) {
              observer.disconnect();
              StudioSummaryController.initialize(settings.config);
              observer.observe(document.body, observerConfig);
            }
            if (shouldScenesListInit(node)) {
              observer.disconnect();
              ScenesListController.initialize(settings.config);
              observer.observe(document.body, observerConfig);
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
