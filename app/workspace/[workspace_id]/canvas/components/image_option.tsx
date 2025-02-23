import { PlusCircle } from "lucide-react";
import { RefObject } from "react";
import CanvasC from "../canvas";

type props = {
  canvasC: RefObject<CanvasC | null>;
};

function ImageOption({ canvasC }: props) {
  const handleImage = (f: File) => {
    if (!f || !canvasC.current) return;
    const i = new Image();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const res = e.target?.result;
      if (!res) return;
      i.src = res as string;
      console.log(i);
      await canvasC.current?.createNewImage(res as string);
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="w-full flex flex-col px-2">
      <label
        htmlFor="image-local"
        className="text-sm cursor-pointer flex items-center gap-2"
      >
        Local
        <PlusCircle className="w-5 h-5 border" />
      </label>
      <input
        onChange={(e) => {
          if (e.target.files) {
            handleImage(e.target.files[0]);
          }
        }}
        type="file"
        id="image-local"
        className="hidden"
        multiple={false}
        accept=".png,.jpg,.svg"
      />
    </div>
  );
}

export default ImageOption;
