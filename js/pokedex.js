import { getPokemon, getSpecies } from "./api.js";
import { createChart } from "./charts.js";

const $image = document.querySelector("#image");
export function setImage(image) {
  $image.src = image;
}

const $description = document.querySelector("#description");
function setDescription(text) {
  $description.textContent = text;
}

const $screen = document.querySelector("#screen");

function loader(isLoading = false) {
  const img = isLoading ? "url(./images/loading.gif)" : "";
  $screen.style.backgroundImage = img;
}
// ORIGINAL
// const $light = document.querySelector("#light");
// function speech(text) {
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.lang = "es-Us";
//   speechSynthesis.speak(utterance);
//   $light.classList.add("is-animated");

//   utterance.addEventListener("end", () => {
//     $light.classList.remove("is-animated");
//   });
// }
// ORIGINAL

// intento 2
const $light = document.querySelector("#light");
let currentUtterance = null;

function speech(text) {
  if (currentUtterance) {
    speechSynthesis.cancel();
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-US";
  utterance.addEventListener("end", () => {
    $light.classList.remove("is-animated");
    currentUtterance = null;
  });
  speechSynthesis.speak(utterance);
  $light.classList.add("is-animated");
  currentUtterance = utterance;
}
const $mega = document.querySelector("#random-pokemon");
$mega.addEventListener("click", () => {
  speech();
});

const stopSpeech = document.getElementById("stop");
let speechSynth = window.speechSynthesis;

stopSpeech.addEventListener("click", () => {
  $light.classList.remove("is-animated");
  currentUtterance = null;
  speechSynth.cancel();
});

export async function findPokemon(id) {
  const pokemon = await getPokemon(id);
  const species = await getSpecies(id);
  const description = species.flavor_text_entries.find(
    (flavor) => flavor.language.name === "es"
  );
  const sprites = [pokemon.sprites.front_default];

  const stats = pokemon.stats.map((item) => item.base_stat);
  for (const item in pokemon.sprites) {
    if (
      item !== "front_default" &&
      (item !== "other") & (item !== "versions") &&
      pokemon.sprites[item]
    ) {
      sprites.push(pokemon.sprites[item]);
    }
  }
  return {
    sprites,
    description: description.flavor_text,
    id: pokemon.id,
    name: pokemon.name,
    stats,
  };
}

let activeChart = null;
export async function setPokemon(id) {
  // encender loader
  loader(true);
  const pokemon = await findPokemon(id);
  loader(false);
  // apagar loader
  setImage(pokemon.sprites[0]);
  setDescription(pokemon.description);
  speech(`${pokemon.name}.${pokemon.description}`);
  if (activeChart instanceof Chart) {
    activeChart.destroy();
  }
  activeChart = createChart(pokemon.stats);
  return pokemon;
}
