"use client";


import { SignedOut, useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DataTable } from "../data-table";
import { columns } from "./view-columns";
import { Doc } from "../../../convex/_generated/dataModel";


export default function ViewPage() {
    const createFile = useMutation(api.files.createFile)
    const user = useUser()
    let userId: string | undefined = undefined
    userId = user.user?.id
    const userName = user.user?.fullName
    const files = useQuery(api.files.getFiles, userId ? { userId } : "skip");
    const formSchema = z.object({
        title: z.string().min(1).max(100),
        file: z.custom<FileList>((val) => val instanceof FileList, "Required").refine((files) => files.length > 0, 'Required')
    });
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        console.log(values.file)
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

    return (
        <main className="container mx-auto pt-12">
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
            <div className="flex justify-between items-center font-bold">
                <h1 className="text-3xl pb-5">Your Uploaded files:</h1>
                <p>Click the open file button if you wish to download a file</p>
            </div>
            {files ? (
                <DataTable columns={columns} data={files} />
            ) : (
                <></>
            )}


        </main>
    );
}
