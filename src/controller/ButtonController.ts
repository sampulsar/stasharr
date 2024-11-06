import {
  faCircleCheck,
  faDownload,
  faSearch,
  faSpinner,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Config } from "../models/Config";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { extractSceneID } from "../util/util";
import WhisparrService from "../service/WhisparrService";
import ToastService from "../service/ToastService";
import { SceneStatus } from "../enums/SceneStatus";
import { Styles } from "../enums/Styles";

export class ButtonController {
  static initializeButtons(config: Config) {
    if (config.whisparrApiKey == "") return;
    const sceneCards = document.querySelectorAll<HTMLElement>(
      ".SceneCard:not([data-initialized])",
    );
    sceneCards.forEach(async (sceneCard) => {
      if (!sceneCard.querySelector(".whisparrButton")) {
        const button = ButtonController.createCardButton();
        button.setAttribute("data-initialized", "true");
        sceneCard.appendChild(button);
        const sceneID = extractSceneID(sceneCard);

        if (sceneID) {
          try {
            const status = await WhisparrService.handleSceneLookup(
              config,
              sceneID,
            );
            ButtonController.updateButton(button, status);
            button.addEventListener("click", () =>
              ButtonController.handleButtonClick(config, sceneID, button),
            );
          } catch (error) {
            ToastService.showToast(JSON.stringify(error), false);
            console.log(JSON.stringify(error), error);
          }
        }
      }
    });

    (async () => {
      const cardHeader: HTMLElement | null =
        document.querySelector<HTMLElement>(".scene-info .card-header");

      if (cardHeader && !document.querySelector("#whisparrButtonHeader")) {
        const isHeader = true;
        const triggerButton = ButtonController.createHeaderButton();
        triggerButton.setAttribute("data-initialized", "true");
        cardHeader.appendChild(triggerButton);
        const sceneID = extractSceneID();
        if (sceneID) {
          try {
            const status = await WhisparrService.handleSceneLookup(
              config,
              sceneID,
            );
            ButtonController.updateButton(triggerButton, status, isHeader);
            triggerButton.addEventListener("click", () => {
              ButtonController.handleButtonClick(
                config,
                sceneID,
                triggerButton,
                isHeader,
              );
            });
          } catch (error) {
            ToastService.showToast(JSON.stringify(error), false);
            console.log(JSON.stringify(error), error);
          }
        }
      }
    })();
  }

  private static updateButton(
    button: HTMLButtonElement,
    status: SceneStatus,
    isHeader: boolean = false,
  ) {
    switch (status) {
      case SceneStatus.DOWNLOADED:
        ButtonController.updateButtonForDownloadedScene(button, isHeader);
        break;
      case SceneStatus.EXISTS:
        ButtonController.updateButtonForExistingScene(button, isHeader);
        break;
      case SceneStatus.NEW:
        ButtonController.updateButtonForNewScene(button, isHeader);
        break;
      default:
        break;
    }
  }

  static async handleButtonClick(
    config: Config,
    sceneID: string,
    button: HTMLButtonElement,
    isHeader: boolean = false,
  ) {
    ButtonController.setLoadingState(button, isHeader);
    try {
      const status = await WhisparrService.handleSceneLookup(
        config,
        sceneID,
      );
      if (status === SceneStatus.NEW) {
        const result = await WhisparrService.searchAndAddScene(config, sceneID);
        if (result === SceneStatus.ADDED) {
          ButtonController.updateButtonForExistingScene(button, isHeader);
          ToastService.showToast("Scene added successfully!", true);
        } else {
          ButtonController.updateButtonForNewScene(button, isHeader);
          if (result === SceneStatus.NOT_FOUND) {
            ToastService.showToast("Scene not found!", false);
          } else {
            ToastService.showToast("Error adding Scene!", false);
          }
        }

      } else if (status === SceneStatus.EXISTS) {
        const result = await WhisparrService.search(config, sceneID);
        ButtonController.updateButtonForExistingScene(button, isHeader);
        if (result === SceneStatus.ADDED) {
          ToastService.showToast("Searching for Scene", true);
        } else {
          if (result === SceneStatus.NOT_FOUND) {
            ToastService.showToast("Scene not found!", false);
          } else {
            ToastService.showToast("Error Searching for Scene!", false);
          }
        }
      }
    } catch (error) {
      ToastService.showToast(JSON.stringify(error), false);
      console.log(JSON.stringify(error), error);
    }
  }

  private static createCardButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.style.cssText = Styles.CardButton.style;
    button.innerHTML = icon(faDownload).html[0]; // Icon only
    return button;
  }

  private static createHeaderButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.id = "whisparrButtonHeader";
    button.style.cssText = Styles.HeaderButton.style;
    button.innerHTML = icon(faDownload).html[0]; // Icon only
    return button;
  }

  private static setLoadingState(
    button: HTMLButtonElement,
    isHeader: boolean = false,
  ): void {
    button.disabled = true;
    button.style.backgroundColor = Styles.Color.GRAY;
    button.innerHTML = `${isHeader ? icon(faSpinner, { classes: ["fa-spin"] }).html : ""} Loading`;
  }

  // Update button states
  private static updateButtonForDownloadedScene(
    button: HTMLButtonElement,
    isHeader: boolean,
  ): void {
    ButtonController.updateButtonState(
      button,
      faCircleCheck,
      "Download Complete",
      Styles.Color.GREEN,
      isHeader,
      true
    );
  }

  private static updateButtonForExistingScene(
    button: HTMLButtonElement,
    isHeader: boolean,
  ): void {
    ButtonController.updateButtonState(
      button,
      faSearch,
      "In Whisparr",
      Styles.Color.YELLOW,
      isHeader,
    );
  }

  private static updateButtonForNewScene(
    button: HTMLButtonElement,
    isHeader: boolean,
  ): void {
    ButtonController.updateButtonState(
      button,
      faDownload,
      "Add to Whisparr",
      Styles.Color.PINK,
      isHeader,
    );
  }

  private static updateButtonState(
    button: HTMLButtonElement,
    iconType: IconDefinition,
    text: string,
    backgroundColor: Styles.Color,
    isHeader: boolean,
    disable: boolean = false,
  ): void {
    button.disabled = disable;
    button.style.color =
      backgroundColor === Styles.Color.YELLOW
        ? Styles.Color.BLACK
        : Styles.Color.WHITE;
    button.style.backgroundColor = backgroundColor;
    button.innerHTML = `${icon(iconType).html}${isHeader ? " " + text : ""}`;
  }
}
