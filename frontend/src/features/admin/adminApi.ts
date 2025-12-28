import { apiSlice } from '@/features/api/apiSlice';
import type { ApiResponse, Task } from '@/types';

// Extended task type with user info for admin view
export interface TaskWithUser extends Task {
  userEmail?: string;
}

// Group tasks by user
export interface UserTaskGroup {
  userId: string;
  tasks: Task[];
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks (admin only - returns all users' tasks)
    getAllTasks: builder.query<ApiResponse<Task[]>, void>({
      query: () => '/tasks',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Task', id: 'ADMIN_LIST' }],
    }),

    // Get tasks for a specific user (admin only)
    getTasksByUser: builder.query<ApiResponse<Task[]>, string>({
      query: (userId) => `/tasks?userId=${userId}`,
      providesTags: (result, _error, userId) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: `USER_${userId}` },
            ]
          : [{ type: 'Task', id: `USER_${userId}` }],
    }),
  }),
});

export const { useGetAllTasksQuery, useGetTasksByUserQuery } = adminApi;

// Helper to group tasks by user
export function groupTasksByUser(tasks: Task[]): UserTaskGroup[] {
  const grouped = tasks.reduce(
    (acc, task) => {
      if (!acc[task.userId]) {
        acc[task.userId] = [];
      }
      acc[task.userId].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  return Object.entries(grouped).map(([userId, tasks]) => ({
    userId,
    tasks,
  }));
}
