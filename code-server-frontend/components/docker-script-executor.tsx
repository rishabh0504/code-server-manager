"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Play, Square, Download, RotateCcw, CheckCircle, XCircle, Clock, Activity } from "lucide-react"
import type { BuildStatus } from "@/lib/types"

interface ExecutionLog {
  id: string
  timestamp: Date
  step: string
  message: string
  type: "info" | "success" | "error" | "warning"
}

interface DockerScriptExecutorProps {
  scriptId: string
  scriptName: string
  onStatusChange?: (status: BuildStatus) => void
  autoStart?: boolean
}

const mockExecutionSteps = [
  { step: "1/12", message: "FROM node:18-alpine", type: "info" as const },
  { step: "1/12", message: "18-alpine: Pulling from library/node", type: "info" as const },
  { step: "1/12", message: "Digest: sha256:7e4b2c8c9a1b...", type: "info" as const },
  { step: "1/12", message: "Status: Downloaded newer image for node:18-alpine", type: "success" as const },
  { step: "2/12", message: "WORKDIR /app", type: "info" as const },
  { step: "3/12", message: "RUN apk add --no-cache git curl", type: "info" as const },
  {
    step: "3/12",
    message: "fetch https://dl-cdn.alpinelinux.org/alpine/v3.18/main/x86_64/APKINDEX.tar.gz",
    type: "info" as const,
  },
  { step: "3/12", message: "(1/7) Installing ca-certificates (20230506-r0)", type: "info" as const },
  { step: "3/12", message: "(2/7) Installing git (2.40.1-r0)", type: "info" as const },
  { step: "3/12", message: "(3/7) Installing curl (8.1.2-r0)", type: "info" as const },
  { step: "3/12", message: "OK: 15 MiB in 22 packages", type: "success" as const },
  { step: "4/12", message: "COPY package*.json ./", type: "info" as const },
  { step: "5/12", message: "RUN npm install", type: "info" as const },
  {
    step: "5/12",
    message: "npm WARN deprecated inflight@1.0.6: This module is not supported",
    type: "warning" as const,
  },
  {
    step: "5/12",
    message: "added 1156 packages from 1204 contributors and audited 1157 packages in 23.456s",
    type: "success" as const,
  },
  { step: "6/12", message: "COPY . .", type: "info" as const },
  { step: "7/12", message: "RUN addgroup -g 1001 -S nodejs", type: "info" as const },
  { step: "8/12", message: "RUN adduser -S nextjs -u 1001", type: "info" as const },
  { step: "9/12", message: "RUN chown -R nextjs:nodejs /app", type: "info" as const },
  { step: "10/12", message: "USER nextjs", type: "info" as const },
  { step: "11/12", message: "EXPOSE 3000", type: "info" as const },
  { step: "12/12", message: 'CMD ["npm", "start"]', type: "info" as const },
  { step: "FINAL", message: "Successfully built 9e8f7a6b5c4d", type: "success" as const },
  { step: "FINAL", message: "Successfully tagged johndoe/node-dev:latest", type: "success" as const },
]

export function DockerScriptExecutor({
  scriptId,
  scriptName,
  onStatusChange,
  autoStart = false,
}: DockerScriptExecutorProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("DRAFT")
  const [progress, setProgress] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [executionLogs])

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && buildStatus === "DRAFT") {
      handleStartExecution()
    }
  }, [autoStart, buildStatus])

  // Simulate build execution
  useEffect(() => {
    if (!isExecuting) return

    let stepIndex = 0

    const executeStep = () => {
      if (stepIndex >= mockExecutionSteps.length) {
        // Build completed successfully
        setBuildStatus("SUCCESS")
        setIsExecuting(false)
        setProgress(100)
        onStatusChange?.("SUCCESS")

        const completionLog: ExecutionLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          step: "COMPLETE",
          message: "✅ Docker image built and pushed successfully! Image is ready for deployment.",
          type: "success",
        }
        setExecutionLogs((prev) => [...prev, completionLog])
        return
      }

      const step = mockExecutionSteps[stepIndex]
      const newLog: ExecutionLog = {
        id: `${Date.now()}-${stepIndex}`,
        timestamp: new Date(),
        step: step.step,
        message: step.message,
        type: step.type,
      }

      setExecutionLogs((prev) => [...prev, newLog])
      setCurrentStep(Math.floor(((stepIndex + 1) / mockExecutionSteps.length) * 12))
      setProgress(((stepIndex + 1) / mockExecutionSteps.length) * 100)

      stepIndex++

      // Continue to next step with realistic timing
      setTimeout(executeStep, Math.random() * 1500 + 500)
    }

    executeStep()
  }, [isExecuting, onStatusChange])

  const handleStartExecution = () => {
    setIsExecuting(true)
    setBuildStatus("BUILDING")
    setExecutionLogs([])
    setCurrentStep(0)
    setProgress(0)
    onStatusChange?.("BUILDING")

    // Add initial log
    const startLog: ExecutionLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      step: "INIT",
      message: `🚀 Starting Docker build for ${scriptName}...`,
      type: "info",
    }
    setExecutionLogs([startLog])
  }

  const handleStopExecution = () => {
    setIsExecuting(false)
    setBuildStatus("FAILED")
    onStatusChange?.("FAILED")

    const stopLog: ExecutionLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      step: "STOP",
      message: "❌ Build execution stopped by user",
      type: "error",
    }
    setExecutionLogs((prev) => [...prev, stopLog])
  }

  const handleClearLogs = () => {
    setExecutionLogs([])
    setCurrentStep(0)
    setProgress(0)
    setBuildStatus("DRAFT")
    onStatusChange?.("DRAFT")
  }

  const handleDownloadLogs = () => {
    const logText = executionLogs
      .map((log) => `[${log.timestamp.toISOString()}] ${log.step}: ${log.message}`)
      .join("\n")

    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${scriptName}-build-logs-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = () => {
    switch (buildStatus) {
      case "BUILDING":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogIcon = (type: ExecutionLog["type"]) => {
    switch (type) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "warning":
        return "⚠️"
      default:
        return "ℹ️"
    }
  }

  const getLogColor = (type: ExecutionLog["type"]) => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">Build Execution</CardTitle>
              <CardDescription>Real-time Docker build logs for {scriptName}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isExecuting ? (
              <Button onClick={handleStartExecution} disabled={buildStatus === "BUILDING"}>
                <Play className="h-4 w-4 mr-2" />
                Run Build
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleStopExecution}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleClearLogs} disabled={isExecuting}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadLogs} disabled={executionLogs.length === 0}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {(isExecuting || buildStatus === "SUCCESS") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Build Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant={
              buildStatus === "SUCCESS"
                ? "default"
                : buildStatus === "BUILDING"
                  ? "secondary"
                  : buildStatus === "FAILED"
                    ? "destructive"
                    : "outline"
            }
          >
            {buildStatus}
          </Badge>
          {buildStatus === "BUILDING" && <span className="text-sm text-muted-foreground">Step {currentStep}/12</span>}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4" ref={scrollAreaRef}>
          <div className="space-y-1 py-4">
            {executionLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Click "Run Build" to start the Docker build process</p>
                <p className="text-sm">Real-time logs will appear here during execution</p>
              </div>
            ) : (
              executionLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-1 text-sm font-mono hover:bg-muted/50 px-2 rounded"
                >
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <Badge variant="outline" className="text-xs font-mono min-w-[60px] justify-center">
                    {log.step}
                  </Badge>
                  <span className="text-xs">{getLogIcon(log.type)}</span>
                  <span className={`flex-1 ${getLogColor(log.type)} break-all`}>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
