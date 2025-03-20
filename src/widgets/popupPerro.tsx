import {
    AppEvents,
    renderWidget,
    useAPIEventListener,
    usePlugin,
    useSessionStorageState,
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

    // Get the seenCards value from session storage
    const [seenCards] = useSessionStorageState("seenCards", 0);
  
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
              // widgets contains the   floatingWidgetId which we can use
              // to close the widget when the user clicks on the popup.
              const { floatingWidgetId } = await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();
              await plugin.window.closeFloatingWidget(floatingWidgetId);
            }}
            className="cursor-pointer rounded-md border border-solid flex gap-1 justify-center align-middle rn-clr-background-primary rn-clr-content-primary w-fit"
          >
            <img src={src} className="max-h-[160px] max-w-[200px] w-auto h-auto rounded-l-md" style={{ maxHeight: "160px"}}/>
            <div className="flex text-center text-lg pr-2 w-[calc-size(fit-content,_size_+_20px)] items-center">
              <span className="h-fit p-5 min-w-[200px] whitespace-nowrap">¡Has acertado {seenCards} cartas!<br></br>{motivacionRandom()}</span>
            </div>
          </div>
        }
      </>
    );
  }
  
  renderWidget(PopupPerro);