import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

type props = {
  children?: ReactNode;
  val: number;
  change: (v: number) => void;
};

function InputWithValue({ change, children, val }: props) {
  return (
    <div className="w-full grid grid-cols-[0.4fr_1fr] items-start gap-2">
      {children}
      <Input
        value={val.toFixed(1)}
        onChange={(e) => {
          change(+e.target.value);
        }}
        className="w-full"
        type="number"
      />
    </div>
  );
}

export default InputWithValue;
