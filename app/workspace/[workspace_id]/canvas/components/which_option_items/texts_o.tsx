import { texts } from "../../constants";
import Image from "next/image";
import { textTypes } from "../../types";

type props = {
   handleNewText: (type: textTypes) => void;
};

function TextOptions({ handleNewText }: props) {
   return (
      <div className="flex flex-col">
         <div className="flex flex-col gap-1">
            {texts.map((t, i) => (
               <button
                  onClick={() => {
                     handleNewText(t.type);
                  }}
                  key={i}
                  className="w-full cursor-pointer"
               >
                  <Image
                     src={t.img}
                     alt={t.type}
                     className="w-full object-contain"
                     width={300}
                     height={300}
                  />
               </button>
            ))}
         </div>
      </div>
   );
}

export default TextOptions;
