import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

const signs = [
   { p: "google", i: "./google.svg" },
   { p: "github", i: "./github.svg" },
];

const LandPage = () => {
   return (
      <div className="w-full h-full space-y-8">
         <header className="w-full flex justify-between items-center p-5">
            <div></div>
            <Dialog>
               <DialogTrigger asChild>
                  <Button variant={"secondary"} size={"lg"} className="font-semibold">
                     Sign in
                  </Button>
               </DialogTrigger>
               <DialogContent className="">
                  <DialogTitle className="text-lg">Sign in</DialogTitle>
                  <div className="w-full flex flex-col gap-3">
                     {signs.map((s) => (
                        <Button key={s.p} variant={"ghost"} className="font-semibold rounded-xs">
                           <a
                              href={`http://localhost:8000/signup/${s.p}`}
                              className="flex items-center gap-5"
                           >
                              Sign in with
                              <Image
                                 src={`${s.i}`}
                                 width={45}
                                 height={45}
                                 alt={s.p}
                                 className="w-7 h-7"
                              />
                           </a>
                        </Button>
                     ))}
                  </div>
               </DialogContent>
            </Dialog>
         </header>

         <div className="w-full flex flex-col gap-4 items-center">
            <h3 className="text-xl font-semibold">Design and Enjoy.</h3>
            <Button className="font-semibold" size={"default"}>
               <Link href={"/demo"}>Trial</Link>
            </Button>
         </div>
      </div>
   );
};

export default LandPage;
