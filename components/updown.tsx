import { Minus, PlusIcon } from "lucide-react";
import { ChangeEvent, ReactNode, useState } from "react";
import { Button } from "./ui/button";

type props = {
  onChange: (v: number) => void;
  defaultV?: number;
  disabled?: boolean;
  children?: ReactNode;
};

function UpDown({ disabled = false, onChange, defaultV, children }: props) {
  const [val, setVal] = useState(defaultV || 0);

  return (
    <div className="w-full flex items-center gap-1">
      <Button
        disabled={disabled}
        onClick={() => {
          onChange(val - 2);
          setVal(val - 2);
        }}
        size={"xs"}
        variant={"outline"}
      >
        <Minus />
      </Button>

      {children ? (
        children
      ) : (
        <input
          disabled={disabled}
          className="max-w-16 p-1 bg-background rounded-md border"
          value={val}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const n = +e.target.value;
            onChange(n);
            setVal(n);
          }}
          type="number"
        />
      )}
      <Button
        disabled={disabled}
        onClick={() => {
          onChange(val + 2);
          setVal(val + 2);
        }}
        size={"xs"}
        variant={"outline"}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

export default UpDown;
