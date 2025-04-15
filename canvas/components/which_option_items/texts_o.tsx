import Image from "next/image";
import { textTypes } from "../../types";

type props = {
  handleNewText: (type: textTypes) => void;
};

function TextOptions({ handleNewText }: props) {
  return (
    <div className="flex flex-col px-2">
      <div className="flex flex-col gap-1 divide-y">
        <button
          onClick={() => {
            handleNewText("heading");
          }}
        >
          <h1 className="text-4xl font-bold">Heading</h1>
        </button>

        <button
          onClick={() => {
            handleNewText("body");
          }}
        >
          <h3 className="text-2xl font-bold">Body</h3>
        </button>

        <div className="flex flex-col">
          <h3>Templates</h3>

          <div className="flex flex-col"></div>
        </div>

        {/* {texts.map((t, i) => (
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
        ))} */}
      </div>
    </div>
  );
}

export default TextOptions;
