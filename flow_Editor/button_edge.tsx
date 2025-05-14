import { EdgeProps } from "@xyflow/react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";
import { ButtonEdge as BtnEdge } from "@/components/button-edge";

const ButtonEdge = memo((props: EdgeProps) => {
   const onEdgeClick = () => {
      window.alert(`Edge has been clicked!`);
   };

   return (
      <BtnEdge {...props}>
         <Button onClick={onEdgeClick} size="icon" variant="secondary">
            <MousePointerClick size={16} />
         </Button>
      </BtnEdge>
   );
});

ButtonEdge.displayName = "ButtonEdge";
export default ButtonEdge;
