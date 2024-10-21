import { Modal } from "bootstrap";
import { showToast } from "../util/util";
import { ModalBuilder } from "./ModalBuilder";
import { Config, ConfigSchema } from "../models/Config";
import { YesNo } from "../enums/YesNo";
import { z } from "zod";
import { SettingKeys } from "../enums/SettingKeys";

export function openSettingsMenu() {
  getSettingsModalObject().show();
}

export function closeSettingsWindow(this: HTMLElement, event: MouseEvent) {
  if (event.target === this) {
    getSettingsModalObject().hide();
  }
}

export function saveSettings(this: HTMLElement, event: MouseEvent) {
  if (event.target === this) {
    getSettingsModalObject().hide();
    //save settings
    window.location.reload(); // refresh page to reload the userscript after changes
    // fire toast after page is reloaded and settings have been saved
    showToast("Settings Saved Successfully", true);
  }
}

function getSettingsModalObject(): Modal {
  const docModal = document.getElementById("stasherr-settingsModal")!;
  if (docModal) {
    const myModal = new Modal(docModal);
    return myModal;
  } else {
    showToast("Cannot get the Settings Modal", false);
    throw new Error("Cannot find element with id: stasherr-settingsModal");
  }
}

export class Settings {
  private _modal: Modal;
  private _config: Config;
  private _configSchema;

  /**
   * Creating a new instance of Settings builds the necessary functionality
   * and logic to allow the user to save and edit settings
   */
  constructor(config: Config) {
    this._config = config;
    this._config.load();
    this._modal = new Modal(this.buildSettingsModal());
    this._configSchema = ConfigSchema;

    console.log(this);
  }

  private buildSettingsModal(): HTMLElement {
    const modalBuilder = new ModalBuilder("stasherr-settingsModal")
      .setModalTitle("Stasherr Settings")
      .addInputField(
        "Scheme",
        SettingKeys.Scheme,
        "select",
        ["http", "https"],
        this._config.scheme,
      )
      .addInputField(
        "Domain",
        SettingKeys.Domain,
        "text",
        undefined,
        "Whisparr URL or IP address with port number",
        this._config.domain,
        "ex. localhost:6969 or whisparr.customdomain.home or whisparr.lan:123",
      )
      .addInputField(
        "API Key",
        SettingKeys.ApiKey,
        "password",
        undefined,
        "Enter your Whisparr API Key",
        this._config.whisparrApiKey,
        "Found in Whisparr under Settings -> General",
      )
      .addInputField(
        "Quality Profile",
        SettingKeys.QualityProfile,
        "text",
        undefined,
        "Name of your desired quality profile",
        this._config.qualityProfile.toString(),
        "Found in Whisparr under Settings -> Profiles",
      )
      .addInputField(
        "Root Folder Path",
        SettingKeys.RootFolderPath,
        "text",
        undefined,
        "Root folder path to where you keep your media",
        this._config.rootFolderPath,
        "Found in Whisparr under Settings -> Media Management",
      )
      .addInputField(
        "Search On Add",
        SettingKeys.SearchForNewMovie,
        "select",
        [YesNo.Yes, YesNo.No],
        undefined,
        "Yes",
        "Would you like Whipsarr to search for scenes after they are added?",
      )
      .addCloseButton("Close", this.closeModalHandler.bind(this))
      .addSaveButton("Save Changes", this.saveModalHandler.bind(this));

    const modalElement = modalBuilder.build();
    document.body.append(modalElement);
    return modalElement;
  }

  private closeModalHandler() {
    this._modal.hide();
  }

  private saveModalHandler() {
    // Create a config object from the input values
    const configData = {
      scheme: this.getInputValue(SettingKeys.Scheme),
      domain: this.getInputValue(SettingKeys.Domain),
      whisparrApiKey: this.getInputValue(SettingKeys.ApiKey),
      qualityProfile: Number.parseInt(
        this.getInputValue(SettingKeys.QualityProfile),
      ),
      rootFolderPath: this.getInputValue(SettingKeys.RootFolderPath),
      searchForNewMovie:
        this.getInputValue(SettingKeys.SearchForNewMovie) === YesNo.Yes,
    };

    // Validate the config data using the schema
    const parsedConfig = this._configSchema.safeParse(configData);

    if (!parsedConfig.success) {
      // Show an error if validation fails
      showToast("Invalid settings. Please review your inputs.", false);
      console.error(parsedConfig.error);
      return;
    }

    // Assign validated values to the config object
    Object.assign(this._config, parsedConfig.data);

    // Save the validated config to persistent storage
    this._config.save();

    // Hide the modal and refresh to apply changes
    this._modal.hide();
    window.location.reload();

    // Provide feedback that settings were saved
    showToast("Settings Saved Successfully", true);
  }

  private getInputValue(id: string): string {
    const input = document.getElementById(`stasherr-${id}`) as HTMLInputElement;
    return input ? input.value : "";
  }

  public openSettingsModal(event: MouseEvent | KeyboardEvent) {
    console.log(this); // this is undefined...
    const modal = document.getElementById("stasherr-settingsModal");
    if (modal) {
      const m = new Modal(modal);
      m.show();
    } else {
      showToast("Stasherr failed to build modal");
    }
  }

  public getConfig(): Config {
    return this._config;
  }
}
