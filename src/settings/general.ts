import {
  buttonDanger,
  getSettingsSection,
  newSettingsSection,
} from "./settings";

export function initGeneralSettings() {
  let generalSection = newSettingsSection("general", "General");
  populateGeneralSection(generalSection);
}

function populateGeneralSection(generalSection: HTMLElement) {
  let settings = fieldSet("general-settings", "Settings");
  settings.append(
    settingsInputField("scheme", "HTTP(S)"),
    settingsInputField("userDomain", "URL{:PORT}"),
    settingsInputField("whisparrAPIKey", "API_KEY"),
    settingsInputField(
      "qualityProfile",
      "Desired Quality Profile (ex. Any or Ultra-HD)",
    ),
  );
  generalSection.appendChild(settings);

  let defaultButton = fieldSet("default-button", "Default Settings");
  let div = document.createElement("div");
  div.classList.add("option");
  div.appendChild(buttonDanger("Reset", resetToDefault));
  defaultButton.append(div);
  generalSection.appendChild(defaultButton);
}

function resetToDefault() {
  let generalSection = getSettingsSection("general")!;
  populateGeneralSection(generalSection);
}

function fieldSet(id: string, label: string) {
  let fieldSet =
    document.getElementById(`stasherr-fieldset-${id}`) ??
    document.createElement("fieldset");
  fieldSet.id = `stasherr-fieldset-${id}`;
  fieldSet.innerHTML = `<legend>${label}</legend>`;
  return fieldSet;
}

function settingsInputField(
  key: string,
  label: string,
  defaultValue?: string,
): HTMLElement {
  let div = document.createElement("div");
  div.classList.add("option");

  let inputElement = document.createElement("input");
  inputElement.id = `stasherr-textBox-${key}`;
  inputElement.name = key;
  inputElement.type = "text";
  inputElement.defaultValue = defaultValue || "";

  let labelElement: HTMLLabelElement = document.createElement("label");
  labelElement.htmlFor = inputElement.id;
  labelElement.innerHTML = label;

  div.appendChild(labelElement);
  div.appendChild(inputElement);
  return div;
}
