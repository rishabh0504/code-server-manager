"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Server } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Server className="h-10 w-10 text-slate-600" />
          </div>
          <CardTitle className="text-4xl font-bold text-slate-900">404</CardTitle>
          <CardDescription className="text-lg text-slate-600">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-500">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={() => window.history.back()}>
              <span className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </span>
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-slate-400">Code Server Manager • Professional Instance Management</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
