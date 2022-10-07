import { useState } from "react";
export default function ExpandableText(props) {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <div>
      <div>
        {isExpanded ? props.children : props.children.substring(0, 100)}
      </div>
      <button onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Less" : "More"}
      </button>
    </div>
  );
}
