const enLang = {
  name: "en",
  dir: "ltr",
};

const faLang = {
  name: "fa",
  dir: "rtl",
};

// Default lang (on first run) will be enLang (English)
let currentLang = enLang;

document.querySelector("nav > button").addEventListener("click", () => {
  console.log("currentLang", currentLang);
  if (currentLang?.name === "en") {
    currentLang = faLang;
  } else if (currentLang?.name === "fa") {
    currentLang = enLang;
  } else {
    console.error("invalid langauge requested");
  }

  activate();
  return;
});

// function getLang() {
//   const currentLang = localStorage.getItem("lang");
//   if (!currentLang) {
//     localStorage.setItem("lang", enLang);
//     return enLang;
//   } else return localStorage.getItem("lang");
// }

let gameElem = null;
let gamesContents = null;

async function initData() {
  let game = null,
    games;
  games = await fetch("./data/games.json");
  games = await games.json();
  game = games[getActiveGameBtnIdx()];

  await fetch(`./languages/${currentLang.name}.json`).then(
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

  htmlElem.lang = currentLang.name;
  htmlElem.lang = currentLang.dir;

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
