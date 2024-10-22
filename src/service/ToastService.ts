export default class ToastService {
  public static showToast(message: string, isSuccess: boolean = true): void {
    const toastContainer = document.querySelector(".ToastContainer");
    if (toastContainer) {
      const customToast = document.createElement("div");
      customToast.className = "Toast";
      customToast.style.cssText = `
          padding: 10px;
          background-color: ${isSuccess ? "#4CAF50" : "#F44336"};
          color: white;
          margin: 10px;
          border-radius: 5px;
        `;
      customToast.innerText = message;
      toastContainer.appendChild(customToast);
      setTimeout(() => customToast.remove(), 5000);
    } else {
      console.log("ToastContainer not found.");
    }
  }
}
