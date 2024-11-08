export function extractSceneID(sceneCard?: HTMLElement) {
  if (sceneCard) {
    const sceneUrl = sceneCard.querySelector("a")?.href;
    return sceneUrl?.split("/scenes/")[1];
  } else {
    return window.location.href.split("https://fansdb.cc/scenes/")[1];
  }
}
