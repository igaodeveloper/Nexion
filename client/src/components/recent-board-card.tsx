import { Board } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface RecentBoardCardProps {
  board: Board;
}

export function RecentBoardCard({ board }: RecentBoardCardProps) {
  const toggleFavorite = async () => {
    await apiRequest("PATCH", `/api/boards/${board.id}`, {
      isFavorite: !board.isFavorite
    });
    
    queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
    queryClient.invalidateQueries({ queryKey: ["/api/boards/favorites"] });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <Layout className="h-4 w-4 text-primary mr-2" />
            <Link href={`/boards/${board.id}`}>
              <a className="font-medium hover:underline">{board.name}</a>
            </Link>
          </div>
          <button 
            className={cn(
              "hover:text-yellow-500", 
              board.isFavorite ? "text-yellow-500" : "text-gray-400"
            )}
            onClick={toggleFavorite}
          >
            <Star className="h-4 w-4" fill={board.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        
        <div className="space-y-2">
          {/* Progress bars representation */}
          <div className="flex items-center">
            <div className="w-1/3 text-xs text-gray-500">Task 1</div>
            <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3 text-xs text-gray-500">Task 2</div>
            <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3 text-xs text-gray-500">Task 3</div>
            <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
