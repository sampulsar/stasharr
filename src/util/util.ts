import { faL } from "@fortawesome/free-solid-svg-icons";
import { StashDB } from "../enums/StashDB";
import { Tooltip } from "bootstrap";

export function extractSceneID(sceneCard?: HTMLElement) {
  if (sceneCard) {
    const sceneUrl = sceneCard.querySelector("a")?.href;
    return sceneUrl?.split("/scenes/")[1];
  } else {
    return window.location.pathname.split("/")[2];
  }
}

export function shouldButtonsInit(node: HTMLElement): boolean {
  if (
    node.matches(
      StashDB.DOMSelector.SceneCard + ", " + StashDB.DOMSelector.CardHeader,
    ) ||
    node.querySelector(
      StashDB.DOMSelector.SceneCard + ", " + StashDB.DOMSelector.CardHeader,
    )
  ) {
    return true;
  }
  return false;
}

export function shouldStudioInit(node: HTMLElement): boolean {
  if (
    node.matches(StashDB.DOMSelector.StudioTitle) ||
    node.querySelector(StashDB.DOMSelector.StudioTitle)
  ) {
    return true;
  }
  return false;
}

export function shouldScenesListInit(node: HTMLElement): boolean {
  return node.matches(".row");
}

export function addTooltip(element: HTMLElement, tooltip: string): void {
  element.setAttribute("data-bs-toggle", "tooltip");
  element.setAttribute("title", tooltip);
  new Tooltip(element);
}
