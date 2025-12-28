import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, RefreshCw, Search, Users, ListTodo } from 'lucide-react';

import { useAppSelector } from '@/app/hooks';
import { useGetAllTasksQuery, groupTasksByUser } from '@/features/admin/adminApi';

import { Header } from '@/components/layout/Header';
import { UserTasksSection } from '@/components/admin/UserTasksSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Admin() {
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetAllTasksQuery();

  const tasks = data?.data || [];
  const userGroups = useMemo(() => groupTasksByUser(tasks), [tasks]);

  // Filter groups by search query (userId)
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return userGroups;
    return userGroups.filter((group) =>
      group.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userGroups, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    return {
      totalUsers: userGroups.length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => t.status === 'PENDING').length,
      inProgressTasks: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      completedTasks: tasks.filter((t) => t.status === 'COMPLETED').length,
    };
  }, [tasks, userGroups]);

  // Redirect non-admin users
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Manage all users and their tasks
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Users</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Tasks</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.totalTasks}</p>
            </CardContent>
          </Card>
          <div className="bg-status-pending/20 border border-status-pending/30 rounded-lg p-4">
            <p className="text-status-pending-foreground text-sm">Pending</p>
            <p className="text-2xl font-bold text-status-pending-foreground">
              {stats.pendingTasks}
            </p>
          </div>
          <div className="bg-status-progress/20 border border-status-progress/30 rounded-lg p-4">
            <p className="text-status-progress-foreground text-sm">In Progress</p>
            <p className="text-2xl font-bold text-status-progress-foreground">
              {stats.inProgressTasks}
            </p>
          </div>
          <div className="bg-status-completed/20 border border-status-completed/30 rounded-lg p-4">
            <p className="text-status-completed-foreground text-sm">Completed</p>
            <p className="text-2xl font-bold text-status-completed-foreground">
              {stats.completedTasks}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tasks">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="tasks">All Tasks</TabsTrigger>
            <TabsTrigger value="users">By User</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>
                  Overview of all tasks in the system grouped by user
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    <p className="text-muted-foreground">No tasks in the system yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userGroups.map((group) => (
                      <UserTasksSection
                        key={group.userId}
                        userId={group.userId}
                        tasks={group.tasks}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Search and manage users by their ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? 'No users match your search.'
                        : 'No users with tasks yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGroups.map((group) => (
                      <UserTasksSection
                        key={group.userId}
                        userId={group.userId}
                        tasks={group.tasks}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
