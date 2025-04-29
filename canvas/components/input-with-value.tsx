import { ReactNode } from "react";

type props = {
   children?: ReactNode;
   val: number;
   change: (v: number) => void;
};

function InputWithValue({ change, children, val }: props) {
   return (
      <div className="w-full flex items-center gap-4 border px-3 py-1">
         {children}
         <input
            value={val.toFixed(1)}
            onChange={(e) => {
               change(+e.target.value);
            }}
            className="w-full border-0 ring-0 focus:outline-0 text-sm font-semibold"
            type="number"
         />
      </div>
   );
}

export default InputWithValue;
