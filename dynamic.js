// @ts-check

function getLanguage() {
  const english = "english";
  const currentLanguage = localStorage.getItem("language");
  if (!currentLanguage) {
    // Default language (on first run) will be English.
    localStorage.setItem("language", english);
    return english;
  } else {
    return currentLanguage;
  }
}

async function initializeData(languageURIMap) {
  let gamesContents = null;

  const gamesResponse = await fetch("./data/games.json");
  const gamesData = await gamesResponse.json();
  const game = gamesData[getActiveGameButtonIndex()];

  const uri = languageURIMap[getLanguage()];
  await fetch(`./languages/${uri}.json`).then(
    async (response) => (gamesContents = await response.json())
  );

  const gameFragment = createGameFragment(game, gamesContents);
  return gameFragment;
}

function createGameFragment(game, gamesContents) {
  const fragment = document.createDocumentFragment();

  const htmlFragment = createHtmlFromString(`<div class="info">
      <span></span>
      <h2></h2>
      <p></p>
      <button></button>
    </div>
    <div class="cover">
      <img />
    </div>
  `);

  htmlFragment.querySelector(".info > span").textContent = game.name;
  htmlFragment.querySelector(".info > h2").textContent =
    gamesContents?.GAMES[getActiveGameButtonIndex()].HEADING;
  htmlFragment.querySelector(".info > p").textContent =
    gamesContents?.GAMES[getActiveGameButtonIndex()].DESCRIPTION;
  htmlFragment.querySelector(".info > button").textContent =
    gamesContents?.GENERAL?.CALL_TO_ACTION;
  htmlFragment.querySelector(".cover > img").setAttribute("src", game.image);

  fragment.replaceChildren(htmlFragment);

  return fragment;
}

function createHtmlFromString(stringHtml) {
  const parser = new DOMParser();
  const htmlFragment = document.createDocumentFragment();
  const children = parser.parseFromString(stringHtml, "text/html").body
    .children;
  htmlFragment.replaceChildren(...children);
  return htmlFragment;
}

function initEvents() {
  initializeChangeLanguageEvent();
  initializeGameButtonsEvents();
}

function initializeChangeLanguageEvent() {
  document.querySelector("nav > button").addEventListener("click", () => {
    const currentLanguage = getLanguage();
    if (currentLanguage === "english") {
      localStorage.setItem("language", "farsi");
    } else if (currentLanguage === "farsi") {
      localStorage.setItem("language", "english");
    } else {
      console.error("invalid langauge requested");
    }

    activate();
    return;
  });
}

function initializeGameButtonsEvents() {
  const gameButtons = document.querySelectorAll("nav ul li button");

  for (const [index, gameButton] of gameButtons.entries()) {
    gameButton.addEventListener("click", () => {
      moveActiveClassTo(gameButtons, index);
      activate();
    });
  }

  function moveActiveClassTo(gameButtons, indexToActive) {
    gameButtons.forEach((gameButton, index) => {
      if (index !== indexToActive) {
        gameButton.classList.remove("active");
      } else {
        gameButton.classList.add("active");
      }
    });
  }
}

async function activate() {
  const gameFragment = await initializeData({
    english: "en",
    farsi: "fa",
  });
  const htmlElement = document.documentElement;

  const currentLanguage = getLanguage();
  htmlElement.lang = currentLanguage;
  htmlElement.dir = currentLanguage === "english" ? "ltr" : "rtl";

  const main = document.querySelector("main");
  main.replaceChildren(gameFragment);
}

function getActiveGameButtonIndex() {
  return (
    parseInt(document.querySelector("nav ul li button.active").innerHTML) - 1
  );
}

const init = async () => {
  await activate();
  initEvents();
};

init();
