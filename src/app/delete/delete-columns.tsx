"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc } from "../../../convex/_generated/dataModel";
import { DeleteFileButton } from "./delete-button";



export type Files = Doc<"files">

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
        id: "delete",
        header: "Delete",
        cell: ({ row }) => {
            const file = row.original;
            return (<DeleteFileButton file={file} />)

        }

    },

]
