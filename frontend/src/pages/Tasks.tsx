import { useState, useMemo } from 'react';
import { Filter, Loader2 } from 'lucide-react';

import type { TaskStatus } from '@/types';
import { useGetTasksQuery } from '@/features/tasks/tasksApi';
import { useAppSelector } from '@/app/hooks';

import { Header } from '@/components/layout/Header';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterStatus = TaskStatus | 'ALL';
type OwnerFilter = 'ALL' | 'MINE' | 'OTHERS';

export default function Tasks() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('ALL');

  // Build query filters
  const queryFilters = useMemo(() => {
    const filters: { status?: TaskStatus; userId?: string } = {};

    if (statusFilter !== 'ALL') {
      filters.status = statusFilter;
    }

    // For admin with owner filter
    if (isAdmin && ownerFilter !== 'ALL') {
      if (ownerFilter === 'MINE') {
        filters.userId = user?.id;
      }
      // For 'OTHERS', we'll filter client-side since API doesn't support "not userId"
    }

    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [statusFilter, ownerFilter, isAdmin, user?.id]);

  const { data, isLoading, isError, error } = useGetTasksQuery(queryFilters);

  let tasks = data?.data || [];

  // Client-side filtering for admin "Others" filter
  if (isAdmin && ownerFilter === 'OTHERS' && user?.id) {
    tasks = tasks.filter((task) => task.userId !== user.id);
  }

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
            <p className="text-muted-foreground mt-1">
              {isAdmin
                ? 'Manage and organize tasks (yours and others)'
                : 'Manage and organize your daily tasks'}
            </p>
          </div>
          <CreateTaskDialog />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="text-2xl font-bold">{taskCounts.all}</p>
          </div>
          <div className="bg-status-pending/20 border border-status-pending/30 rounded-lg p-4">
            <p className="text-status-pending-foreground text-sm">Pending</p>
            <p className="text-2xl font-bold text-status-pending-foreground">
              {taskCounts.pending}
            </p>
          </div>
          <div className="bg-status-progress/20 border border-status-progress/30 rounded-lg p-4">
            <p className="text-status-progress-foreground text-sm">In Progress</p>
            <p className="text-2xl font-bold text-status-progress-foreground">
              {taskCounts.inProgress}
            </p>
          </div>
          <div className="bg-status-completed/20 border border-status-completed/30 rounded-lg p-4">
            <p className="text-status-completed-foreground text-sm">Completed</p>
            <p className="text-2xl font-bold text-status-completed-foreground">
              {taskCounts.completed}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as FilterStatus)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Tasks</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Select
              value={ownerFilter}
              onValueChange={(value) => setOwnerFilter(value as OwnerFilter)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Owners</SelectItem>
                <SelectItem value="MINE">Mine</SelectItem>
                <SelectItem value="OTHERS">Others</SelectItem>
              </SelectContent>
            </Select>
          )}

          {(statusFilter !== 'ALL' || (isAdmin && ownerFilter !== 'ALL')) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('ALL');
                if (isAdmin) setOwnerFilter('ALL');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-destructive">
              {(error as { data?: { message?: string } })?.data?.message ||
                'Failed to load tasks'}
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'ALL' && (!isAdmin || ownerFilter === 'ALL')
                ? 'Create your first task to get started!'
                : 'No tasks match the selected filters.'}
            </p>
            {statusFilter === 'ALL' && (!isAdmin || ownerFilter === 'ALL') && (
              <CreateTaskDialog />
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
