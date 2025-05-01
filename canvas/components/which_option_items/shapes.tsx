import { Button } from "@/components/ui/button";
import { lines, others_shapes, shapes } from "../../constants";
import { canvasShapes } from "../../types";
import Image from "next/image";

type props = {
   handleShape: ({
      type,
      path,
      points,
      scale,
   }: {
      type: canvasShapes;
      path?: string;
      points?: { x: number; y: number }[];
      scale?: number;
   }) => void;
};

function Shapes({ handleShape }: props) {
   return (
      <div className="flex flex-col p-3">
         <div className="grid grid-cols-3 rounded-md gap-2">
            {shapes.map((s, i) => (
               <Button
                  variant={"muted"}
                  onClick={() => {
                     handleShape({
                        type: s.type as canvasShapes,
                        path: s.path,
                        points: s.points,
                        scale: s.scale,
                     });
                  }}
                  className="flex border py-3 h-10 justify-center items-center"
                  key={i}
               >
                  <Image
                     src={s.I}
                     alt={s.type}
                     width={60}
                     height={60}
                     className="w-8 text-foreground"
                  />
               </Button>
            ))}
         </div>
         <h3 className="font-semibold pt-2">Lines</h3>
         <div className="grid grid-cols-3 rounded-md gap-2">
            {lines.map((s, i) => (
               <Button
                  onClick={() => {
                     handleShape({ type: s.type, path: s.path, scale: s.scale });
                  }}
                  variant={"muted"}
                  className="flex border py-3 h-10 justify-center items-center"
                  key={i}
               >
                  <Image
                     src={s.I}
                     alt={s.type}
                     width={100}
                     height={100}
                     quality={30}
                     className="w-8"
                  />
               </Button>
            ))}
         </div>
         <h3 className="font-semibold pt-2">Others</h3>
         <div className="grid grid-cols-3 gap-2">
            {others_shapes.map((s, i) => (
               <Button
                  onClick={() => {
                     handleShape({ type: s.type, path: s.path, scale: s.scale });
                  }}
                  className="flex border py-3 h-10 justify-center items-center"
                  variant={"muted"}
                  key={i}
               >
                  <Image
                     src={s.I}
                     alt={s.type}
                     width={100}
                     height={100}
                     quality={30}
                     className="w-12"
                  />
               </Button>
            ))}
         </div>
      </div>
   );
}

export default Shapes;
