import { RefObject } from "react";
import CanvasC from "../../canvas";
import fonts from "../../data/fonts.json";
import { useCanvasStore } from "../../store";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

function FontOptions({ canvasC }: props) {
   const { activeObject, setFabricObject } = useCanvasStore();
   const handleF = async (name: string, url: string) => {
      if (!canvasC.current || !activeObject) return;
      if (await canvasC.current.addNewFont(name, url)) {
         canvasC.current?.changeCanvasProperties(
            activeObject,
            "fontFamily",
            name,
         );
         setFabricObject(activeObject);
      }
   };
   return (
      <div className="flex flex-col px-2 divide-y-2">
         {fonts.fonts.map((f, i) => (
            <button
               className="py-1 hover:bg-foreground/20 transition duration-75"
               onClick={() => {
                  handleF(f.label, f.url);
               }}
               key={i}
            >
               {f.label}
            </button>
         ))}
      </div>
   );
}

export default FontOptions;
