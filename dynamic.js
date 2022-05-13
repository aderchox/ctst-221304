document.querySelector("nav > button").addEventListener("click", () => {
  const currentLang = localStorage.getItem("lang");
  if (currentLang === "en") {
    localStorage.setItem("lang", "fa");
  } else if (currentLang === "fa") {
    localStorage.setItem("lang", "en");
  } else {
    localStorage.setItem("lang", "fa");
  }
  activateGame();
  return;
});

function getLang() {
  const currentLang = localStorage.getItem("lang");
  if (!currentLang) {
    localStorage.setItem("lang", "en");
    return "en";
  } else return localStorage.getItem("lang");
}

let gamesElems = {
  en: [],
  fa: [],
};
let gamesContents = { en: {}, fa: {} };

async function initData() {
  let games = null;
  games = await fetch("./data/games.json");
  games = await games.json();

  const gamesContentsJsons = await Promise.all([
    fetch("./languages/en.json").then((resp) => resp.json()),
    fetch("./languages/fa.json").then((resp) => resp.json()),
  ]);

  gamesContents.en = gamesContentsJsons[0];
  gamesContents.fa = gamesContentsJsons[1];

  for (const [idx, game] of games.entries()) {
    gameEnElem = createGameElemByLanguage(game, idx, "en");
    gameFaElem = createGameElemByLanguage(game, idx, "fa");

    gamesElems.en.push(gameEnElem);
    gamesElems.fa.push(gameFaElem);
  }
}

function createGameElemByLanguage(game, gameIdx, lang) {
  const main = document.createElement("main");

  // create no-lang-difference elems:
  const gameInfo = document.createElement("div");
  gameInfo.classList.add("info");

  const gameNameSpan = document.createElement("span");
  gameNameSpan.innerHTML = game.name;

  const gameCoverDiv = document.createElement("div");
  const coverImg = document.createElement("img");
  coverImg.src = game.image;
  gameCoverDiv.appendChild(coverImg);
  gameCoverDiv.classList.add("cover");

  // create lang-difference elems here:
  const gameContentHeadingEn = document.createElement("h2");
  gameContentHeadingEn.innerHTML =
    gamesContents[lang]["GAMES"][gameIdx]?.HEADING;

  const gameContentPEn = document.createElement("p");
  gameContentPEn.innerHTML = gamesContents[lang]["GAMES"][gameIdx]?.DESCRIPTION;

  const gameContentBtn = document.createElement("button");
  gameContentBtn.innerHTML = gamesContents[lang].GENERAL.CALL_TO_ACTION;

  gameInfo.appendChild(gameNameSpan);
  gameInfo.appendChild(gameContentHeadingEn);
  gameInfo.appendChild(gameContentPEn);
  gameInfo.appendChild(gameContentBtn);
  main.appendChild(gameInfo);
  main.appendChild(gameCoverDiv);

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

      activateGame();
    });
  }
}

function activateGame() {
  const htmlElem = document.documentElement;
  const lang = getLang();

  if (lang === "en") {
    htmlElem.dir = "ltr";
  } else if (lang === "fa") {
    htmlElem.dir = "rtl";
  }
  htmlElem.lang = lang;

  const gameElem = gamesElems[lang][getActiveGameBtnIdx()];

  const main = document.querySelector("main");
  main.innerHTML = gameElem.innerHTML;
}

function getActiveGameBtnIdx() {
  return (
    parseInt(document.querySelector("nav ul li button.active").innerHTML) - 1
  );
}

init = async () => {
  await initEvents();
  await initData();
  activateGame();
};

init();
