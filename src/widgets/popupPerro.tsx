import {
    AppEvents,
    renderWidget,
    useAPIEventListener,
    usePlugin,
    useSessionStorageState,
    useTracker,
    WidgetLocation,
  } from "@remnote/plugin-sdk";
  import { tomaPerrico } from "../lib/perricos";
  import { useEffect, useState } from "react";
  import { motivacionRandom } from "../lib/motivacion";
//   import { randomMotivation } from "../lib/motivation";
  
  function PopupPerro() {
    const plugin = usePlugin();
    const [src, setSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
      const fetchPerro = async () => {
        const perro = await tomaPerrico();
        if (perro) {
          setSrc(perro);
          console.log("URL del perrico:", perro);
        } else {
          console.log("No dog image found.");
        }
      };

      fetchPerro();
    }, []);


    // Pillamos el idioma elegido desde los ajustes
    const idioma: string = useTracker(
      async (reactivePlugin) =>
        await reactivePlugin.settings.getSetting('language'),
      [],
    ) ?? "es";


    // Get the seenCards value from session storage
    const [seenCards] = useSessionStorageState("seenCards", 0);
  
    // Añadimos este método para que el popup también se quite cuando se revele una respuesta, de esta forma
    // el popup no se trasladará a la siguiente flashcard
    useAPIEventListener(AppEvents.RevealAnswer, undefined, async () => {
      const { floatingWidgetId } = await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();
      await plugin.window.closeFloatingWidget(floatingWidgetId);
    });

    useAPIEventListener(AppEvents.QueueCompleteCard, undefined, async () => {
      const { floatingWidgetId } = await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();
      await plugin.window.closeFloatingWidget(floatingWidgetId);
    });
  
    return (
      <>
        {
          <div
            onClick={async () => {
              // Access the "widget context" for the current widget.
              // The widget context for widgets positioned in floating
              // widgets contains the floatingWidgetId which we can use
              // to close the widget when the user clicks on the popup.
              const { floatingWidgetId } = await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();
              await plugin.window.closeFloatingWidget(floatingWidgetId);
            }}
            onKeyDown={async (event) => {
              console.log(event.key)
              if(event.key == "Enter") {
                const { floatingWidgetId } = await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();
                await plugin.window.closeFloatingWidget(floatingWidgetId);
              }
            }}
            className="cursor-pointer rounded-md border border-solid flex gap-1 justify-center align-middle rn-clr-background-primary rn-clr-content-primary w-fit" style={{ paddingRight: "0px" }}
          >
            <img src={src} className="max-h-[160px] max-w-[200px] w-auto h-auto rounded-l-md" style={{ maxHeight: "160px"}}/>
            <div className="flex text-center text-lg pr-2 w-[calc-size(fit-content,_size_+_20px)] items-center">
              {
                idioma == "en" ? 
                  <span className="h-fit p-5 min-w-[200px] whitespace-nowrap">You've seen {seenCards} cards!<br></br>{motivacionRandom(idioma)}</span>
                : idioma == "es" ? 
                  <span className="h-fit p-5 min-w-[200px] whitespace-nowrap">¡Has visto {seenCards} cartas!<br></br>{motivacionRandom(idioma)}</span>
                : null
              }
            </div>
          </div>
        }
      </>
    );
  }
  
  renderWidget(PopupPerro);