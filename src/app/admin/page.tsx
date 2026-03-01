
import { VaultNavbar } from '@/components/VaultNavbar';
import { AdminFeedbackList } from '@/components/AdminFeedbackList';
import { LayoutDashboard, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <VaultNavbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and analyze incoming user feedback.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-bold uppercase tracking-wider">
              Live Feed
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Messages', value: '1,284', icon: <MessageSquare className="h-4 w-4 text-primary" />, trend: '+12%' },
            { label: 'Anonymous', value: '76%', icon: <Users className="h-4 w-4 text-secondary" />, trend: '+5%' },
            { label: 'Avg. Response', value: '4.2h', icon: <TrendingUp className="h-4 w-4 text-primary" />, trend: '-18%' },
            { label: 'Uptime', value: '99.99%', icon: <LayoutDashboard className="h-4 w-4 text-secondary" />, trend: 'Stable' },
          ].map((stat, i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  <span className={stat.trend.startsWith('+') ? 'text-green-500' : stat.trend.startsWith('-') ? 'text-red-500' : ''}>
                    {stat.trend}
                  </span> from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Incoming Feedback</h2>
            <div className="h-1 flex-1 bg-border/50 rounded-full" />
          </div>
          <AdminFeedbackList />
        </div>
      </main>
    </div>
  );
}
