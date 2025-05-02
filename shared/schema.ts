import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Organization model
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: integer("created_by").notNull(),
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
});
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

// Organization members
export const organizationMembers = pgTable("organization_members", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("member"),
});

export const insertOrganizationMemberSchema = createInsertSchema(
  organizationMembers,
).omit({ id: true });
export type InsertOrganizationMember = z.infer<
  typeof insertOrganizationMemberSchema
>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;

// Board model
export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: integer("organization_id").notNull(),
  createdBy: integer("created_by").notNull(),
  isFavorite: boolean("is_favorite").default(false),
});

export const insertBoardSchema = createInsertSchema(boards).omit({ id: true });
export type InsertBoard = z.infer<typeof insertBoardSchema>;
export type Board = typeof boards.$inferSelect;

// Task model
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: integer("assigned_to"),
  boardId: integer("board_id").notNull(),
  projectId: integer("project_id"),
  dueDate: text("due_date"),
  completed: boolean("completed").default(false),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Project model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: integer("organization_id").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Session history model
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  device: text("device").notNull(),
  location: text("location"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
});
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

// Task updates model
export const taskUpdates = pgTable("task_updates", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull(),
  userId: integer("user_id").notNull(),
  oldStatus: text("old_status"),
  newStatus: text("new_status"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTaskUpdateSchema = createInsertSchema(taskUpdates).omit({
  id: true,
});
export type InsertTaskUpdate = z.infer<typeof insertTaskUpdateSchema>;
export type TaskUpdate = typeof taskUpdates.$inferSelect;

// Login schema for validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;

// Invite member schema
export const inviteMemberSchema = z.object({
  email: z.string().email(),
});

export type InviteMemberData = z.infer<typeof inviteMemberSchema>;

// Block schema (for documents)
export const blockSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.enum([
      "paragraph",
      "heading-1",
      "heading-2",
      "heading-3",
      "bullet-list",
      "numbered-list",
      "to-do",
      "table",
      "image",
      "calendar",
      "file",
    ]),
    content: z.string(),
    completed: z.boolean().optional(),
    children: z.array(blockSchema).optional(),
  }),
);

export type Block = z.infer<typeof blockSchema>;

// Document model
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  emoji: text("emoji"),
  coverImage: text("cover_image"),
  icon: text("icon"),
  blocks: jsonb("blocks").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: integer("created_by").notNull(),
  organizationId: integer("organization_id").notNull(),
  parentId: integer("parent_id"),
  isStarred: boolean("is_starred").default(false),
  isFavorite: boolean("is_favorite").default(false),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
});
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Interface for document version history
export interface DocumentVersion {
  id: number;
  documentId: number;
  blocks: string; // Serialized blocks content
  title: string;
  emoji?: string | null;
  coverImage?: string | null;
  createdAt: Date;
  createdBy: number;
  thumbnail?: string | null; // URL to a thumbnail preview
  versionNumber: number;
}

// Interface for Document Comments
export interface Comment {
  id: number;
  documentId: number;
  text: string;
  createdAt: Date;
  createdBy: number;
  parentId?: number | null;
  resolved: boolean;
}

// Interface for Comment Reactions
export interface CommentReaction {
  id: number;
  commentId: number;
  userId: number;
  emoji: string;
  createdAt: Date;
}

// Interface for Custom Reaction Emojis
export interface CustomReaction {
  id: number;
  organizationId: number;
  emoji: string;
  name: string;
  createdBy: number;
  createdAt: Date;
}

// Interface for Resource Vault
export interface Resource {
  id: number;
  organizationId: number;
  createdBy: number;
  name: string;
  type: "image" | "pdf" | "audio" | "video" | "link" | "other";
  url: string;
  fileSize?: number;
  folderId?: number | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Resource Folders
export interface ResourceFolder {
  id: number;
  organizationId: number;
  createdBy: number;
  name: string;
  parentId?: number | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
