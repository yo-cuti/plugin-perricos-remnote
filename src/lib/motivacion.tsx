import { getRandomInt } from "./utils";

const motivacionesES = [
    "Estás bien perrona 🔥",
    "Eres un hueso duro de roer... 🦴",
    "Dale colega! 💪",
    "Enseñales quien es el alfa 🐺",
    "genial!! OwO **mueve la colita**",
    "Toma un perrico de regalo 🐕‍🦺",
    "Americano Dios bendito...🙏⛪",
    "Quién es mi chic@ guap@... 😏",
    "¡Bien hecho!",
    "Buen trabajo 💯",
    "Genial ✨",
    "¡Sigue así! 🤑"
];

const motivacionesEN = [
    "You're looking pawsome 🔥", 
    "You're a tough bone to chew... 🦴", 
    "Go for it, buddy! 💪", 
    "Show them who's the alpha dog 🐺", 
    "Awesome!! OwO **wag that tail**", 
    "Here’s a pupper as a gift 🐕‍🦺", 
    "Americano Dios bendito...🙏⛪", 
    "Who's my handsome pup... 😏", 
    "Well done, good pup!", 
    "Good job, fur-tastic 💯", 
    "Great, you're pawsome ✨", 
    "Keep it up, tail wagging! 🤑"
];

export const motivaciones: {[k: string]: string[]} = {
    en: motivacionesEN,
    es: motivacionesES
}

export const motivacionRandom = (idioma: string) => {
  const idx = getRandomInt(0, motivaciones[idioma as keyof Object].length - 1);
  let motivacion = motivaciones[idioma as keyof Object][idx];
  const span = document.createElement("span");
  span.innerText = motivacion;
  const parts = motivacion.split(/\*{2}(.*?)\*{2}/g);
  // Return JSX elements, rendering bold parts as <strong>
  return (
    <span>
      {parts.map((part, index) =>
        index % 2 === 0 ? (
          part // Regular text
        ) : (
          <strong key={index}>{part}</strong> // Bold text
        )
      )}
    </span>
  );
};