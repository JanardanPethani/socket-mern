import { useAuthStore } from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  MessageSquare,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.username || "User"}!
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your account activity and status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>Create Post</Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Friends"
          value="2,345"
          description="+180 from last month"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Messages"
          value="1,876"
          description="+43% from last month"
          trend="up"
          icon={MessageSquare}
        />
        <StatsCard
          title="Profile Views"
          value="45.2K"
          description="+12% from last month"
          trend="up"
          icon={Activity}
        />
        <StatsCard
          title="Content Engagement"
          value="82%"
          description="+8% from last month"
          trend="up"
          icon={BarChart3}
        />
      </div>

      {/* Recent activity section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your activity over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
              <p className="text-muted-foreground">
                Activity chart will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>You have 3 unread messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-lg border p-3"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Friend {i}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      Hey there! Just checking in to see how you're doing...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              View all messages
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Content engagement section */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your Content</CardTitle>
            <CardDescription>Recent posts and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Post Title {i}</p>
                    <p className="text-sm text-muted-foreground">
                      Posted on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {120 * i}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {24 * i}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View all posts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
}

function StatsCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {trend === "up" && (
            <ArrowUpRight className="h-3 w-3 text-green-500" />
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
