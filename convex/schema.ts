import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Chat conversations with the McDonald's agent
  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Individual messages in a conversation
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  // User preferences for ordering
  userPreferences: defineTable({
    userId: v.id("users"),
    dietaryRestrictions: v.optional(v.array(v.string())),
    favoriteItems: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),

  // Cached menu data from FireCrawl
  menuCache: defineTable({
    menuData: v.string(),
    lastFetched: v.number(),
    source: v.string(),
  }),
});
