import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/app-layout";
import { Task } from "@shared/schema";
import { TaskRow } from "@/components/task-row";
import { Filter, ListOrdered, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";

export default function BoardPage() {
  const [view, setView] = useState("table");

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks/assigned"],
  });

  // Handle status change
  const handleStatusChange = (taskId: number, newStatus: string) => {
    queryClient.invalidateQueries({ queryKey: ["/api/tasks/assigned"] });
    queryClient.invalidateQueries({ queryKey: ["/api/updates"] });
  };

  // Function to group tasks by date
  const groupTasksByDate = (tasks: Task[]) => {
    const groups: Record<string, Task[]> = {
      Hoje: [],
      Amanhã: [],
      "Esta semana": [],
      "Mais tarde": [],
    };

    if (!tasks) return groups;

    // In a real app, this would use proper date comparison logic
    tasks.forEach((task) => {
      if (task.completed) return;

      // For demo purposes, assign tasks to groups
      if (task.id % 3 === 0) {
        groups["Hoje"].push(task);
      } else if (task.id % 3 === 1) {
        groups["Amanhã"].push(task);
      } else {
        groups["Esta semana"].push(task);
      }
    });

    return groups;
  };

  const taskGroups = groupTasksByDate(tasks || []);

  return (
    <AppLayout>
      <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Hoje</h1>
          <div className="flex items-center space-x-3">
            <button
              className="text-gray-500 hover:text-primary"
              title="Filtrar"
            >
              <Filter className="h-4 w-4" />
            </button>
            <button
              className="text-gray-500 hover:text-primary"
              title="Ordenar"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <Select defaultValue="table" onValueChange={setView}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Visualizar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Tabela</SelectItem>
                <SelectItem value="kanban">Kanban</SelectItem>
              </SelectContent>
            </Select>
            <button
              className="p-1.5 bg-primary text-white rounded-full"
              title="Adicionar tarefa"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
          </div>
        </div>
      ) : (
        <>
          {Object.entries(taskGroups).map(
            ([groupName, groupTasks]) =>
              groupTasks.length > 0 && (
                <div key={groupName} className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">{groupName}</h2>
                  <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            <div className="flex items-center">
                              <span className="ml-2">Título</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Descrição
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Prioridade
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Responsável
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Projeto
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
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
              ),
          )}
        </>
      )}
    </AppLayout>
  );
}
