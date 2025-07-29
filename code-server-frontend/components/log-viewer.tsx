"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download, Search, Filter, Play, Pause, RotateCcw } from "lucide-react"
import type { LogLevel } from "@/lib/types"

interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  source?: string
}

interface LogViewerProps {
  instanceId: string
  instanceName: string
}

// Mock real-time log data
const generateMockLogs = (): LogEntry[] => [
  {
    id: "1",
    timestamp: new Date(),
    level: "INFO",
    message: "HTTP server listening on http://0.0.0.0:8080",
    source: "server",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000),
    level: "INFO",
    message: "Using config file ~/.config/code-server/config.yaml",
    source: "config",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 2000),
    level: "DEBUG",
    message: "WebSocket connection established from 192.168.1.100",
    source: "websocket",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 3000),
    level: "WARNING",
    message: "File watcher error: ENOSPC: System limit for number of file watchers reached",
    source: "filesystem",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 4000),
    level: "INFO",
    message: "Extension host started with pid 12345",
    source: "extension",
  },
]

function getLevelColor(level: LogLevel): string {
  const colors: Record<LogLevel, string> = {
    DEBUG: "text-gray-600",
    INFO: "text-blue-600",
    WARNING: "text-yellow-600",
    ERROR: "text-red-600",
  }
  return colors[level]
}

function getLevelBadge(level: LogLevel) {
  const variants: Record<LogLevel, "default" | "secondary" | "destructive" | "outline"> = {
    INFO: "default",
    WARNING: "secondary",
    ERROR: "destructive",
    DEBUG: "outline",
  }
  return (
    <Badge variant={variants[level]} className="text-xs">
      {level}
    </Badge>
  )
}

export function LogViewer({ instanceId, instanceName }: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>(generateMockLogs())
  const [isStreaming, setIsStreaming] = useState(true)
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollAreaRef.current && isStreaming) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [logs, isStreaming])

  // Simulate real-time log streaming
  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: ["INFO", "DEBUG", "WARNING", "ERROR"][Math.floor(Math.random() * 4)] as LogLevel,
        message: [
          "Processing request from client",
          "File saved: /workspace/src/index.js",
          "Extension activated: ms-python.python",
          "Memory usage: 245MB",
          "WebSocket heartbeat received",
        ][Math.floor(Math.random() * 5)],
        source: ["server", "filesystem", "extension", "system", "websocket"][Math.floor(Math.random() * 5)],
      }

      setLogs((prev) => [...prev, newLog].slice(-100)) // Keep last 100 logs
    }, 2000)

    return () => clearInterval(interval)
  }, [isStreaming])

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesSearch =
      searchTerm === "" ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesLevel && matchesSearch
  })

  const handleDownloadLogs = () => {
    const logText = filteredLogs
      .map((log) => `[${log.timestamp.toISOString()}] ${log.level}: ${log.message}`)
      .join("\n")

    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${instanceName}-logs-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearLogs = () => {
    setLogs([])
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Live Logs</CardTitle>
            <CardDescription>{instanceName} - Real-time log stream</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isStreaming ? "default" : "outline"}
              size="sm"
              onClick={() => setIsStreaming(!isStreaming)}
            >
              {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isStreaming ? "Pause" : "Resume"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearLogs}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadLogs}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[120px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="DEBUG">Debug</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4" ref={scrollAreaRef}>
          <div className="space-y-1 pb-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 py-1 text-sm font-mono hover:bg-muted/50 px-2 rounded"
              >
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                {getLevelBadge(log.level)}
                {log.source && (
                  <Badge variant="outline" className="text-xs">
                    {log.source}
                  </Badge>
                )}
                <span className={`flex-1 ${getLevelColor(log.level)}`}>{log.message}</span>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No logs match your current filters</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
