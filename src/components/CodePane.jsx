import Card from "react-bootstrap/Card";
import hljs from "highlight.js/lib/core";
import { solidity } from "highlightjs-solidity";
import { useEffect, useState } from "react";
import parse from "html-react-parser";

export default function CodePane({ code }) {
  const [formattedCode, setFormattedCode] = useState("");
  hljs.registerLanguage("sol", solidity);
  useEffect(() => {
    setFormattedCode(hljs.highlightAuto(code).value);
  }, [code, formattedCode]);

  return (
    <>
      <pre className="bg-dark">
        <code>{parse(formattedCode)}</code>
      </pre>
      {/* <pre className="bg-dark vh-100 codepane-scroll overflow-auto text-white">
        <div className="mt-3 "></div>
      </pre> */}
    </>
  );
}
