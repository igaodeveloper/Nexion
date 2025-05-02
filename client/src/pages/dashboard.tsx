import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/app-layout";
import { Board, TaskUpdate, User, Task } from "@shared/schema";
import { RecentBoardCard } from "@/components/recent-board-card";
import { UpdateItem } from "@/components/update-item";

export default function DashboardPage() {
  // Fetch boards
  const { data: boards, isLoading: loadingBoards } = useQuery<Board[]>({
    queryKey: ["/api/boards"],
  });

  // Fetch recent updates
  const { data: updates, isLoading: loadingUpdates } = useQuery<(TaskUpdate & { user: User, task: Task })[]>({
    queryKey: ["/api/updates", { limit: 10 }],
  });

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-6">Quadros recentes</h1>
      
      {loadingBoards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {boards?.map((board) => (
            <RecentBoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Últimas atualizações</h2>
      
      {loadingUpdates ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <ul className="divide-y divide-gray-200">
            {Array(3).fill(0).map((_, i) => (
              <li key={i} className="p-4 animate-pulse">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  </div>
                  <div className="w-full">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-3" />
                    <div className="h-3 bg-gray-300 rounded w-3/4" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <ul className="divide-y divide-gray-200">
            {updates?.map((update) => (
              <UpdateItem key={update.id} update={update} />
            ))}
          </ul>
        </div>
      )}
    </AppLayout>
  );
}
