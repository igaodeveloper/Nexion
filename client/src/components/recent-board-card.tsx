import { Board } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Layout, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface RecentBoardCardProps {
  board: Board;
}

export function RecentBoardCard({ board }: RecentBoardCardProps) {
  const toggleFavorite = async () => {
    await apiRequest("PATCH", `/api/boards/${board.id}`, {
      isFavorite: !board.isFavorite,
    });

    queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
    queryClient.invalidateQueries({ queryKey: ["/api/boards/favorites"] });
  };

  // Dados simulados para demonstração (você pode substituir com dados reais do seu board)
  const progressData = [
    { name: "Planejamento", progress: 70 },
    { name: "Desenvolvimento", progress: 45 },
    { name: "Revisão", progress: 90 },
  ];

  // Como não temos acesso direto à propriedade updatedAt, usamos a data atual
  const lastUpdated = format(new Date(), "dd/MM/yyyy");

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:ring-1 hover:ring-border/60 group bg-background border border-border/40">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-primary/5 p-1.5 rounded-md mr-2">
              <Layout className="h-4 w-4 text-primary" />
            </div>
            <Link href={`/boards/${board.id}`}>
              <a className="font-medium hover:text-primary transition-colors">
                {board.name}
              </a>
            </Link>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "hover:text-yellow-500 transition-all duration-200 p-1 rounded-full hover:bg-yellow-50",
                    board.isFavorite ? "text-yellow-500" : "text-gray-400",
                  )}
                  onClick={toggleFavorite}
                >
                  <Star
                    className="h-4 w-4"
                    fill={board.isFavorite ? "currentColor" : "none"}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {board.isFavorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-3 mb-3">
          {progressData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-1/3 text-xs text-muted-foreground">
                {item.name}
              </div>
              <div className="w-2/3 bg-accent rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-2 mt-2 border-t border-border/30 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Atualizado: {lastUpdated}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1 text-success" />
            <span>5 tarefas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
