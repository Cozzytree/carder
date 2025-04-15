import { DefaultIText } from "./default_styles";
import { textTypes } from "./types";

const makeText = (type: textTypes, idPrefix?: string) => {
  switch (type) {
    case "heading":
      return new DefaultIText(
        "Heading",
        {
          fontSize: 40,
          fontWeight: "bold",
        },
        idPrefix,
      );
    case "body":
      return new DefaultIText(
        "Body",
        {
          fontSize: 18,
          fontWeight: 400,
        },
        idPrefix,
      );
    case "paragrpah":
      return new DefaultIText(
        "paragraph",
        {
          fontSize: 15,
          fontWeight: 400,
        },
        idPrefix,
      );
  }
};

export { makeText };
