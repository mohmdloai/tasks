import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, MoreVertical } from 'lucide-react';

import type { Task } from '@/types';
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/features/tasks/tasksApi';

import { Card, CardContent } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminTaskCardProps {
  task: Task;
}

export function AdminTaskCard({ task }: AdminTaskCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

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

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask({
        id: task.id,
        data: { status: newStatus as Task['status'] },
      }).unwrap();
      toast.success('Status updated');
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error('Failed to update status', {
        description: err.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <>
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{task.title}</p>
              {task.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsDeleteOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

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
