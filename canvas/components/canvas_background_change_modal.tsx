import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

type props = {
   handleChange: (img: string) => void;
};

function CanvasBackgroundChange({ handleChange }: props) {
   const [imgLink, setImgLink] = useState("");

   return (
      <div>
         <Dialog>
            <DialogTrigger asChild>
               <Button size={"xs"} variant={"simple"}>
                  <ImageIcon />
               </Button>
            </DialogTrigger>
            <DialogContent>
               <DialogTitle>Canvas Background</DialogTitle>

               <div className="flex items-center">
                  <Input
                     onChange={(e) => {
                        setImgLink(e.target.value);
                     }}
                     placeholder="image link"
                  />
                  <Button
                     onClick={() => {
                        if (!imgLink.length) return;
                        handleChange(imgLink);
                     }}
                     size={"xs"}
                     variant={"outline"}
                  >
                     save
                  </Button>
               </div>
               <label
                  htmlFor="c-img"
                  className={buttonVariants({ variant: "outline", size: "xs" })}
               >
                  Select local
               </label>
               <input
                  onChange={(e) => {
                     if (!e.target.files?.length) return;
                     const file = e.target.files[0];
                     const reader = new FileReader();
                     const i = new Image();
                     reader.onload = async (e) => {
                        i.src = e.target?.result as string;
                        handleChange(i.src);
                     };
                     reader.readAsDataURL(file);
                  }}
                  className="hidden"
                  id="c-img"
                  type="file"
                  accept=".png, .jpeg, .webp"
               />
            </DialogContent>
         </Dialog>
      </div>
   );
}

export default CanvasBackgroundChange;
