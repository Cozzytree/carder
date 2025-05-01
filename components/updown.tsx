import { Minus, PlusIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Input } from "./ui/input";

type props = {
   rate?: number;
   onChange: (v: number) => void;
   defaultV?: number;
   disabled?: boolean;
   children?: ReactNode;
};

function UpDown({ disabled = false, onChange, defaultV, children, rate = 2 }: props) {
   const [val, setVal] = useState(defaultV || 0);

   return (
      <div className="w-full flex items-center justify-center gap-2">
         <button
            disabled={disabled}
            onClick={() => {
               onChange(val - rate);
               setVal(val - rate);
            }}
         >
            <Minus className="w-4 h-5" />
         </button>

         {children ? (
            children
         ) : (
            <Input
               disabled={disabled}
               className="max-w-16 text-sm px-1 bg-background rounded-md border"
               value={val}
               onChange={(e) => {
                  const n = +e.target.value;
                  onChange(n);
                  setVal(n);
               }}
               type="number"
            />
         )}
         <button
            disabled={disabled}
            onClick={() => {
               onChange(val + rate);
               setVal(val + rate);
            }}
         >
            <PlusIcon className="2-5 h-5" />
         </button>
      </div>
   );
}

export default UpDown;
