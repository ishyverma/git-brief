"use client";

import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  githubUrl: z.string().min(1, { message: "URL is required" }),
  githubToken: z.string().optional(),
});

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/motion-primitives/dialog";
import { Button } from "../ui/button";
import { Loader, Loader2, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";

type Props = {
  id: string;
};

function CreateButton({ id }: Props) {
  const project = api.project.createProject.useMutation();
  const refetch = useRefetch()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      githubUrl: "",
      githubToken: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    project.mutate(
      {
        name: values.name,
        githubUrl: values.githubUrl,
        githubToken: values.githubToken,
      },
      {
        onSuccess: (data) => {
            toast.success("Project has been created")
            refetch()
        },
        onError: (error) => {
            console.log(error)
        }
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mt-2" variant="outline" size="sm">
          <Plus /> Create
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">
            Link Your Github Repository
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter the url of your repository to link it to Git Brief
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Calcom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/calcom/cal.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github Token (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={project.isPending} type="submit">
                { project.isPending && <Loader2 className="animate-spin" />} Create Project
              </Button>
            </form>
          </Form>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

export default CreateButton;
