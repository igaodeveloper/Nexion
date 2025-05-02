import { TaskUpdate, User, Task } from "@shared/schema";

interface UpdateItemProps {
  update: TaskUpdate & { 
    user: User;
    task: Task;
  };
}

export function UpdateItem({ update }: UpdateItemProps) {
  return (
    <li className="p-4 hover:bg-gray-50">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
            <span className="font-semibold">
              {update.user.firstName.charAt(0)}{update.user.lastName.charAt(0)}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className="font-medium mr-2">{update.user.firstName} {update.user.lastName}</span>
            <span className="text-xs text-gray-500">{update.task.boardId} Quadro</span>
          </div>
          <p className="text-sm text-gray-700">
            Mudou o status de "{update.oldStatus}" para "{update.newStatus}" em "{update.task.title}"
          </p>
        </div>
      </div>
    </li>
  );
}
