import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  loginSchema,
  insertOrganizationSchema,
  inviteMemberSchema,
  insertBoardSchema,
  insertTaskSchema,
  Document,
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";

// Session type for TypeScript
declare module "express-session" {
  interface SessionData {
    userId: number;
    email: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      secret: process.env.SESSION_SECRET || "friday-flow-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // 24 hours
      }),
    }),
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: () => void) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      // Set session
      req.session.userId = user.id;
      req.session.email = user.email;

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);

      // Get user by email
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Check password
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Record session
      await storage.createSession({
        userId: user.id,
        device: req.headers["user-agent"] || "Unknown",
        location: "Unknown", // Would use geolocation in a real app
        ipAddress: req.ip || "Unknown",
        timestamp: new Date(),
      });

      // Set session
      req.session.userId = user.id;
      req.session.email = user.email;

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/user", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/organizations", requireAuth, async (req, res) => {
    try {
      const data = insertOrganizationSchema.parse(req.body);

      // Create organization
      const organization = await storage.createOrganization({
        ...data,
        createdBy: req.session.userId!,
      });

      // Add creator as member
      await storage.addOrganizationMember({
        organizationId: organization.id,
        userId: req.session.userId!,
        role: "admin",
      });

      res.status(201).json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/organizations/:id/invite", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const data = inviteMemberSchema.parse(req.body);

      // Check if organization exists
      const organization = await storage.getOrganization(parseInt(id));
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // In a real app, we would send an email invitation here

      // For now, just return success
      res.status(200).json({ message: "Invitation sent" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/organizations", requireAuth, async (req, res) => {
    try {
      const organizations = await storage.getOrganizationsByUser(
        req.session.userId!,
      );
      res.status(200).json(organizations);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/boards", requireAuth, async (req, res) => {
    try {
      const boards = await storage.getBoardsByUser(req.session.userId!);
      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/boards/favorites", requireAuth, async (req, res) => {
    try {
      const boards = await storage.getFavoriteBoards(req.session.userId!);
      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/boards", requireAuth, async (req, res) => {
    try {
      const data = insertBoardSchema.parse(req.body);

      // Create board
      const board = await storage.createBoard({
        ...data,
        createdBy: req.session.userId!,
      });

      res.status(201).json(board);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/boards/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // Update board
      const board = await storage.updateBoard(parseInt(id), req.body);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      res.status(200).json(board);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/boards/:id/tasks", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await storage.getTasksByBoard(parseInt(id));
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/tasks/assigned", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getTasksByAssignee(req.session.userId!);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);

      // Create task
      const task = await storage.createTask(data);

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // Update task
      const task = await storage.updateTask(parseInt(id), req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      // Get user's organizations
      const organizations = await storage.getOrganizationsByUser(
        req.session.userId!,
      );

      // Get projects for each organization
      let projects = [];
      for (const org of organizations) {
        const orgProjects = await storage.getProjectsByOrganization(org.id);
        projects = [...projects, ...orgProjects];
      }

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/updates", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const updates = await storage.getTaskUpdates(limit);
      res.status(200).json(updates);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/sessions", requireAuth, async (req, res) => {
    try {
      const sessions = await storage.getSessionsByUser(req.session.userId!);
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Document routes
  app.get("/api/documents", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const documents = await storage.getDocumentsByUser(userId);
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/documents/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const documents = await storage.getFavoriteDocuments(userId);
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/documents/starred", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const documents = await storage.getStarredDocuments(userId);
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const document = await storage.getDocument(id);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Parse the blocks from JSON string to object
      const documentWithParsedBlocks = {
        ...document,
        blocks: JSON.parse(document.blocks as unknown as string),
      };

      res.status(200).json(documentWithParsedBlocks);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/documents", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;

      // Convert blocks object to JSON string for storage
      const document = {
        ...req.body,
        createdBy: userId,
        blocks: JSON.stringify(req.body.blocks),
      };

      const newDocument = await storage.createDocument(document);

      // Return with parsed blocks
      const responseDocument = {
        ...newDocument,
        blocks: JSON.parse(newDocument.blocks as unknown as string),
      };

      res.status(201).json(responseDocument);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const document = await storage.getDocument(id);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // If blocks are being updated, convert to JSON string
      const updates: Partial<Document> = { ...req.body };
      if (updates.blocks) {
        updates.blocks = JSON.stringify(updates.blocks);
      }

      const updatedDocument = await storage.updateDocument(id, updates);

      // Return with parsed blocks
      const responseDocument = {
        ...updatedDocument,
        blocks: JSON.parse(updatedDocument!.blocks as unknown as string),
      };

      res.status(200).json(responseDocument);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
