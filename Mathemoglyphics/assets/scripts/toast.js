// Documentation: https://jolty-ui.com/docs/toast

import { Toast } from "https://cdn.jsdelivr.net/npm/jolty@0.6.2/dist/jolty.esm.min.js";

Toast.template(({ content, type, dismiss, autohide }) => {
    const className = `ui-toast ${type ? "ui-toast--" + type : ""}`;
    const closeBtn = dismiss
        ? `<button class="ui-btn-close ui-btn-close--no-bg" aria-label="Close"></button>`
        : "";
    const progress = autohide
        ? '<div class="ui-toast-progress" data-ui-autohide-progress></div>'
        : "";
    return `<div class="${className}" data-ui-dismiss><div class="ui-toast-icon"></div><div class="ui-toast-content">${content}</div>${closeBtn}${progress}</div>`;
});

const toast = {};
toast.success = (content) => new Toast({ content, type: "success" });
toast.info = (content) => new Toast({ content, type: "info" });
toast.error = (content) => new Toast({ content, type: "danger" });
toast.warning = (content) => new Toast({ content, type: "warning" });
toast.message = (content) => new Toast({ content });

document.querySelector("#englishInputCopy").addEventListener("click", (e) => {
    toast.success("Text copied to clipboard.");
});
document.querySelector("#mathInputCopy").addEventListener("click", (e) => {
    toast.success("Text copied to clipboard.");
});
