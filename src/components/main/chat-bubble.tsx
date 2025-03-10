import React from "react";
import markdownit from "markdown-it";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import "highlight.js/styles/atom-one-dark.css";

type Props = {
  sendBy: "user" | "ai";
  message: string;
};

type mdType = any;

const ChatBubble = ({ sendBy, message }: Props) => {
  const md: mdType = markdownit({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            `<pre class="overflow-x-auto m-0 px-4 rounded-lg bg-gray-900 text-white break-words  whitespace-pre-wrap py-0 my-0">
                <code class="hljs ${lang} block rounded-lg">` +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                `</code>
            </pre>`
          );
        } catch (error) {
          console.log(error);
        }
      }
      return (
        `<div class="overflow-x-auto m-0 px-4 rounded-lg bg-gray-900 text-white break-words  whitespace-pre-wrap">
                <pre><code class="hljs p-0 m-0 my-0">` +
        md.utils.escapeHtml(str) +
        `</code></pre>
                <button class="copy-btn" data-clipboard-text="${str}">📋 Copy</button>
            </div>`
      );
    },
  });

  const htmlContent = md.render(message);
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

  return (
    <>
      <div
        className={cn(
          "tex-black prose prose-blue mb-2 mt-3 max-w-none border px-3 py-2 dark:prose-invert dark:text-white",
          sendBy === "user" ? "rounded-t-2xl rounded-bl-2xl max-w-[600px]" : "rounded-2xl",
        )}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      ></div>
      <div>
        {sendBy === "ai" && (
          <Copy
            onClick={() => {
              navigator.clipboard.writeText(message);
              toast.success("Copied to clipboard");
            }}
            className="mt-3 h-4 w-4 cursor-pointer text-zinc-600"
          />
        )}
      </div>
    </>
  );
};
export default ChatBubble;
