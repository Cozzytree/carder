import { ReactNode, useEffect, useRef, useState } from "react";

type props = {
   children?: ReactNode;
   val: number;
   change: (v: number) => void;
};

function InputWithValue({ change, children, val }: props) {
   const [numb, setNumb] = useState(Number(val.toFixed(2)));
   const inputRef = useRef<HTMLInputElement | null>(null);

   useEffect(() => {
      setNumb(Number(val));
      if (inputRef.current) {
         inputRef.current.value = String(val);
      }
   }, [val]);

   const checkNumber = (n: string) => {
      const num = Number(n);
      if (isNaN(num) || !inputRef.current) {
         // If invalid, reset to last valid value
         if (inputRef.current) {
            inputRef.current.value = String(val);
         }
         return;
      }

      change(num);
      setNumb(num);
      inputRef.current.value = String(num);
   };

   useEffect(() => {
      const handle = (e: KeyboardEvent) => {
         if (e.key !== "Enter") return;
         if (document.activeElement !== inputRef.current) return;
         checkNumber(inputRef?.current?.value || "");
      };

      document.addEventListener("keydown", handle);

      return () => {
         document.removeEventListener("keydown", handle);
      };
   }, [val]); // react to val change if needed

   return (
      <div className="w-full flex items-center gap-4 border px-3 py-1">
         {children}
         <input
            step={0.2}
            ref={inputRef}
            value={numb}
            onBlur={(e) => {
               const value = e.target.value;
               checkNumber(value);
            }}
            onChange={(e) => {
               const value = e.target.value;
               const num = Number(value);
               if (isNaN(num) || num < 0) return;
               setNumb(num);
            }}
            className="w-full border-0 ring-0 focus:outline-0 text-sm font-semibold"
            type="number"
         />
      </div>
   );
}

export default InputWithValue;
