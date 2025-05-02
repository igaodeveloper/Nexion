import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronUp, Star, Briefcase, Home, CheckSquare, Settings, FileText } from "lucide-react";
import { Board } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  companyName: string;
}

export function Sidebar({ companyName }: SidebarProps) {
  const [location] = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    favorites: true,
    workspaces: false,
  });

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fetch favorite boards
  const { data: favoriteBoards } = useQuery<Board[]>({
    queryKey: ["/api/boards/favorites"],
  });

  return (
    <div className="w-64 h-screen bg-white fixed border-r border-gray-200 overflow-y-auto z-10 transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-200">
        <div className="text-xl font-semibold text-primary">{companyName}</div>
      </div>

      <nav className="mt-4">
        <ul className="space-y-1">
          <li>
            <Link href="/">
              <a
                className={cn(
                  "flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md",
                  location === "/" && "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <Home className="mr-3 h-4 w-4" />
                <span>Página inicial</span>
              </a>
            </Link>
          </li>

          <li>
            <Link href="/tasks">
              <a
                className={cn(
                  "flex items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-md",
                  location === "/tasks" && "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <CheckSquare className="mr-3 h-4 w-4" />
                <span>Atribuídos a mim</span>
              </a>
            </Link>
          </li>

          <li>
            <div
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={() => toggleDropdown("favorites")}
            >
              <div className="flex items-center">
                <Star className="mr-3 h-4 w-4 text-gray-500" />
                <span>Favoritos</span>
              </div>
              {openDropdowns.favorites ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {openDropdowns.favorites && (
              <ul className="pl-10 mt-1 space-y-1">
                {favoriteBoards?.map((board) => (
                  <li key={board.id}>
                    <Link href={`/boards/${board.id}`}>
                      <a className={cn(
                        "block px-4 py-1.5 text-sm hover:bg-gray-100 rounded-md",
                        location === `/boards/${board.id}` && "bg-gray-200"
                      )}>
                        <div className="flex items-center">
                          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary mr-2"></span>
                          {board.name}
                        </div>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <div
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={() => toggleDropdown("workspaces")}
            >
              <div className="flex items-center">
                <Briefcase className="mr-3 h-4 w-4 text-gray-500" />
                <span>Áreas de trabalhos</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full mr-2">5</span>
                {openDropdowns.workspaces ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>

            {openDropdowns.workspaces && (
              <ul className="pl-10 mt-1 space-y-1">
                <li>
                  <Link href="/boards/1">
                    <a className={cn(
                      "block px-4 py-1.5 text-sm hover:bg-gray-100 rounded-md",
                      location === "/boards/1" && "bg-gray-200"
                    )}>
                      <div className="flex items-center">
                        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary mr-2"></span>
                        Quadro
                      </div>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/boards/2">
                    <a className={cn(
                      "block px-4 py-1.5 text-sm hover:bg-gray-100 rounded-md",
                      location === "/boards/2" && "bg-gray-200"
                    )}>
                      <div className="flex items-center">
                        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary mr-2"></span>
                        Quadro
                      </div>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/boards/3">
                    <a className={cn(
                      "block px-4 py-1.5 text-sm hover:bg-gray-100 rounded-md",
                      location === "/boards/3" && "bg-gray-200"
                    )}>
                      <div className="flex items-center">
                        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary mr-2"></span>
                        Quadro
                      </div>
                    </a>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <Link href="/profile">
          <a className="flex items-center text-sm text-gray-700 hover:text-primary">
            <Settings className="mr-3 h-4 w-4" />
            <span>Configurações</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
