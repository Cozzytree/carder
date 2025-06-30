"use client";

import { Button } from "@/components/ui/button";
import ZoomWrapper from "@/components/zoomable";

export default function Page() {
   return (
      <div className="min-h-screen w-full flex justify-center items-center">
         <div className="w-full h-screen">
            <ZoomWrapper>
               <App />
            </ZoomWrapper>
         </div>
      </div>
   );
}

function App() {
   return (
      <div className="w-full h-full bg-muted">
         HELLO SEATTLE
         {/* <Button
            onClick={() => {
               setZoom(zoom - 0.1);
            }}
         >
            {zoom}
         </Button>
         <Button
            onClick={() => {
               setZoom(zoom + 0.1);
            }}
         >
            {zoom}
         </Button> */}
      </div>
   );
}
