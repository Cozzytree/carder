import { Gradient, GradientType } from "fabric";

type props = {
  gradientType?: GradientType;
  onClick?: () => void;
  w?: number;
  h?: number;
  color: string | Gradient<"linear" | "radical"> | string[];
};

function BtnWithColor({
  color,
  onClick,
  gradientType = "linear",
  w = 32,
  h = 32,
}: props) {
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
          ? `${gradientType}-gradient(${gradientClass.join(",")})`
          : gradientClass,
        width: w + "px",
        height: h + "px",
      }}
      className={`${gradientClass}  rounded-full border-2 border-foreground/30`}
    ></div>
  );
}

export default BtnWithColor;
