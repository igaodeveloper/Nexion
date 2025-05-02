import { Task, Project } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface TaskRowProps {
  task: Task;
  onStatusChange?: (taskId: number, newStatus: string) => void;
}

export function TaskRow({ task, onStatusChange }: TaskRowProps) {
  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${task.projectId}`],
    enabled: !!task.projectId,
  });

  // Toggle task completion
  const handleToggleCompletion = async () => {
    const newStatus = task.completed ? "pending" : "complete";
    await apiRequest("PATCH", `/api/tasks/${task.id}`, {
      completed: !task.completed,
      status: newStatus
    });
    
    queryClient.invalidateQueries({ queryKey: [`/api/tasks/${task.id}`] });
    queryClient.invalidateQueries({ queryKey: ["/api/tasks/assigned"] });
    queryClient.invalidateQueries({ queryKey: [`/api/boards/${task.boardId}/tasks`] });
    
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  // Generate priority class
  const getPriorityClass = () => {
    switch (task.priority.toLowerCase()) {
      case "alta":
        return "priority-high";
      case "media":
        return "priority-medium";
      case "baixa":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  // Generate status class
  const getStatusClass = () => {
    switch (task.status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "in_progress":
        return "status-in-progress";
      case "complete":
        return "status-complete";
      default:
        return "status-pending";
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggleCompletion}
            className="mr-2" 
          />
          <span className={cn(task.completed && "line-through")}>{task.title}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={cn("text-sm text-gray-900 max-w-xs truncate", task.completed && "line-through")}>
          {task.description}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getStatusClass())}>
          {task.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getPriorityClass())}>
          {task.priority}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center text-xs">
            J
          </div>
          <div className="ml-2">João</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary mr-2"></span>
          {project?.name || "Friday Flow"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {task.dueDate}
      </td>
    </tr>
  );
}
