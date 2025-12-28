import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2, MoreVertical } from 'lucide-react';

import type { Task } from '@/types';
import { useDeleteTaskMutation } from '@/features/tasks/tasksApi';
import { useAppSelector } from '@/app/hooks';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditTaskDialog } from './EditTaskDialog';

interface TaskCardProps {
  task: Task;
}

const statusStyles = {
  PENDING: 'bg-status-pending/20 text-status-pending-foreground border-status-pending/30',
  IN_PROGRESS: 'bg-status-progress/20 text-status-progress-foreground border-status-progress/30',
  COMPLETED: 'bg-status-completed/20 text-status-completed-foreground border-status-completed/30',
};

const statusLabels = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export function TaskCard({ task }: TaskCardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const isAdmin = user?.role === 'ADMIN';
  const isMyTask = user?.id === task.userId;

  const handleDelete = async () => {
    try {
      await deleteTask(task.id).unwrap();
      toast.success('Task deleted', {
        description: 'The task has been removed successfully.',
      });
      setIsDeleteOpen(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to delete task', {
        description: err.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1 flex-1 pr-4">
            <CardTitle className="text-lg font-semibold leading-tight">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`${statusStyles[task.status]} text-xs`}>
                {statusLabels[task.status]}
              </Badge>
              {isAdmin && (
                <Badge
                  variant={isMyTask ? 'default' : 'secondary'}
                  className={`text-xs ${
                    isMyTask
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isMyTask ? 'Mine' : `User: ${task.userId.slice(0, 8)}...`}
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {task.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
