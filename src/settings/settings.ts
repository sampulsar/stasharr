import { Modal } from "bootstrap";
import { showToast } from "../util/util";
import { ModalBuilder } from "./ModalBuilder";

export function openSettingsMenu() {
  getSettingsModalObject().show();
}

function closeSettingsWindow(this: HTMLElement, event: MouseEvent) {
  if (event.target === this) {
    getSettingsModalObject().hide();
  }
}

function saveSettings(this: HTMLElement, event: MouseEvent) {
  if (event.target === this) {
    getSettingsModalObject().hide();
    //save settings
    window.location.reload(); // refresh page to reload the userscript after changes
    // fire toast after page is reloaded and settings have been saved
    showToast("Settings Saved Successfully", true);
  }
}

export function initSettingsWindow() {
  const modalBuilder = new ModalBuilder("stasherr-settingsModal")
    .setModalTitle("Stasherr Settings")
    .addInputField("Scheme", "scheme", "select", ["http", "https"], "https")
    .addInputField(
      "Domain",
      "domain",
      "text",
      undefined,
      "Whisparr URL or IP address with port number",
      "ex. localhost:6969 or whisparr.customdomain.home or whisparr.lan:123",
    )
    .addInputField(
      "API Key",
      "whisparrApiKey",
      "password",
      undefined,
      "Enter your Whisparr API Key",
      "Found in Whisparr under Settings -> General",
    )
    .addInputField(
      "Quality Profile",
      "qualityProfile",
      "text",
      undefined,
      "Name of your desired quality profile",
      "Found in Whisparr under Settings -> Profiles",
    )
    .addInputField(
      "Root Folder Path",
      "rootFolderPath",
      "text",
      undefined,
      "Root folder path to where you keep your media",
      "Found in Whisparr under Settings -> Media Management",
    )
    .addCloseButton("Close", closeSettingsWindow)
    .addSaveButton("Save Changes", saveSettings);

  const modalElement = modalBuilder.build();
  document.body.append(modalElement);
}

function getSettings(): HTMLElement {
  return document.getElementById("stasherr-settings")!;
}

function getSettingsModalObject(): Modal {
  const docModal = getSettingsModal();
  if (docModal) {
    const myModal = new Modal(docModal);
    return myModal;
  } else {
    showToast("Cannot get the Settings Modal", false);
    throw new Error("Cannot find element with id: stasherr-settingsModal");
  }
}

function getSettingsModal(): HTMLElement {
  return document.getElementById("stasherr-settingsModal")!;
}

export function newSettingsSection(
  id: string,
  title: string,
  description?: string,
): HTMLDivElement {
  let section = document.createElement("div");
  section.id = `stasherr-settingsSection-${id}`;
  section.classList.add("stasherr", "settingsSection");
  getSettings().append(section);

  let heading = document.createElement("h2");
  heading.classList.add("stasherr", "heading");
  heading.innerHTML = title;
  section.append(heading);

  if (description) {
    let text = document.createElement("p");
    text.classList.add("stasherr", "sub-heading");
    text.innerHTML = description;
    section.append(text);
  }

  let body = document.createElement("div");
  body.id = `stasherr-settingsSectionBody-${id}`;
  body.classList.add("stasherr", "settingsSectionBody");
  section.append(body);

  return body;
}

export function buttonPrimary(
  label: string,
  listener: (this: HTMLButtonElement, ev: MouseEvent) => any,
): HTMLElement {
  let button = document.createElement("button");
  button.classList.add("stasherr", "btn", "btn-primary");
  button.addEventListener("click", listener);
  button.innerHTML = label;
  return button;
}

export function buttonDanger(
  label: string,
  listener: (this: HTMLButtonElement, ev: MouseEvent) => any,
): HTMLElement {
  let button = document.createElement("button");
  button.classList.add("stasherr", "btn", "btn-danger");
  button.addEventListener("click", listener);
  button.innerHTML = label;
  return button;
}

export function getSettingsSection(id: string): HTMLElement | null {
  return document.getElementById(`stasherr-settingsSectionBody-${id}`);
}
