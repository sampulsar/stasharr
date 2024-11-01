export namespace Styles {
  export enum Color {
    PINK = "#e385ed",
    WHITE = "#ffffffcc",
    YELLOW = "#4CAF50",
    GRAY = "#cccccc",
    GREEN = "#FFEE2E",
    RED = "#F44336",
  }

  export class CardButton {
    static style: string = `
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: ${Color.PINK};
        border: none;
        border-radius: 10%;
        padding: 5px;
        cursor: pointer;
        color: ${Color.WHITE};
    `;
  }

  export class HeaderButton {
    static style: string = `
        background-color: ${Color.PINK};
        color: ${Color.WHITE};
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
  }

  export class Toast {
    static style(isSuccess: boolean) {
      return `
        padding: 10px;
        background-color: ${isSuccess ? Styles.Color.YELLOW : Styles.Color.RED};
        color: white;
        margin: 10px;
        border-radius: 5px;
      `;
    }
  }
}
