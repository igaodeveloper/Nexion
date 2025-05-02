import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, Menu, Star, BriefcaseBusiness, Home, CheckSquare, 
  Settings, FileText, Plus, User, LogOut, 
  Calendar, Search, Clock, MessageCircle, Users, LayoutGrid,
  BarChart, HelpCircle, Bell
} from "lucide-react";
import { Board } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "./logo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  companyName: string;
  className?: string;
}

export function Sidebar({ companyName, className }: SidebarProps) {
  const [location] = useLocation();
  const [openSection, setOpenSection] = useState<string>("workspaces");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const toggleSection = (id: string) => {
    if (!collapsed) {
      setOpenSection(openSection === id ? "" : id);
    }
  };

  // Fetch favorite boards
  const { data: favoriteBoards } = useQuery<Board[]>({
    queryKey: ["/api/boards/favorites"],
  });

  // Fetch user info (mock for now)
  const user = {
    firstName: "John",
    lastName: "Doe",
    avatar: ""
  };

  const sidebarClass = cn(
    "h-screen fixed overflow-hidden z-10 transition-all duration-300 ease-in-out flex flex-col",
    collapsed ? "w-[70px]" : "w-[280px]",
    "bg-sidebar text-sidebar-foreground border-r border-sidebar-border/30",
    className
  );

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location === path || location.startsWith(`${path}/`);
  };

  const linkItemClass = (active: boolean) => cn(
    "flex items-center py-2.5 px-3 text-sm rounded-md cursor-pointer transition-all duration-200",
    collapsed ? "justify-center" : "",
    "hover:bg-white/10",
    active ? "bg-white/15 text-white font-medium" : "text-white/80"
  );

  const sectionClass = (active: boolean) => cn(
    "flex items-center justify-between py-2 px-3 my-1 text-sm font-medium rounded-md cursor-pointer transition-colors",
    "hover:bg-white/10",
    active ? "bg-white/15 text-white" : "text-white/80"
  );

  const iconClass = "h-5 w-5 transition-transform";
  
  return (
    <div className={sidebarClass}>
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!collapsed ? (
          <Logo size="md" variant="full" theme="dark" />
        ) : (
          <Logo size="sm" variant="icon" theme="dark" />
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/80"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center rounded-md text-sm text-white/70",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                "bg-white/10 hover:bg-white/15 transition-all cursor-pointer"
              )}>
                <Search className="h-4 w-4 min-w-4" />
                {!collapsed && <span className="ml-2.5">Pesquisar</span>}
              </div>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Pesquisar</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Navigation */}
      <nav className="mt-1 px-2 overflow-y-auto flex-1 pb-5">
        <div className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <div className={linkItemClass(isActive("/"))}>
                    <Home className={cn(iconClass, collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>Dashboard</span>}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/tasks">
                  <div className={linkItemClass(isActive("/tasks"))}>
                    <CheckSquare className={cn(iconClass, collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>Tarefas</span>}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Tarefas</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/documents">
                  <div className={linkItemClass(isActive("/documents"))}>
                    <FileText className={cn(iconClass, collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>Documentos</span>}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Documentos</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/calendar">
                  <div className={linkItemClass(isActive("/calendar"))}>
                    <Calendar className={cn(iconClass, collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>Calendário</span>}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Calendário</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/messages">
                  <div className={linkItemClass(isActive("/messages"))}>
                    <MessageCircle className={cn(iconClass, collapsed ? "" : "mr-3")} />
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span>Mensagens</span>
                        <Badge variant="outline" className="bg-white/20 text-white text-xs">3</Badge>
                      </div>
                    )}
                    {collapsed && (
                      <Badge variant="outline" className="absolute -top-1 -right-1 bg-white/20 text-white text-xs h-5 w-5 flex items-center justify-center">3</Badge>
                    )}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Mensagens (3)</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/team">
                  <div className={linkItemClass(isActive("/team"))}>
                    <Users className={cn(iconClass, collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>Equipe</span>}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Equipe</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/reports">
                  <div className={linkItemClass(isActive("/reports"))}>
                    <BarChart className={cn(iconClass, collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>Relatórios</span>}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Relatórios</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Workspaces Section */}
        {!collapsed && (
          <>
            <div className="mt-8 mb-2">
              <div 
                className={sectionClass(openSection === "workspaces")}
                onClick={() => toggleSection("workspaces")}
              >
                <div className="flex items-center">
                  <BriefcaseBusiness className="mr-3 h-4 w-4" />
                  <span>Workspaces</span>
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openSection === "workspaces" && "rotate-90"
                  )}
                />
              </div>
              
              {openSection === "workspaces" && (
                <div className="pl-9 mt-1 space-y-1">
                  <Link href="/workspace/marketing">
                    <div className={cn(
                      "py-1.5 px-3 text-sm rounded-md",
                      "text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
                      isActive("/workspace/marketing") && "bg-white/15 text-white"
                    )}>
                      Marketing
                    </div>
                  </Link>
                  <Link href="/workspace/design">
                    <div className={cn(
                      "py-1.5 px-3 text-sm rounded-md",
                      "text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
                      isActive("/workspace/design") && "bg-white/15 text-white"
                    )}>
                      Design
                    </div>
                  </Link>
                  <Link href="/workspace/development">
                    <div className={cn(
                      "py-1.5 px-3 text-sm rounded-md",
                      "text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
                      isActive("/workspace/development") && "bg-white/15 text-white"
                    )}>
                      Development
                    </div>
                  </Link>
                  <Link href="/create-workspace">
                    <div className="flex items-center py-1.5 px-3 text-sm rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      <span>Novo Workspace</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Favorites Section */}
            <div className="mb-2">
              <div 
                className={sectionClass(openSection === "favorites")}
                onClick={() => toggleSection("favorites")}
              >
                <div className="flex items-center">
                  <Star className="mr-3 h-4 w-4" />
                  <span>Favoritos</span>
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openSection === "favorites" && "rotate-90"
                  )}
                />
              </div>
              
              {openSection === "favorites" && (
                <div className="pl-9 mt-1 space-y-1">
                  {favoriteBoards && favoriteBoards.length > 0 ? (
                    favoriteBoards.map((board) => (
                      <Link href={`/boards/${board.id}`} key={board.id}>
                        <div className={cn(
                          "py-1.5 px-3 text-sm rounded-md",
                          "text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
                          isActive(`/boards/${board.id}`) && "bg-white/15 text-white"
                        )}>
                          {board.name}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-1.5 px-3 text-sm text-white/50 italic">
                      Nenhum favorito
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </nav>
      
      {/* User Profile & Settings */}
      <div className="mt-auto border-t border-white/10 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={cn(
              "flex items-center p-2 rounded-md cursor-pointer hover:bg-white/10",
              collapsed ? "justify-center" : "justify-between"
            )}>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 border border-white/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-white/10 text-white">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="ml-3">
                    <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-white/60">{companyName}</div>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronRight className="h-4 w-4 text-white/60" />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>Ajuda</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
