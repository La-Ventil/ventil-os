let avatarKey = "";
let l5 = "";
let l7 = "";
let l11 = "face-shape-1";
let l20 = "eyes-1";
let l23 = "eyebrows-1";
let l24 = "";
let l25 = "";
let l28 = "";
let l30 = "mouth-5";
let l35 = "nose-1";
let l38 = "";
let l40 = "";
let l41 = "";
let l50 = "hair-1";
let sColor = "skin-color-4";
let hColor = "hair-color-13";
let gColor = "glasses-color-1";
let tColor = "glasses-tiles-color-1";
let cColor = "cheeks-color-1";
let eColor = "earrings-color-1";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomElement(type) {
  let categoryID = document.getElementById(type);
  let length = categoryID.getElementsByTagName("button").length;
  let itemSelect = getRandomInt(0, length);
  let items = document.getElementById(type).querySelectorAll("button");
  let target = items[itemSelect];
  target.classList.add("active");
  return target.getAttribute("id");
}

function random() {
  l11 = getRandomElement("face");
  sColor = getRandomElement("skin");
  l50 = getRandomElement("hair");
  hColor = getRandomElement("hair-color");
  l30 = getRandomElement("mouth");
  l35 = getRandomElement("nose");
  l20 = getRandomElement("eyes");
  l23 = getRandomElement("eyebrows");
  generateKey();
}

document.querySelector("#random").addEventListener("click", () => {
  random();
});

function generateKey() {
  avatarKey =
    l5 +
    " " +
    l7 +
    " " +
    l11 +
    " " +
    l20 +
    " " +
    l23 +
    " " +
    l24 +
    " " +
    l25 +
    " " +
    l28 +
    " " +
    l30 +
    " " +
    l35 +
    " " +
    l38 +
    " " +
    l40 +
    " " +
    l41 +
    " " +
    l50 +
    " " +
    sColor +
    " " +
    hColor +
    " " +
    gColor +
    " " +
    tColor +
    " " +
    cColor +
    " " +
    eColor;
  document
    .querySelectorAll(".avatar")
    .forEach((target) => target.setAttribute("class", "avatar"));
  document
    .querySelectorAll(".avatar")
    .forEach((target) =>
      target.setAttribute("class", "avatar no-body" + avatarKey),
    );
  avatarKey = avatarKey.replace(/\s+/g, " ").trim();
  document.getElementById("key").innerHTML = "";
  document.getElementById("key").innerHTML = "avatar " + avatarKey;
}

generateKey();

document.querySelectorAll(".option-buttons button").forEach(function (item) {
  item.addEventListener("click", (event) => {
    let buttonValue = event.currentTarget.getAttribute("data-value") ?? event.currentTarget.getAttribute("id") ?? "";
    let buttonPart = event.currentTarget.getAttribute("data-type");
    if (buttonPart === "face") {
      l11 = buttonValue;
      generateKey();
    }
    if (buttonPart === "face-details") {
      l40 = buttonValue;
      generateKey();
    }
    if (buttonPart === "cheeks") {
      l41 = buttonValue;
      generateKey();
    }
    if (buttonPart === "eyes") {
      l20 = buttonValue;
      generateKey();
    }
    if (buttonPart === "mouth") {
      l30 = buttonValue;
      generateKey();
    }
    if (buttonPart === "nose") {
      l35 = buttonValue;
      generateKey();
    }
    if (buttonPart === "earrings") {
      l7 = buttonValue;
      generateKey();
    }
    if (buttonPart === "glasses") {
      l25 = buttonValue;
      l24 = buttonValue;
      generateKey();
    }
    if (buttonPart === "eyebrows") {
      l23 = buttonValue;
      generateKey();
    }

    if (buttonPart === "hair") {
      l50 = buttonValue;
      generateKey();
    }
    if (buttonPart === "facial-hair") {
      l28 = buttonValue;
      generateKey();
    }
  });
});

document
  .querySelectorAll(".face-color-buttons button")
  .forEach(function (item) {
    item.addEventListener("click", (event) => {
      let buttonValue = event.currentTarget.getAttribute("id");
      sColor = buttonValue;
      generateKey();
    });
  });

document
  .querySelectorAll(".hair-color-buttons button")
  .forEach(function (item) {
    item.addEventListener("click", (event) => {
      let buttonValue = event.currentTarget.getAttribute("id");
      hColor = buttonValue;
      generateKey();
    });
  });

document
  .querySelectorAll(".glasses-color-buttons button")
  .forEach(function (item) {
    item.addEventListener("click", (event) => {
      let buttonValue = event.currentTarget.getAttribute("id");
      gColor = buttonValue;
      generateKey();
    });
  });
document
  .querySelectorAll(".tile-glasses-color-buttons button")
  .forEach(function (item) {
    item.addEventListener("click", (event) => {
      let buttonValue = event.currentTarget.getAttribute("id");
      tColor = buttonValue;
      generateKey();
    });
  });

document
  .querySelectorAll(".cheeks-color-buttons button")
  .forEach(function (item) {
    item.addEventListener("click", (event) => {
      let buttonValue = event.currentTarget.getAttribute("id");
      cColor = buttonValue;
      generateKey();
    });
  });

document
  .querySelectorAll(".earrings-color-buttons button")
  .forEach(function (item) {
    item.addEventListener("click", (event) => {
      let buttonValue = event.currentTarget.getAttribute("id");
      eColor = buttonValue;
      generateKey();
    });
  });
