import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStats, useSystemHealth } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Utensils,
  TrendingUp,
  Activity,
  UserPlus,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data for charts - in production, this would come from the API
const weeklyData = [
  { day: 'Mon', users: 12, meals: 45 },
  { day: 'Tue', users: 15, meals: 52 },
  { day: 'Wed', users: 18, meals: 61 },
  { day: 'Thu', users: 14, meals: 48 },
  { day: 'Fri', users: 22, meals: 73 },
  { day: 'Sat', users: 28, meals: 89 },
  { day: 'Sun', users: 25, meals: 82 },
];

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: health } = useSystemHealth();

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      change: `+${stats?.newUsersToday || 0} today`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: Activity,
      change: 'Last 7 days',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Meals',
      value: stats?.totalMeals || 0,
      icon: Utensils,
      change: `+${stats?.mealsToday || 0} today`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Avg Calories/Meal',
      value: stats?.averageCalories || 0,
      icon: TrendingUp,
      change: 'All time',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <AdminLayout title="Dashboard" description="Overview of platform metrics and performance">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="New Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="meals"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorMeals)"
                    name="Meals Logged"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {health?.overall === 'healthy' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium">Overall Status</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  health?.overall === 'healthy' ? 'text-green-500' : 'text-yellow-500'
                }`}
              >
                {health?.overall || 'Checking...'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{health?.database.latency}ms</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      health?.database.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{health?.api.latency}ms</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      health?.api.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New Users Today</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.newUsersToday || 0} new registrations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Meals Logged Today</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.mealsToday || 0} meals tracked
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">User Engagement Rate</span>
                <span className="font-medium">
                  {stats && stats.totalUsers > 0
                    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg Meals per User</span>
                <span className="font-medium">
                  {stats && stats.activeUsers > 0
                    ? (stats.totalMeals / stats.activeUsers).toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Calories Tracked</span>
                <span className="font-medium">
                  {stats ? (stats.totalMeals * stats.averageCalories).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
