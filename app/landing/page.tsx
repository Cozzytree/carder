import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

const signs = [
   { p: "google", i: "./google.svg" },
   { p: "github", i: "./github.svg" },
];

const LandPage = () => {
   return (
      <div className="w-full h-full">
         <header className="w-full flex justify-between items-center p-5">
            <div></div>
            <Dialog>
               <DialogTrigger asChild>
                  <Button variant={"simple"} size={"sm"} className="font-semibold">
                     Sign in
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogTitle className="text-lg">Sign in</DialogTitle>
                  <div className="w-full flex flex-col gap-3">
                     {signs.map((s) => (
                        <Button key={s.p} variant={"ghost"} className="font-semibold">
                           <a
                              href={`http://localhost:8000/signup/${s.p}`}
                              className="flex items-center gap-5"
                           >
                              Sign in with
                              <Image
                                 src={`${s.i}`}
                                 width={50}
                                 height={50}
                                 alt={s.p}
                                 className="w-8 h-8"
                              />
                           </a>
                        </Button>
                     ))}
                  </div>
               </DialogContent>
            </Dialog>
         </header>
      </div>
   );
};

export default LandPage;
