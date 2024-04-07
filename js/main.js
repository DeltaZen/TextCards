import { toJpeg } from "html-to-image";

let browserLang = (window.navigator && window.navigator.language) || "en-US";
browserLang = browserLang.slice(0, 2).toLowerCase();
let placeholder, shareLabel;
if (browserLang === "es") {
  placeholder = "¿Qué estás pensando?";
  shareLabel = "Compartir con...";
} else {
  placeholder = "What's on your mind?";
  shareLabel = "Share with...";
}

let style = 0;
const editor = h(
  "div",
  { id: "editor", class: "grad" + style, contenteditable: true },
  placeholder,
);

function h(tag, attributes, ...children) {
  const element = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach((entry) => {
      element.setAttribute(entry[0], entry[1]);
    });
  }
  element.append(...children);
  return element;
}

function main() {
  const root = document.getElementById("root");

  root.append(editor);

  const reel = h("div", { id: "reel" });
  for (let i = 0; i <= 233; i++) {
    const check = h("i", { class: "check" });
    let gradClass = "thumbnail " + "grad" + i + (style == i ? " selected" : "");
    const gradBtn = h("div", { class: gradClass, data: i }, check);
    gradBtn.onclick = () => setStyle(gradBtn);
    reel.append(gradBtn);
  }
  root.append(reel);

  const shareBtn = h("button", { id: "shareBtn", class: "btn" }, shareLabel);
  shareBtn.onclick = share;
  root.append(shareBtn);
}

function setStyle(btn) {
  editor.classList.remove("grad" + style);
  style = btn.getAttribute("data");
  editor.classList.add("grad" + style);
  const thumbnails = document.getElementsByClassName("thumbnail");
  for (let i = 0; i < thumbnails.length; i++) {
    thumbnails[i].classList.remove("selected");
  }
  btn.classList.add("selected");
}

function share() {
  toJpeg(document.getElementById("editor"), { quality: 0.95 }).then(
    function (dataUrl) {
      const base64 = dataUrl.split(",")[1];
      window.webxdc.sendToChat({
        file: { name: "card.jpeg", type: "image", base64 },
      });
    },
  );
}

main();
