import { Button } from "@/components/ui/button";
import { lines, shapes } from "../../constants";
import { canvasShapes } from "../../types";

type props = {
   handleShape: (type: canvasShapes, path?: string) => void;
};

function Shapes({ handleShape }: props) {
   return (
      <div className="flex flex-col">
         <div className="grid grid-cols-2">
            {shapes.map((s, i) => (
               <Button
                  onClick={() => {
                     handleShape(s.type, s.path);
                  }}
                  className="h-16"
                  variant={"outline"}
                  key={i}
               >
                  <s.I className="scale-[2]" />
               </Button>
            ))}
         </div>
         <h3 className="font-semibold pt-2">Lines</h3>
         <div className="grid grid-cols-2">
            {lines.map((s, i) => (
               <Button
                  onClick={() => {
                     handleShape(s.type, s.path);
                  }}
                  className="h-16"
                  variant={"outline"}
                  key={i}
               >
                  <s.I className="scale-[2]" />
               </Button>
            ))}
         </div>
      </div>
   );
}

export default Shapes;
