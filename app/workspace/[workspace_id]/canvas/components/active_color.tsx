type props = {
   color: string;
   label?: string;
   fn: () => void;
};
function ActiveColor({ fn, color, label }: props) {
   return (
      <button onClick={fn} className="text-sm p-[2px] flex items-center gap-1">
         <span
            style={{ background: color }}
            className="border border-foreground w-5 h-5 rounded-full"
         ></span>{" "}
         {label && label}
      </button>
   );
}
export default ActiveColor;
