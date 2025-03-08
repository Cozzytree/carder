import {
  CaseUpperIcon,
  Image,
  LucideIcon,
  PencilIcon,
  TriangleIcon,
} from "lucide-react";
import { whichOption } from "../types";
import CanvasC from "../canvas";
import { RefObject } from "react";
import { useWhichOptionsOpen } from "../store";
import { useIsMobile } from "../hooks/isMobile";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function CanvasElements({ canvasC }: props) {
  const { isMobile } = useIsMobile();

  return <>{!isMobile && <CanvasElementStandard canvasC={canvasC} />}</>;
}

const whichOptions: { label: whichOption; I: LucideIcon }[] = [
  { label: "images", I: Image },
  { label: "text", I: CaseUpperIcon },
  { label: "shapes", I: TriangleIcon },
  { label: "draw", I: PencilIcon },
];
function CanvasElementStandard({
  canvasC,
}: {
  canvasC: RefObject<CanvasC | null>;
}) {
  const { setWhichOption, which } = useWhichOptionsOpen();

  return (
    <div className="w-full flex flex-col divide-y-2">
      {whichOptions.map((o, i) => (
        <button
          onClick={() => {
            if (!canvasC.current) return;
            if (which == o.label) {
              setWhichOption(null);
            } else {
              if (o.label === "draw") {
                canvasC.current.canvasToggleDrawMode();
              }
              setWhichOption(o.label);
            }
          }}
          className={`${o.label === which && "bg-foreground/10"} flex py-2 flex-col items-center hover:bg-foreground/10 transition-all duration-75`}
          key={i}
        >
          <o.I />
          <span className="text-sm text-foreground/80">
            {o.label[0].toUpperCase() + o.label.slice(1, o.label.length)}
          </span>
        </button>
      ))}
    </div>
  );
}

export { CanvasElements };
