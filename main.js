import "@fontsource/manrope/variable.css";
import "./src/styles/base.css";

import template from "./src/templates/main.html?raw";
import { Cipher } from "./src/cipher/vigenere";

const qs = (el) => document.querySelector(el);
const qa = (el) => document.querySelectorAll(el);
const df = (el) => document.querySelector(`[data-functional="${el}"]`);

qs("#app").innerHTML = template;

let statusTimeout = null;

const app = new Proxy(
  {
    status: "",
    appStatus: 0,
    currentKey: "",
    currentvalidity: false,
  },
  {
    set(obj, prop, value) {
      obj[prop] = value;
      for (let key in obj) {
        qs("#app").setAttribute(`data-${key}`, obj[key]);
      }
      qa(".app-functional--navy-button-validityPending").forEach(
        (el) => (el.disabled = !obj.currentvalidity)
      );
      if ((prop = "status")) {
        clearTimeout(statusTimeout);
        df("status").innerHTML = obj.status;
        statusTimeout = setTimeout(() => {
          df("status").innerHTML = "";
        }, 1000);
      }
      return true;
    },
  }
);

df("input").addEventListener("input", (e) => {
  let selection = [e.target.selectionStart, e.target.selectionEnd];
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Za-z\n]/g, "");
  e.target.setSelectionRange(selection[0], selection[1]);
  app.currentvalidity = df("input").validity.valid && df("key").validity.valid;

  switch (df("input").value) {
    case "SOLDIER":
      window.location = "https://app.defencejobs.gov.au/olat/";
      break;
    case "RICKROLL":
      window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      break;
  }
});
df("key").addEventListener("input", (e) => {
  let selection = [e.target.selectionStart, e.target.selectionEnd];
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Za-z]/g, "");
  e.target.setSelectionRange(selection[0], selection[1]);
  app.currentKey = e.target.value;
  app.currentvalidity = df("input").validity.valid && df("key").validity.valid;
});

df("encrypt").addEventListener("click", () => {
  let cipherProcessor = new Cipher(app.currentKey);
  let cipherText = cipherProcessor.encrypt(df("input").value);
  df("input").value = cipherText;
});
df("decrypt").addEventListener("click", () => {
  let cipherProcessor = new Cipher(app.currentKey);
  let cipherText = cipherProcessor.decrypt(df("input").value);
  df("input").value = cipherText;
});

df("no").addEventListener("click", () => {
  app.status = "NO ACTION TAKEN";
});

df("input").value = "";
df("key").value = "";

app.appStatus = 1;
app.status = "APP READY";
