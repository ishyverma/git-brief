"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Input } from "../ui/input";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatBubble from "./chat-bubble";
import { useProject } from "@/hooks/use-project";

type Props = {
  repoId: string;
};

const CodeGPT = ({ repoId }: Props) => {
  const { projectId } = useProject()
  
  let { messages, input, handleInputChange, handleSubmit, status } = useChat({
    experimental_prepareRequestBody: ({ messages }) => {
        return {
            message: messages[messages.length - 1]?.content,
            repoId: projectId
        }
    }
  });

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="h-[100vh] py-5">
        <div className="flex h-full flex-col items-center justify-between">
          <div ref={containerRef} className="w-full scroll-smooth  max-w-[60vw] h-[80vh] pr-8 overflow-y-auto">{messages.map(message => (
            <div className={`${message.role === 'user' ? "justify-self-end" : "justify-self-start"}`} key={message.id}>
                <ChatBubble message={message.content} sendBy={message.role === "user" ? "user" : "ai"} />
            </div>
          ))}</div>
          <div className="relative w-[60vw] pt-5">
            <form action="" onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(e)
            }}>
                <Input
                onChange={handleInputChange}
                value={input}
                placeholder="Ask Anything"
                type="text"
                className="rounded-3xl pb-24 pt-6"
                />
                <button
                disabled={status === "streaming"}
                onClick={handleSubmit}
                className={cn(
                    "absolute bottom-4 right-4 rounded-full border bg-[#F2F3F5] p-[6px] transition-all",
                    input.length !== 0 && "cursor-pointer bg-black",
                )}
                >
                <ArrowUp
                    className={cn(
                    "h-4 w-4 text-[#B4B8C0] transition-all",
                    input.length !== 0 && "text-white",
                    )}
                />
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGPT;
