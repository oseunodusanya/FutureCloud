"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type Files = {
    userId: string
    userName: string
    name: string
    fileId: Id<"_storage">
    type: string
    _id: Id<"files">
}



export const columns: ColumnDef<Files>[] = [
    {
        accessorKey: "userName",
        header: "Username",
    },
    {
        accessorKey: "name",
        header: "File name",
    },
    {
        accessorKey: "type",
        header: "File Type",
    },
    {
        accessorKey: "download",
        header: "Open / Download file",
        cell: ({ row }) => {
            const file = row.original;
            const downloadFileMutation = useMutation(api.files.downloadFile);

            return (
                <Button onClick={async () => {
                    try {
                        const url = await downloadFileMutation({ fileId: file._id });
                        if (url) {
                            window.open(url, "_blank");
                        }
                    } catch (error) {
                        console.error("Download failed:", error);
                    }
                }}>Open File</Button>
            )
        }

    },

]
