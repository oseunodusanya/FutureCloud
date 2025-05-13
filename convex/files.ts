import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError("You are not currently logged in. Please log in first.");
    }
    return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
    args: {
        name: v.string(),
        userId: v.string(),
        fileId: v.id("_storage"),
        userName: v.string(),
        type: v.union(v.literal("png"), v.literal("jpg"), v.literal("pdf"), v.literal("txt"), v.literal("csv"))

    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Please log in to upload files")
        }
        await ctx.db.insert("files", {
            name: args.name,
            userId: args.userId,
            fileId: args.fileId,
            userName: args.userName,
            type: args.type,

        });
    },
});

export const getFiles = query({
    args: {
        userId: v.string()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            return [];
        }
        return ctx.db.query('files').withIndex("by_userId", q =>
            q.eq("userId", args.userId)
        ).collect();
    }
});

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Please log in to delete files")
        }
        await ctx.db.delete(args.fileId);
    }
})

export const downloadFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Please log in to download files");
        }

        const file = await ctx.db.get(args.fileId);

        if (!file) {
            throw new ConvexError("File not found");
        }

        const url = await ctx.storage.getUrl(file.fileId);

        return url;
    }
});
