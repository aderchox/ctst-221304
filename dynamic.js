const enLang = {
  name: "en",
  dir: "ltr",
};

const faLang = {
  name: "fa",
  dir: "rtl",
};

function getLang() {
  const currentLang = JSON.parse(localStorage.getItem("lang"));
  if (!currentLang) {
    // Default lang (on first run) will be enLang (English)
    localStorage.setItem("lang", JSON.stringify(enLang));
    return enLang;
  } else return currentLang;
}

document.querySelector("nav > button").addEventListener("click", () => {
  const currentLang = getLang();
  if (currentLang?.name === "en") {
    localStorage.setItem("lang", JSON.stringify(faLang));
  } else if (currentLang?.name === "fa") {
    localStorage.setItem("lang", JSON.stringify(enLang));
  } else {
    console.error("invalid langauge requested");
  }

  activate();
  return;
});

let gameElem = null;
let gamesContents = null;

async function initData() {
  let game = null,
    games;
  games = await fetch("./data/games.json");
  games = await games.json();
  game = games[getActiveGameBtnIdx()];

  await fetch(`./languages/${getLang()?.name}.json`).then(
    async (resp) => (gamesContents = await resp.json())
  );

  gameElem = createGameElem(game);
}

function createGameElem(game) {
  const main = document.createElement("main");
  main.innerHTML = `<div class="info">
  <span>${game.name}</span>
  <h2>${gamesContents?.GAMES[getActiveGameBtnIdx()].HEADING}</h2>
  <p>${gamesContents?.GAMES[getActiveGameBtnIdx()].DESCRIPTION}</p>
  <button>${gamesContents?.GENERAL?.CALL_TO_ACTION}</button>
</div>

<div class="cover">
  <img src="${game.image}" />
</div>
`;
  return main;
}

function initEvents() {
  const gameButtons = document.querySelectorAll("nav ul li button");

  for (const [idx, gameBtn] of gameButtons.entries()) {
    gameBtn.addEventListener("click", () => {
      gameButtons.forEach((gameBtn, i) => {
        if (i !== idx) {
          gameBtn.classList.remove("active");
        } else {
          gameBtn.classList.add("active");
        }
      });

      activate();
    });
  }
}

async function activate() {
  await initData();
  const htmlElem = document.documentElement;

  const currentLang = getLang();
  htmlElem.lang = currentLang?.name;
  htmlElem.dir = currentLang?.dir;

  const main = document.querySelector("main");
  main.innerHTML = gameElem.innerHTML;
}

function getActiveGameBtnIdx() {
  return (
    parseInt(document.querySelector("nav ul li button.active").innerHTML) - 1
  );
}

init = async () => {
  await activate();
  initEvents();
};

init();
