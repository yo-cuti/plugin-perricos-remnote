import { getRandomInt } from "./utils";

export const motivaciones = [
  "Estás bien perrona 🔥",
  "Eres un hueso duro de roer... 🦴",
  "Dale colega! 💪",
  "Enseñales quien es el alfa 🐺",
  "Genial OwO **mueve la colita**",
  "Toma un perrico de regalo 🐕‍🦺",
  "Americano Dios bendito...🙏⛪",
  "Quién está mi chic@ guap@... 😏",
  "¡Bien hecho!",
  "Buen trabajo 💯",
  "Genial ✨",
  "¡Sigue así! 🤑"
];

export const motivacionRandom = () => {
  const idx = getRandomInt(0, motivaciones.length - 1);
  return motivaciones[idx];
};