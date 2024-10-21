export class ModalBuilder {
  private modalElement: HTMLElement;
  private modalContent: HTMLElement;

  constructor(modalId: string) {
    this.modalElement = document.createElement("div");
    this.modalElement.id = modalId;
    this.modalElement.classList.add("fade", "modal");

    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog");

    this.modalContent = document.createElement("div");
    this.modalContent.classList.add("modal-content");

    modalDialog.appendChild(this.modalContent);
    this.modalElement.appendChild(modalDialog);
  }

  setModalTitle(title: string): ModalBuilder {
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("modal-header");

    const titleElement = document.createElement("h5");
    titleElement.classList.add("modal-title");
    titleElement.innerText = title;

    headerDiv.appendChild(titleElement);
    this.modalContent.appendChild(headerDiv);
    return this;
  }

  setModalBody(bodyContent: string): ModalBuilder {
    const bodyDiv = document.createElement("div");
    bodyDiv.classList.add("modal-body");
    bodyDiv.innerText = bodyContent;

    this.modalContent.appendChild(bodyDiv);
    return this;
  }

  addCloseButton(
    label: string,
    onClick: (this: HTMLButtonElement, ev: MouseEvent) => any,
  ): ModalBuilder {
    const footerDiv = this.getOrCreateFooter();
    const closeButton = this.createButton(label, "btn-secondary", onClick);
    footerDiv.appendChild(closeButton);
    return this;
  }

  addSaveButton(
    label: string,
    onClick: (this: HTMLButtonElement, ev: MouseEvent) => any,
  ): ModalBuilder {
    const footerDiv = this.getOrCreateFooter();
    const saveButton = this.createButton(label, "btn-primary", onClick);
    footerDiv.appendChild(saveButton);
    return this;
  }

  build(): HTMLElement {
    return this.modalElement;
  }

  private getOrCreateFooter(): HTMLElement {
    let footerDiv =
      this.modalContent.querySelector<HTMLElement>(".modal-footer");
    if (!footerDiv) {
      footerDiv = document.createElement("div");
      footerDiv.classList.add("modal-footer");
      this.modalContent.appendChild(footerDiv);
    }
    return footerDiv;
  }

  private createButton(
    label: string,
    btnClass: string,
    onClick: (this: HTMLButtonElement, ev: MouseEvent) => any,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add("btn", btnClass);
    button.innerText = label;
    button.addEventListener("click", onClick);
    return button;
  }
}
