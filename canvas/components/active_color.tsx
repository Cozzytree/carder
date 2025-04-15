type props = {
  color: string;
  label?: string;
  fn: () => void;
};
function ActiveColor({ fn, color, label }: props) {
  return (
    <button
      onClick={fn}
      className="text-sm p-[2px] text-nowrap flex items-center gap-1 flex-col"
    >
      {label && label}
      <span
        style={{ background: color }}
        className="border border-foreground w-5 h-5 rounded-full"
      ></span>
    </button>
  );
}
export default ActiveColor;
