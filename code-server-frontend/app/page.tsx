"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Server, Key, FileCode, Plus, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

// Mock data for dashboard
const dashboardStats = {
  totalInstances: 12,
  runningInstances: 8,
  pendingInstances: 2,
  errorInstances: 1,
  totalCredentials: 5,
  totalScripts: 15,
  recentActivities: 24,
}

const recentInstances = [
  { id: "1", name: "Development Server", status: "RUNNING", port: 8080 },
  { id: "2", name: "Testing Environment", status: "PENDING", port: 8081 },
  { id: "3", name: "Production Mirror", status: "STOPPED", port: 8082 },
]

const recentActivities = [
  {
    id: "1",
    message: "HTTP server listening on http://0.0.0.0:8080",
    level: "INFO",
    time: "2 minutes ago",
    instance: "Development Server",
  },
  {
    id: "2",
    message: "Error: listen EADDRINUSE: address already in use :::8081",
    level: "ERROR",
    time: "5 minutes ago",
    instance: "Testing Environment",
  },
  {
    id: "3",
    message: "WebSocket connection established from 192.168.1.100",
    level: "DEBUG",
    time: "8 minutes ago",
    instance: "Development Server",
  },
  {
    id: "4",
    message: "Extension host terminated with code 0",
    level: "INFO",
    time: "10 minutes ago",
    instance: "Production Mirror",
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "RUNNING":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "PENDING":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "ERROR":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

function getStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    RUNNING: "default",
    PENDING: "secondary",
    STOPPED: "outline",
    ERROR: "destructive",
  }
  return <Badge variant={variants[status] || "outline"}>{status}</Badge>
}

function getLevelBadge(level: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    INFO: "default",
    WARNING: "secondary",
    ERROR: "destructive",
    DEBUG: "outline",
  }
  return <Badge variant={variants[level] || "outline"}>{level}</Badge>
}

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild>
            <Link href="/instances">
              <Plus className="h-4 w-4 mr-2" />
              New Instance
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalInstances}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{dashboardStats.runningInstances} running</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Instances</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.runningInstances}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600">{dashboardStats.pendingInstances} pending</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credentials</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalCredentials}</div>
              <p className="text-xs text-muted-foreground">Configured credentials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Docker Scripts</CardTitle>
              <FileCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalScripts}</div>
              <p className="text-xs text-muted-foreground">Available scripts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Instances */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Instances</CardTitle>
              <CardDescription>Latest code server instances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInstances.map((instance) => (
                  <div key={instance.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(instance.status)}
                      <div>
                        <p className="font-medium">{instance.name}</p>
                        <p className="text-sm text-muted-foreground">Port: {instance.port}</p>
                      </div>
                    </div>
                    {getStatusBadge(instance.status)}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/instances">View All Instances</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getLevelBadge(activity.level)}
                        <span className="text-xs text-muted-foreground font-medium">{activity.instance}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded text-xs">{activity.message}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/activities">View All Activities</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
