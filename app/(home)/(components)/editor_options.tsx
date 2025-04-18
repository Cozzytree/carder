"use client";

import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const opt = [
   { icon: "./whiteboard.svg", label: "Board" },
   { icon: "./document.svg", label: "Doc" },
];

const EditorOptions = () => {
   const [isOpen, setOpen] = useState(false);

   return (
      <div className="flex justify-center">
         {opt.map((o, i) => (
            <Button key={i} variant={"simple"} size={"sm"} className="flex w-20 h-20 rounded-full flex-col items-center">
               <Image src={o.icon} alt={o.label} width={30} height={30} />
               {o.label}
            </Button>
         ))}
         <Button className="flex w-20 h-20 rounded-full flex-col items-center" variant={"simple"} value={"sm"}>
            <Square width={32} height={32} />
            <span>custom</span>
         </Button>
      </div>
   );
};

export default EditorOptions;
