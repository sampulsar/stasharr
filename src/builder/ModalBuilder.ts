import { Tooltip } from "bootstrap";

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

    const closeElement = document.createElement("button");
    closeElement.classList.add("btn-close");
    closeElement.setAttribute("data-bs-dismiss", "modal");
    closeElement.ariaLabel = "Close";

    headerDiv.appendChild(titleElement);
    headerDiv.appendChild(closeElement);
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

  addInputField(
    label: string,
    name: string,
    type: "text" | "number" | "email" | "password" | "select",
    options?: string[], // For dropdown inputs
    placeholder?: string,
    defaultValue?: string,
    tooltip?: string, // Tooltip parameter
  ): ModalBuilder {
    const bodyDiv = this.getOrCreateBody();

    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    // Create label with tooltip if provided
    const inputLabel = document.createElement("label");
    inputLabel.innerText = label;
    inputLabel.setAttribute("for", `stasharr-${name}`);

    if (tooltip) {
      inputLabel.setAttribute("data-bs-toggle", "tooltip");
      inputLabel.setAttribute("title", tooltip);
    }

    formGroup.appendChild(inputLabel);

    let inputElement: HTMLElement;
    if (type === "select" && options) {
      inputElement = document.createElement("select");
      inputElement.classList.add("form-control");
      inputElement.id = `stasharr-${name}`;
      (inputElement as HTMLInputElement).setAttribute(
        "autocomplete",
        `stasharr-${name}`,
      );
      inputElement.setAttribute("name", name);

      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.innerText = option;
        inputElement.appendChild(optionElement);
      });
    } else {
      inputElement = document.createElement("input");
      (inputElement as HTMLInputElement).type = type;
      (inputElement as HTMLInputElement).classList.add("form-control");
      (inputElement as HTMLInputElement).id = `stasharr-${name}`;
      (inputElement as HTMLInputElement).name = name;
      if (placeholder) {
        (inputElement as HTMLInputElement).placeholder = placeholder;
      }
      if (defaultValue) {
        (inputElement as HTMLInputElement).value = defaultValue;
      }
    }

    // Add tooltip to the input element as well, if specified
    if (tooltip) {
      inputElement.setAttribute("data-bs-toggle", "tooltip");
      inputElement.setAttribute("title", tooltip);
    }

    formGroup.appendChild(inputElement);
    bodyDiv.appendChild(formGroup);

    // Initialize Bootstrap tooltips for new elements
    this.initializeTooltips(inputLabel);
    if (inputElement) {
      this.initializeTooltips(inputElement);
    }

    return this;
  }

  addCloseButton(
    label: string,
    onClick: (this: HTMLButtonElement, ev: MouseEvent) => any,
  ): ModalBuilder {
    const footerDiv = this.getOrCreateFooter();
    const closeButton = this.createButton(label, "btn-secondary", onClick);
    closeButton.setAttribute("data-bs-dismiss", "modal");
    footerDiv.appendChild(closeButton);
    return this;
  }

  addSaveButton(
    label: string,
    onClick: (this: HTMLButtonElement, ev: MouseEvent) => any,
  ): ModalBuilder {
    const footerDiv = this.getOrCreateFooter();
    const saveButton = this.createButton(label, "btn-primary", onClick);
    saveButton.setAttribute("data-bs-dismiss", "modal");
    footerDiv.appendChild(saveButton);
    return this;
  }

  build(): HTMLElement {
    return this.modalElement;
  }

  private getOrCreateBody(): HTMLElement {
    let bodyDiv = this.modalContent.querySelector<HTMLElement>(".modal-body");
    if (!bodyDiv) {
      let form = document.createElement("form");
      bodyDiv = document.createElement("div");
      bodyDiv.classList.add("modal-body");
      form.appendChild(bodyDiv);
      this.modalContent.appendChild(form);
    }
    return bodyDiv;
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

  private initializeTooltips(element: HTMLElement): void {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call([element]);
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }
}
