import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	files: defineTable({ name: v.string(), userId: v.string(), fileId: v.id("_storage"), userName: v.string(), type: v.union(v.literal("png"), v.literal("jpg"), v.literal("pdf"), v.literal("txt"), v.literal("csv")) }).index(
		"by_userId", ["userId"]
	),
});