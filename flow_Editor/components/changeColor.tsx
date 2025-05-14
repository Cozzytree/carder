import BtnWithColor from "@/canvas/components/btn-with-color";
import ColorOptions from "@/canvas/components/which_option_items/color_options";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Node } from "@xyflow/react";
import type { NodeData } from "../types/types";

type Props = {
   node: Node;
   prop: string;
   color: string;
   onChange: (newNode: Node) => void;
};

export default function ChangeColor({ color, node, onChange, prop }: Props) {
   const nodeData = node?.data as NodeData;

   const handleColorChange = (color: string) => {
      const newData = { ...nodeData, [prop]: color };
      const newNode: Node = { ...node, data: newData };
      onChange(newNode);
   };

   return (
      <Popover>
         <PopoverTrigger>
            <BtnWithColor color={color} w={25} h={25} />
         </PopoverTrigger>
         <PopoverContent>
            <ColorOptions showGradient={false} handleColor={handleColorChange} />
         </PopoverContent>
      </Popover>
   );
}
