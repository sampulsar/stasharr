export namespace StashDB {
  export enum DataAttribute {
    DataPage = "data-page",
  }
  export enum DOMSelector {
    SceneCard = ".SceneCard",
    CardHeader = ".scene-info .card-header",
    StudioTitle = ".studio-title",
    DataPage = `[${DataAttribute.DataPage}]`,
  }
  export enum Module {
    Performers = "performers",
    Studios = "studios",
    Scenes = "scenes",
  }
}
