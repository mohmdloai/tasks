import { Navigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppSelector } from '@/app/hooks';
import { useGetTasksByUserQuery } from '@/features/admin/adminApi';

import { Header } from '@/components/layout/Header';
import { AdminTaskCard } from '@/components/admin/AdminTaskCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, error } = useGetTasksByUserQuery(
    userId || '',
    { skip: !userId }
  );

  // Redirect non-admin users
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/tasks" replace />;
  }

  if (!userId) {
    return <Navigate to="/admin" replace />;
  }

  const tasks = data?.data || [];

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      toast.success('User ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy user ID');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            User Details
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground font-mono text-sm">
              {userId}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-3 w-3" />
                  Copy ID
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <div className="bg-status-pending/20 border border-status-pending/30 rounded-lg p-4">
            <p className="text-status-pending-foreground text-sm">Pending</p>
            <p className="text-2xl font-bold text-status-pending-foreground">
              {stats.pending}
            </p>
          </div>
          <div className="bg-status-progress/20 border border-status-progress/30 rounded-lg p-4">
            <p className="text-status-progress-foreground text-sm">In Progress</p>
            <p className="text-2xl font-bold text-status-progress-foreground">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-status-completed/20 border border-status-completed/30 rounded-lg p-4">
            <p className="text-status-completed-foreground text-sm">Completed</p>
            <p className="text-2xl font-bold text-status-completed-foreground">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              All tasks assigned to this user
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
                <p className="text-muted-foreground">
                  This user has no tasks yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <AdminTaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
