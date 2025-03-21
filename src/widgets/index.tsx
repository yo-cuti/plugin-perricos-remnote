import {
  WidgetLocation,
  AppEvents,
  RNPlugin,
  declareIndexPlugin,
  ReactRNPlugin,
} from "@remnote/plugin-sdk";
import "../style.css";

async function muestraPerro(
  plugin: RNPlugin,
  position?: { top?: number; bottom?: number; left?: number; right?: number },
  classContainer?: string
) {
  await plugin.window.openFloatingWidget(
    "popupPerro",
    position || { top: 0, bottom: 0, left: 0, right: 0 },
    classContainer
  );
}

async function onActivate(plugin: ReactRNPlugin) {
  // Inicializamos la vairable seenCards del session storage.
  // El session storage es como un estado global del plugin
  // al cual se puede acceder en los componentes del widget.
  //
  // Es mejor que una variable normal en los casos en los que
  // se quiere reaccionar a cambios en el valor de la variable
  // Los componentes pueden usar el hook `useSessionStorage`
  // para re-renderizarse cuando una variable del sesion storage cambia.
  await plugin.storage.setSession("seenCards", 0);

  await plugin.settings.registerNumberSetting({
    id: "cardInterval",
    title: "Número de cartas entre cada perrico",
    defaultValue: 10,
  });

  await plugin.settings.registerDropdownSetting({
    id: "language",
    title: "Idioma de las frases de motivación",
    defaultValue: "es",
    options: [{
      key: "0",
      label: "Español",
      value: "es",
    },
    {
      key: "1",
      label: "English",
      value: "en",
    }]
  });

  // Cuando el usuario completa una carta, comprobamos si ha
  // visto el número de cartas especificado en los ajustes.
  // De ser así mostramos el popup.
  plugin.event.addListener(AppEvents.QueueCompleteCard, undefined, async () => {
    const cardInterval = Number(
      await plugin.settings.getSetting("cardInterval")
    );
    const seenCards: number =
      ((await plugin.storage.getSession<number>("seenCards")) || 0) + 1;
    await plugin.storage.setSession("seenCards", seenCards);
    if (seenCards % cardInterval === 0) {
      // Abre el widget de popup flotante 180px por encima del botón de mostrar respuesta.
      // "rn-queue..." es una clase que representa el contenedor
      // alrededor de los botones de mostrar respuesta.
      // Usamos un pequeño delay con setTimeout para asegurarnos de que la cola y el botón
      // de mostrar respuesta han acabado de renderizarse antes de intentar mostrar el popup.
      setTimeout(() => {
        muestraPerro(plugin, { top: -180, left: 0 }, "rn-queue__show-answer-btn");
      }, 25);
    }
  });

  // Reseteamos la cuenta de cartas vistas cuando el usuario entra a la cola.
  plugin.event.addListener(AppEvents.QueueEnter, undefined, () => {
    plugin.storage.setSession("seenCards", 0);
  });

  // Comando para testear la apariencia del popup.
  await plugin.app.registerCommand({
    id: "muestraPerro",
    name: "Ver Perro",
    action: () => muestraPerro(plugin),
  });

  // Registramos el componente del widget.
  await plugin.app.registerWidget(
    "popupPerro",
    WidgetLocation.FloatingWidget,
    {
      dimensions: {
        width: "auto",
        height: "auto",
      },
    }
  );
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);