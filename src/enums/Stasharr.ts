import { SceneStatus } from "./SceneStatus";
import { StashDB } from "./StashDB";

export namespace Stasharr {
  export enum DataAttribute {
    SceneStatus = "data-stasharr-scenestatus",
  }
  export enum ID {
    CardButton = "stasharr-button",
    HeaderButton = "stasharr-header-button",
    AddAllAvailable = "stasharr-addallavailable",
    SearchAllExisting = "stasharr-searchallavailable",
  }
  export class DOMSelector {
    static CardButton = `#${ID.CardButton}`;
    static HeaderButton = `#${ID.HeaderButton}`;
    static AddAllAvailable = `#${ID.AddAllAvailable}`;
    static SearchAllExisting = `#${ID.SearchAllExisting}`;
    static SceneCardByButtonStatus = (status: SceneStatus) => {
      return (
        `${StashDB.DOMSelector.SceneCard}:has([${DataAttribute.SceneStatus}=` +
        "'" +
        status +
        "'" +
        `])`
      );
    };
  }
}
