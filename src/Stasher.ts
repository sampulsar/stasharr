import { Config } from "./models/Config";
import { ModalBuilder } from "./settings/ModalBuilder";
import {
  closeSettingsWindow,
  saveSettings,
  Settings,
} from "./settings/settings";
import {
  addButtonToCardHeader,
  addButtonsToSceneCards,
  showToast,
} from "./util/util";

export default class Stasher {
  /**
   * Initializes the userscript with the provided configuration details by
   * creating the appropriate overlays.
   *
   * @param config Configuration details for the stasher userscript
   */
  static init(settings: Settings) {
    if (settings) {
      let config = settings.getConfig();
      if (config.valid()) {
        addButtonToCardHeader(settings.getConfig());
        addButtonsToSceneCards(settings.getConfig());
      } else {
        showToast("Stasherr settings are invalid, you need to configure them");
      }
    } else {
      showToast("Error: Stasherr settings not provided", false);
    }
  }

  static async initMenu(settings: Settings) {
    GM_registerMenuCommand("Settings", settings.openSettingsModal, "s");
  }
}
