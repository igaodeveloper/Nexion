import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/app-layout";
import { Task, Board } from "@shared/schema";
import { TaskRow } from "@/components/task-row";
import { Filter, ListOrdered, ChevronDown } from "lucide-react";
import { useParams } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function DetailedBoardPage() {
  const { id } = useParams();
  const boardId = parseInt(id);
  
  // Fetch board
  const { data: board, isLoading: loadingBoard } = useQuery<Board>({
    queryKey: [`/api/boards/${boardId}`],
  });
  
  // Fetch tasks
  const { data: tasks, isLoading: loadingTasks } = useQuery<Task[]>({
    queryKey: [`/api/boards/${boardId}/tasks`],
    enabled: !!boardId,
  });
  
  const handleStatusChange = (taskId: number, newStatus: string) => {
    queryClient.invalidateQueries({ queryKey: [`/api/boards/${boardId}/tasks`] });
    queryClient.invalidateQueries({ queryKey: ["/api/updates"] });
  };

  // Group tasks by status
  const groupTasksByStatus = (tasks: Task[] = []) => {
    const groups: Record<string, Task[]> = {
      "Backend": [],
      "Frontend": [],
      "Concluídos": []
    };
    
    tasks.forEach(task => {
      if (task.completed) {
        groups["Concluídos"].push(task);
      } else if (task.id % 2 === 0) {
        groups["Backend"].push(task);
      } else {
        groups["Frontend"].push(task);
      }
    });
    
    return groups;
  };

  const taskGroups = groupTasksByStatus(tasks);
  
  if (loadingBoard) {
    return (
      <AppLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{board?.name || "Board"}</h1>
          <div className="flex items-center space-x-3">
            <button className="text-gray-500 hover:text-primary" title="Filtrar">
              <Filter className="h-4 w-4" />
            </button>
            <button className="text-gray-500 hover:text-primary" title="Ordenar">
              <ListOrdered className="h-4 w-4" />
            </button>
            <button className="text-gray-500 hover:text-primary" title="Expandir">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {loadingTasks ? (
        <div className="space-y-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, j) => (
                    <div key={j} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(taskGroups).map(([groupName, groupTasks]) => (
            <div key={groupName}>
              <h2 className="text-xl font-semibold mb-4">{groupName}</h2>
              <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <span className="ml-2">Título</span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsável
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projeto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prazo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupTasks.map((task) => (
                      <TaskRow 
                        key={task.id} 
                        task={task} 
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
