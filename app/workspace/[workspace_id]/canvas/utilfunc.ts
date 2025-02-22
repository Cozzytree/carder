import { DefaultIText } from "./default_styles";
import { textTypes } from "./types";

const makeText = (type: textTypes) => {
   switch (type) {
      case "heading":
         return new DefaultIText("Heading", {
            fontSize: 40,
            fontWeight: "bold",
         });
      case "body":
         return new DefaultIText("Body", {
            fontSize: 18,
            fontWeight: 400,
         });
      case "paragrpah":
         return new DefaultIText("paragraph", {
            fontSize: 15,
            fontWeight: 400,
         });
   }
};

export { makeText };
