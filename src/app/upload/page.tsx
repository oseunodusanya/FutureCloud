"use client";

import { Button } from "@/components/ui/button";
import { SignedOut, useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Doc } from "../../../convex/_generated/dataModel";
import OpenAI from "openai";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";



export default function UploadPage() {
    const createFile = useMutation(api.files.createFile)
    const user = useUser()
    let userId: string | undefined = undefined
    userId = user.user?.id
    const userName = user.user?.fullName
    const files = useQuery(api.files.getFiles, userId ? { userId } : "skip");
    const [analysis, setAnalysis] = useState("");
    const formSchema = z.object({
        title: z.string().min(1).max(100),
        file: z.custom<FileList>((val) => val instanceof FileList, "Required").refine((files) => files.length > 0, "Required")
    });
    const formSchema2 = z.object({
        text: z.string().min(1).max(10000),
    });
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })
    const form2 = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: {
            text: "",
        },
    })
    const fileRef = form.register("file");
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user.user) return;
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": values.file[0]!.type },
            body: values.file[0],
        });
        const { storageId } = await result.json();

        const types = {
            "image/png": "png",
            'image/jpeg': "jpg",
            "application/pdf": "pdf",
            "text/plain": "txt",
            "text/csv": "csv",
        } as Record<string, Doc<"files">["type"]>

        await createFile({
            name: values.title,
            fileId: storageId,
            userId: userId!,
            userName: userName!,
            type: types[values.file[0].type]
        });
        form.reset();
    }

    async function onSubmit2(values: z.infer<typeof formSchema2>) {
        Analyse(values.text)
    }

    const client = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
    async function Analyse(analysisInput: string) {
        const response = await client.responses.create({
            model: "gpt-4.1",
            input: [
                { role: "user", content: "The text after the colon is pasted from a text file. Please summarize it in 3 sentences then tell me whether it is safe to store on the cloud. Text: " },
                { role: "user", content: analysisInput },
            ],
        });
        setAnalysis(response.output_text)
    }



    return (

        <main className="container mx-auto pt-12">
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl">Uploaded Files:</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={() => {

                        }}>Upload</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>File Upload:</DialogTitle>
                            <DialogDescription>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="py-3">Name File</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="file"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel className="py-3">Select File</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="file" {...fileRef} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-between items-center">
                                            <Button type="submit">Submit</Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button>Text Analysis</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>AI File Analysis:</DialogTitle>
                                                        <DialogDescription>
                                                            <Form {...form2}>
                                                                <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-8">
                                                                    <FormField
                                                                        control={form2.control}
                                                                        name="text"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="py-3">Input File Text (max 10000 characters)</FormLabel>
                                                                                <FormControl>
                                                                                    <Textarea {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    <div className="flex justify-between items-center py-5">
                                                                        <Button type="submit">Analyse</Button>
                                                                    </div>
                                                                </form>
                                                            </Form>

                                                            <div>
                                                                <Label>AI Analysis: </Label>
                                                                <Textarea readOnly value={analysis} />
                                                            </div>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>




            </div>

            {files?.map(file => {
                return <div key={file._id}>{file.name} ({file.type})</div>
            })}

        </main>
    );
}
