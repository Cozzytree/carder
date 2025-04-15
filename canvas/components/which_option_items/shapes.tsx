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
      <div className="grid grid-cols-2 rounded-md">
        {shapes.map((s, i) => (
          <Button
            variant={"outline"}
            onClick={() => {
              handleShape({
                type: s.type as canvasShapes,
                path: s.path,
                points: s.points,
                scale: s.scale,
              });
            }}
            className="flex border py-3 h-16 justify-center items-center"
            key={i}
          >
            <Image
              src={s.I}
              alt={s.type}
              width={100}
              height={100}
              quality={30}
              className="w-12 text-foreground"
            />
          </Button>
        ))}
      </div>
      <h3 className="font-semibold pt-2">Lines</h3>
      <div className="grid grid-cols-2">
        {lines.map((s, i) => (
          <Button
            onClick={() => {
              handleShape({ type: s.type, path: s.path, scale: s.scale });
            }}
            className="h-16 py-3"
            variant={"outline"}
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
      <h3 className="font-semibold pt-2">Others</h3>
      <div className="grid grid-cols-2">
        {others_shapes.map((s, i) => (
          <Button
            onClick={() => {
              handleShape({ type: s.type, path: s.path, scale: s.scale });
            }}
            className="w-full h-16"
            variant={"outline"}
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
