"use client";

import { Commit } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import { motion } from "motion/react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type Props = {
  commit: Commit;
};

const SummaryCard = ({ commit }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="mt-5">
        <div className="flex gap-4">
          <div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                className="rounded-full ring-1 ring-pink-300"
                src={commit.avatarUrl}
                alt="avatarUrl"
                width={45}
                height={45}
              />
            </motion.div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-700">
                {commit.commiter}
              </p>
              <p className="text-sm text-zinc-500">
                {commit.commitedDate.toDateString()}
              </p>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem
                value={`item-${commit.id}`}
                className="-pt-2 w-[70vw]"
              >
                <AccordionTrigger className="text-left text-sm text-neutral-600">
                    <div className="w-[65vw]">
                        {commit.message}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-neutral-600">
                  {commit.summary
                    .split("*")
                    .filter((summary) => summary != "")
                    .map((summary) => (
                      <div>- {summary}</div>
                    ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div
              onClick={() => {
                navigator.clipboard.writeText(commit.commitSha);
                toast.success("Copied to clipboard");
              }}
              className="mt-2 flex w-fit items-center justify-center gap-1 rounded bg-neutral-50 p-1 text-sm text-neutral-500 hover:cursor-pointer hover:bg-neutral-100"
            >
              {commit.commitSha.slice(0, 7)} <Copy className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
