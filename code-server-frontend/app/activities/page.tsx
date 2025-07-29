"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import type { LogLevel } from "@/lib/types"

// Realistic code server logs
const activities = [
  {
    id: "1",
    codeServerId: "1",
    codeServerName: "Development Server",
    message: "[2024-01-20 10:30:15] HTTP server listening on http://0.0.0.0:8080",
    level: "INFO" as LogLevel,
    createdAt: new Date("2024-01-20T10:30:15"),
  },
  {
    id: "2",
    codeServerId: "1",
    codeServerName: "Development Server",
    message: "[2024-01-20 10:30:12] Using config file ~/.config/code-server/config.yaml",
    level: "INFO" as LogLevel,
    createdAt: new Date("2024-01-20T10:30:12"),
  },
  {
    id: "3",
    codeServerId: "2",
    codeServerName: "Testing Environment",
    message: "[2024-01-20 10:25:30] Error: listen EADDRINUSE: address already in use :::8081",
    level: "ERROR" as LogLevel,
    createdAt: new Date("2024-01-20T10:25:30"),
  },
  {
    id: "4",
    codeServerId: "1",
    codeServerName: "Development Server",
    message: "[2024-01-20 10:30:10] info  code-server 4.19.1 de41646fc402b968ca6d555fdf2da7de9554d28a",
    level: "INFO" as LogLevel,
    createdAt: new Date("2024-01-20T10:30:10"),
  },
  {
    id: "5",
    codeServerId: "3",
    codeServerName: "Production Mirror",
    message: "[2024-01-20 10:20:45] Received SIGTERM, shutting down gracefully",
    level: "WARNING" as LogLevel,
    createdAt: new Date("2024-01-20T10:20:45"),
  },
  {
    id: "6",
    codeServerId: "2",
    codeServerName: "Testing Environment",
    message: "[2024-01-20 10:25:25] Starting code-server with args: --bind-addr 0.0.0.0:8081 --auth password",
    level: "INFO" as LogLevel,
    createdAt: new Date("2024-01-20T10:25:25"),
  },
  {
    id: "7",
    codeServerId: "1",
    codeServerName: "Development Server",
    message: "[2024-01-20 10:28:33] WebSocket connection established from 192.168.1.100",
    level: "DEBUG" as LogLevel,
    createdAt: new Date("2024-01-20T10:28:33"),
  },
  {
    id: "8",
    codeServerId: "3",
    codeServerName: "Production Mirror",
    message: "[2024-01-20 10:20:40] Extension host terminated with code 0",
    level: "INFO" as LogLevel,
    createdAt: new Date("2024-01-20T10:20:40"),
  },
  {
    id: "9",
    codeServerId: "2",
    codeServerName: "Testing Environment",
    message: "[2024-01-20 10:24:15] Installing extension ms-python.python@2023.20.0",
    level: "INFO" as LogLevel,
    createdAt: new Date("2024-01-20T10:24:15"),
  },
  {
    id: "10",
    codeServerId: "1",
    codeServerName: "Development Server",
    message: "[2024-01-20 10:27:22] File watcher error: ENOSPC: System limit for number of file watchers reached",
    level: "WARNING" as LogLevel,
    createdAt: new Date("2024-01-20T10:27:22"),
  },
]

function getLevelBadge(level: LogLevel) {
  const variants: Record<LogLevel, "default" | "secondary" | "destructive" | "outline"> = {
    INFO: "default",
    WARNING: "secondary",
    ERROR: "destructive",
    DEBUG: "outline",
  }

  const colors: Record<LogLevel, string> = {
    INFO: "bg-blue-100 text-blue-800",
    WARNING: "bg-yellow-100 text-yellow-800",
    ERROR: "bg-red-100 text-red-800",
    DEBUG: "bg-gray-100 text-gray-800",
  }

  return (
    <Badge variant={variants[level]} className={colors[level]}>
      {level}
    </Badge>
  )
}

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.codeServerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || activity.level === levelFilter
    return matchesSearch && matchesLevel
  })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Activity Logs</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="DEBUG">Debug</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs ({filteredActivities.length})</CardTitle>
            <CardDescription>Real-time logs and events from your code server instances</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Instance</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-mono text-sm">{activity.createdAt.toLocaleString()}</TableCell>
                    <TableCell>{getLevelBadge(activity.level)}</TableCell>
                    <TableCell className="font-medium">{activity.codeServerName}</TableCell>
                    <TableCell className="max-w-md">
                      <span className="break-words">{activity.message}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
