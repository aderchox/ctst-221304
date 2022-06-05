const enLanguage = {
  name: "en",
  dir: "ltr",
};

const faLanguage = {
  name: "fa",
  dir: "rtl",
};

function getLanguage() {
  const currentLanguage = JSON.parse(localStorage.getItem("language"));
  if (!currentLanguage) {
    // Default language (on first run) will be enLanguage (English)
    localStorage.setItem("language", JSON.stringify(enLanguage));
    return enLanguage;
  } else {
    return currentLanguage;
  }
}

async function initializeData() {
  let gamesContents = null;

  const gamesResponse = await fetch("./data/games.json");
  const gamesData = await gamesResponse.json();
  const game = gamesData[getActiveGameButtonIndex()];

  await fetch(`./languages/${getLanguage()?.name}.json`).then(
    async (response) => (gamesContents = await response.json())
  );

  const gameElement = createGameElement(game, gamesContents);
  return gameElement;
}

function createGameElement(game, gamesContents) {
  const main = document.createElement("main");
  main.innerHTML = `<div class="info">
  <span>${game.name}</span>
  <h2>${gamesContents?.GAMES[getActiveGameButtonIndex()].HEADING}</h2>
  <p>${gamesContents?.GAMES[getActiveGameButtonIndex()].DESCRIPTION}</p>
  <button>${gamesContents?.GENERAL?.CALL_TO_ACTION}</button>
</div>

<div class="cover">
  <img src="${game.image}" />
</div>
`;
  return main;
}

function initEvents() {
  initializeChangeLanguageEvent();
  initializeGameButtonsEvents();
}

function initializeChangeLanguageEvent() {
  document.querySelector("nav > button").addEventListener("click", () => {
    const currentLanguage = getLanguage();
    if (currentLanguage?.name === "en") {
      localStorage.setItem("language", JSON.stringify(faLanguage));
    } else if (currentLanguage?.name === "fa") {
      localStorage.setItem("language", JSON.stringify(enLanguage));
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
  const gameElement = await initializeData();
  const htmlElem = document.documentElement;

  const currentLanguage = getLanguage();
  htmlElem.lang = currentLanguage?.name;
  htmlElem.dir = currentLanguage?.dir;

  const main = document.querySelector("main");
  main.innerHTML = gameElement.innerHTML;
}

function getActiveGameButtonIndex() {
  return (
    parseInt(document.querySelector("nav ul li button.active").innerHTML) - 1
  );
}

init = async () => {
  await activate();
  initEvents();
};

init();
