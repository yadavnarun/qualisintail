import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useDebounce from "../../hooks/useDebounce";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { MdOutlineContentCopy } from "react-icons/md";
import "./pastew.scss";
import Loader from "../../components/loader/loader";
const SyntaxHighlighter = lazy(() =>
  import("react-syntax-highlighter/dist/esm/prism")
);

// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// import "katex/dist/katex.min.css";

function Textarea({ setMarkdownOut }) {
  const [markdown, setMarkdown] = useState("");
  useDebounce(() => setMarkdownOut(markdown), 1000, [markdown]);

  return (
    <div>
      <textarea onChange={(e) => setMarkdown(e.target.value)} />
    </div>
  );
}

function Pastew() {
  let { id } = useParams();

  const [markdownOut, setMarkdownOut] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (id) {
      document.getElementById("pastew-page").classList.add("remove");

      axios
        .get(`/api/pastew/${id}`)
        .then((res) => {
          setMarkdownOut(res.data.message);
        })
        .catch((err) => setOutput(JSON.stringify(err.message)));
    }
  }, [id]);

  useEffect(() => {
    return () => {
      console.log(output);
    };
  }, [output]);

  return (
    <div className="pastew-page" id="pastew-page">
      <div className="left-box">
        <Textarea setMarkdownOut={setMarkdownOut} />
      </div>
      <div className="right-box">
        <ReactMarkdown
          children={markdownOut}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <Suspense fallback={<Loader inline={true} />}>
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={darcula}
                    showLineNumbers={true}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                </Suspense>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>

      <div className="floating-buttons">
        <div
          onClick={() => {
            if (markdownOut !== "") {
              const data = {
                token: sessionStorage.getItem("token"),
                markdown: markdownOut,
              };

              axios
                .post("/api/pastew", data)
                .then((res) => {
                  setOutput(res.data.message);

                  if (navigator.clipboard) {
                    navigator.clipboard
                      .writeText(
                        `https://intail.qualis.ml/#/pastew/${res.data.message}`
                      )
                      .catch(console.log);
                  } else if (window.clipboardData) {
                    window.clipboardData.setData(
                      "Text",
                      `https://intail.qualis.ml/#/pastew/${res.data.message}`
                    );
                  }
                })
                .catch((err) => setOutput(JSON.stringify(err.message)));
            } else {
              setOutput("invalid input");
            }
          }}
        >
          <MdOutlineContentCopy />
          copy link
        </div>
      </div>
    </div>
  );
}

export default Pastew;
