import { 
  User, InsertUser, 
  Organization, InsertOrganization, 
  OrganizationMember, InsertOrganizationMember, 
  Board, InsertBoard, 
  Task, InsertTask, 
  Project, InsertProject, 
  Session, InsertSession,
  TaskUpdate, InsertTaskUpdate,
  Document, InsertDocument
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Organization operations
  getOrganization(id: number): Promise<Organization | undefined>;
  getOrganizationsByUser(userId: number): Promise<Organization[]>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  
  // Organization members
  getOrganizationMembers(orgId: number): Promise<(OrganizationMember & { user: User })[]>;
  addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember>;
  
  // Board operations
  getBoard(id: number): Promise<Board | undefined>;
  getBoardsByOrganization(orgId: number): Promise<Board[]>;
  getBoardsByUser(userId: number): Promise<Board[]>;
  getFavoriteBoards(userId: number): Promise<Board[]>;
  createBoard(board: InsertBoard): Promise<Board>;
  updateBoard(id: number, data: Partial<Board>): Promise<Board | undefined>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasksByBoard(boardId: number): Promise<Task[]>;
  getTasksByAssignee(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, data: Partial<Task>): Promise<Task | undefined>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByOrganization(orgId: number): Promise<Document[]>;
  getDocumentsByUser(userId: number): Promise<Document[]>;
  getFavoriteDocuments(userId: number): Promise<Document[]>;
  getStarredDocuments(userId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, data: Partial<Document>): Promise<Document | undefined>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByOrganization(orgId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getSessionsByUser(userId: number): Promise<Session[]>;
  
  // Task updates
  getTaskUpdates(limit: number): Promise<(TaskUpdate & { user: User, task: Task })[]>;
  createTaskUpdate(update: InsertTaskUpdate): Promise<TaskUpdate>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private organizations: Map<number, Organization>;
  private organizationMembers: Map<number, OrganizationMember>;
  private boards: Map<number, Board>;
  private tasks: Map<number, Task>;
  private projects: Map<number, Project>;
  private sessions: Map<number, Session>;
  private taskUpdates: Map<number, TaskUpdate>;
  private documents: Map<number, Document>;
  
  private userIdCounter: number;
  private orgIdCounter: number;
  private memberIdCounter: number;
  private boardIdCounter: number;
  private taskIdCounter: number;
  private projectIdCounter: number;
  private sessionIdCounter: number;
  private updateIdCounter: number;
  private documentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.organizations = new Map();
    this.organizationMembers = new Map();
    this.boards = new Map();
    this.tasks = new Map();
    this.projects = new Map();
    this.sessions = new Map();
    this.taskUpdates = new Map();
    this.documents = new Map();
    
    this.userIdCounter = 1;
    this.orgIdCounter = 1;
    this.memberIdCounter = 1;
    this.boardIdCounter = 1;
    this.taskIdCounter = 1;
    this.projectIdCounter = 1;
    this.sessionIdCounter = 1;
    this.updateIdCounter = 1;
    this.documentIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const user: User = {
      id: this.userIdCounter++,
      firstName: "Jean",
      lastName: "Jr.",
      username: "jeanjr",
      email: "jeanjr@email.com",
      password: "$2a$10$VGcg4aqT2qnpQK.C9rpFJeRbVQlwimLqaABx6XlMu6oqRAlXMPj0y", // "password123"
      phone: null
    };
    
    this.users.set(user.id, user);
    
    // Create organization
    const organization: Organization = {
      id: this.orgIdCounter++,
      name: "Company Name",
      description: "A collaborative workspace for our team",
      createdBy: user.id
    };
    
    this.organizations.set(organization.id, organization);
    
    // Add user as organization member
    const member: OrganizationMember = {
      id: this.memberIdCounter++,
      organizationId: organization.id,
      userId: user.id,
      role: "admin"
    };
    
    this.organizationMembers.set(member.id, member);
    
    // Create project
    const project: Project = {
      id: this.projectIdCounter++,
      name: "Friday Flow",
      organizationId: organization.id
    };
    
    this.projects.set(project.id, project);
    
    // Create boards
    const board1: Board = {
      id: this.boardIdCounter++,
      name: "Backend",
      organizationId: organization.id,
      createdBy: user.id,
      isFavorite: true
    };
    
    const board2: Board = {
      id: this.boardIdCounter++,
      name: "Frontend",
      organizationId: organization.id,
      createdBy: user.id,
      isFavorite: true
    };
    
    const board3: Board = {
      id: this.boardIdCounter++,
      name: "DevOps",
      organizationId: organization.id,
      createdBy: user.id,
      isFavorite: false
    };
    
    this.boards.set(board1.id, board1);
    this.boards.set(board2.id, board2);
    this.boards.set(board3.id, board3);
    
    // Create tasks
    const task1: Task = {
      id: this.taskIdCounter++,
      title: "Desenvolver notas de usuários",
      description: "Desenvolver notas de usuários. Lorem ipsum is simply dummy text of...",
      status: "pending",
      priority: "alta",
      assignedTo: user.id,
      boardId: board1.id,
      projectId: project.id,
      dueDate: "12/12/12",
      completed: false
    };
    
    const task2: Task = {
      id: this.taskIdCounter++,
      title: "Refatorar notas de autenticação",
      description: "Desenvolver notas de usuários. Lorem ipsum is simply dummy text of...",
      status: "complete",
      priority: "media",
      assignedTo: user.id,
      boardId: board1.id,
      projectId: project.id,
      dueDate: "12/12/12",
      completed: true
    };
    
    this.tasks.set(task1.id, task1);
    this.tasks.set(task2.id, task2);
    
    // Create task updates
    const update1: TaskUpdate = {
      id: this.updateIdCounter++,
      taskId: task2.id,
      userId: user.id,
      oldStatus: "in_progress",
      newStatus: "complete",
      timestamp: new Date()
    };
    
    const update2: TaskUpdate = {
      id: this.updateIdCounter++,
      taskId: task2.id,
      userId: user.id,
      oldStatus: "in_progress",
      newStatus: "complete",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    };
    
    const update3: TaskUpdate = {
      id: this.updateIdCounter++,
      taskId: task2.id,
      userId: user.id,
      oldStatus: "in_progress",
      newStatus: "complete",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
    };
    
    this.taskUpdates.set(update1.id, update1);
    this.taskUpdates.set(update2.id, update2);
    this.taskUpdates.set(update3.id, update3);
    
    // Create session
    const session: Session = {
      id: this.sessionIdCounter++,
      userId: user.id,
      device: "Windows Chrome",
      location: "Campina Grande",
      ipAddress: "224.54.96.47/5=416:88/41:...",
      timestamp: new Date()
    };
    
    this.sessions.set(session.id, session);
    
    // Create a sample document
    const document: Document = {
      id: this.documentIdCounter++,
      title: "Bem-vindo ao NotionFlow",
      emoji: "👋",
      coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      icon: null,
      blocks: JSON.stringify([
        {
          id: `block-${Date.now()}-1`,
          type: "heading-1",
          content: "Bem-vindo ao NotionFlow",
          children: []
        },
        {
          id: `block-${Date.now()}-2`,
          type: "paragraph",
          content: "Este é um exemplo de documento usando nosso editor de blocos. Você pode editar este documento clicando em qualquer parte do texto.",
          children: []
        },
        {
          id: `block-${Date.now()}-3`,
          type: "heading-2",
          content: "O que você pode fazer",
          children: []
        },
        {
          id: `block-${Date.now()}-4`,
          type: "bullet-list",
          content: "Criar listas como esta",
          children: []
        },
        {
          id: `block-${Date.now()}-5`,
          type: "bullet-list",
          content: "Adicionar vários tipos de blocos",
          children: []
        },
        {
          id: `block-${Date.now()}-6`,
          type: "bullet-list",
          content: "Organizar seu conteúdo",
          children: []
        },
        {
          id: `block-${Date.now()}-7`,
          type: "paragraph",
          content: "Para adicionar um novo bloco, pressione Enter ou clique no botão '+' que aparece quando você passa o mouse sobre o espaço entre os blocos.",
          children: []
        }
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      organizationId: organization.id,
      parentId: null,
      isStarred: true,
      isFavorite: true
    };
    
    this.documents.set(document.id, document);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Organization operations
  async getOrganization(id: number): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  async getOrganizationsByUser(userId: number): Promise<Organization[]> {
    const memberIds = Array.from(this.organizationMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.organizationId);
    
    return Array.from(this.organizations.values())
      .filter(org => memberIds.includes(org.id));
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const id = this.orgIdCounter++;
    const organization: Organization = { ...org, id };
    this.organizations.set(id, organization);
    return organization;
  }

  // Organization members
  async getOrganizationMembers(orgId: number): Promise<(OrganizationMember & { user: User })[]> {
    const members = Array.from(this.organizationMembers.values())
      .filter(member => member.organizationId === orgId);
    
    return members.map(member => {
      const user = this.users.get(member.userId)!;
      return { ...member, user };
    });
  }

  async addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember> {
    const id = this.memberIdCounter++;
    const newMember: OrganizationMember = { ...member, id };
    this.organizationMembers.set(id, newMember);
    return newMember;
  }

  // Board operations
  async getBoard(id: number): Promise<Board | undefined> {
    return this.boards.get(id);
  }

  async getBoardsByOrganization(orgId: number): Promise<Board[]> {
    return Array.from(this.boards.values())
      .filter(board => board.organizationId === orgId);
  }

  async getBoardsByUser(userId: number): Promise<Board[]> {
    // Get organizations the user is a member of
    const orgIds = Array.from(this.organizationMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.organizationId);
    
    // Get boards for those organizations
    return Array.from(this.boards.values())
      .filter(board => orgIds.includes(board.organizationId));
  }

  async getFavoriteBoards(userId: number): Promise<Board[]> {
    // Get all boards the user has access to
    const boards = await this.getBoardsByUser(userId);
    
    // Filter to only favorite boards
    return boards.filter(board => board.isFavorite);
  }

  async createBoard(board: InsertBoard): Promise<Board> {
    const id = this.boardIdCounter++;
    const newBoard: Board = { ...board, id };
    this.boards.set(id, newBoard);
    return newBoard;
  }

  async updateBoard(id: number, data: Partial<Board>): Promise<Board | undefined> {
    const board = this.boards.get(id);
    if (!board) return undefined;
    
    const updatedBoard = { ...board, ...data };
    this.boards.set(id, updatedBoard);
    return updatedBoard;
  }

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByBoard(boardId: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.boardId === boardId);
  }

  async getTasksByAssignee(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.assignedTo === userId);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const newTask: Task = { ...task, id };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    // If status is changing, create a task update record
    if (data.status && data.status !== task.status) {
      await this.createTaskUpdate({
        taskId: id,
        userId: 1, // In a real app, this would be the current user ID
        oldStatus: task.status,
        newStatus: data.status,
        timestamp: new Date()
      });
    }
    
    const updatedTask = { ...task, ...data };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByOrganization(orgId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.organizationId === orgId);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const newProject: Project = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  // Session operations
  async createSession(session: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const newSession: Session = { ...session, id };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async getSessionsByUser(userId: number): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId);
  }

  // Task updates
  async getTaskUpdates(limit: number): Promise<(TaskUpdate & { user: User, task: Task })[]> {
    return Array.from(this.taskUpdates.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
      .map(update => {
        const user = this.users.get(update.userId)!;
        const task = this.tasks.get(update.taskId)!;
        return { ...update, user, task };
      });
  }

  async createTaskUpdate(update: InsertTaskUpdate): Promise<TaskUpdate> {
    const id = this.updateIdCounter++;
    const newUpdate: TaskUpdate = { ...update, id };
    this.taskUpdates.set(id, newUpdate);
    return newUpdate;
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByOrganization(orgId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.organizationId === orgId);
  }

  async getDocumentsByUser(userId: number): Promise<Document[]> {
    // Get organizations the user is a member of
    const orgIds = Array.from(this.organizationMembers.values())
      .filter(member => member.userId === userId)
      .map(member => member.organizationId);
    
    // Get documents for those organizations
    return Array.from(this.documents.values())
      .filter(doc => orgIds.includes(doc.organizationId));
  }

  async getFavoriteDocuments(userId: number): Promise<Document[]> {
    // Get all documents the user has access to
    const documents = await this.getDocumentsByUser(userId);
    
    // Filter to only favorite documents
    return documents.filter(doc => doc.isFavorite);
  }

  async getStarredDocuments(userId: number): Promise<Document[]> {
    // Get all documents the user has access to
    const documents = await this.getDocumentsByUser(userId);
    
    // Filter to only starred documents
    return documents.filter(doc => doc.isStarred);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentIdCounter++;
    const newDocument: Document = { 
      ...document, 
      id,
      // Ensure dates are Date objects
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async updateDocument(id: number, data: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { 
      ...document, 
      ...data,
      // Always update the updatedAt field
      updatedAt: new Date()
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
}

export const storage = new MemStorage();
