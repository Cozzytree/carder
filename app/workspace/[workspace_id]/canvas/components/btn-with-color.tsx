import { Gradient } from "fabric";

type props = {
  onClick?: () => void;
  color: string | Gradient<"linear" | "radical">;
};

function BtnWithColor({ color, onClick }: props) {
  let gradientClass: string[] | string;

  if (color instanceof Gradient) {
    gradientClass = color.colorStops.map((stop) => stop.color);
  } else {
    gradientClass = color;
  }

  return (
    <div
      role="button"
      onClick={onClick}
      style={{
        background: Array.isArray(gradientClass)
          ? `linear-gradient(${gradientClass.join(",")})`
          : gradientClass,
      }}
      className={`${gradientClass} w-6 h-6 rounded-full border-2 border-foreground/30`}
    ></div>
  );
}

export default BtnWithColor;
