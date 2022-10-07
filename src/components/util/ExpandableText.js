import { useState } from "react";
export default function ExpandableText(props) {
  const { text, shortLength = 200 } = props;

  const [isExpanded, setExpanded] = useState(text.length <= shortLength);
  return (
    <span>
      {isExpanded
        ? text
        : `${text.substring(0, shortLength)}${
            text.length > shortLength ? "..." : ""
          }`}
      {text.length > shortLength && (
        <a
          href="#"
          style={{ marginLeft: "5px" }}
          onClick={(e) => setExpanded(!isExpanded)}
        >
          {isExpanded ? "Less" : "More"}
        </a>
      )}
    </span>
  );
}
