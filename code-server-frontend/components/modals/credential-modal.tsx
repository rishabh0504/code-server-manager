"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CredentialType } from "@/lib/types";
import { useFetch } from "@/hooks/use-fetch";
import { API_END_POINTS } from "@/common/constant";

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  credential?: any;
}

export function CredentialModal({
  isOpen,
  onClose,
  credential,
}: CredentialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "GITHUB" as CredentialType,
    baseUrl: "",
    username: "",
    email: "",
    token: "",
  });

  const {
    data,
    loading,
    post: createCredential,
  } = useFetch({
    url: `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.CREDENTIALs.create}`,
  });

  useEffect(() => {
    if (credential) {
      setFormData({
        name: credential.name || "",
        type: credential.type || "GITHUB",
        baseUrl: credential.baseUrl || "",
        username: credential.username || "",
        email: credential.email || "",
        token: credential.value || "",
      });
    } else {
      setFormData({
        name: "",
        type: "GITHUB" as CredentialType,
        baseUrl: "https://github.com",
        username: "",
        email: "",
        token: "",
      });
    }
  }, [credential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createCredential(formData);
    if (response.status === "success") {
      console.log("Credential created:", formData);
      onClose();
    } else {
      console.error("Credential creation failed:", formData);
    }
  };

  const getDefaultBaseUrl = (type: CredentialType) => {
    const defaults: Record<CredentialType, string> = {
      GITHUB: "https://github.com",
      GITLAB: "https://gitlab.com",
      JIRA: "https://your-domain.atlassian.net",
      CONFLUENCES: "https://your-domain.atlassian.net/wiki",
      DOCKERHUB: "https://hub.docker.com",
      GITHUB_CONTAINER: "https://ghcr.io",
    };
    return defaults[type] || "";
  };

  const handleTypeChange = (type: CredentialType) => {
    setFormData({
      ...formData,
      type,
      baseUrl: getDefaultBaseUrl(type),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {credential ? "Edit Credential" : "Create New Credential"}
          </DialogTitle>
          <DialogDescription>
            {credential
              ? "Update the credential details for your integration."
              : "Provide details to securely store your service credential."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col p-0 m-0">
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="GitHub Personal Token"
                required
              />
            </div>

            {/* Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GITHUB">GitHub</SelectItem>
                  <SelectItem value="GITLAB">GitLab</SelectItem>
                  <SelectItem value="JIRA">Jira</SelectItem>
                  <SelectItem value="CONFLUENCES">Confluence</SelectItem>
                  <SelectItem value="DOCKERHUB">Docker Hub</SelectItem>
                  <SelectItem value="GITHUB_CONTAINER">
                    GitHub Container Registry
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Base URL */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={formData.baseUrl}
                onChange={(e) =>
                  setFormData({ ...formData, baseUrl: e.target.value })
                }
                className="col-span-3"
                placeholder="https://github.com"
                required
              />
            </div>

            {/* Username */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="col-span-3"
                placeholder="johndoe"
                required
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
                placeholder="johndoe@example.com"
                required
              />
            </div>

            {/* Secret Key / Token */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="value">Token / Secret</Label>
              <Textarea
                id="value"
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value })
                }
                className="col-span-3"
                placeholder="Paste your API token or secret key here"
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {credential ? "Update" : "Create"} Credential
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
