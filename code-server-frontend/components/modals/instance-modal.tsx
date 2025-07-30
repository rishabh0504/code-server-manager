"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import type { InstanceStatus } from "@/lib/types";
import { useFetch } from "@/hooks/use-fetch";
import { API_END_POINTS } from "@/common/constant";

type ImageTagType = {
  id: string;
  imageTag: string;
};
interface InstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  instance?: any;
}

export function InstanceModal({
  isOpen,
  onClose,
  instance,
}: InstanceModalProps) {
  const [images, setImages] = useState<ImageTagType[]>([]);

  const { get: fetchImages } = useFetch({
    url: `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.DOCKER_SCRIPTS.images}`,
  });

  const [formData, setFormData] = useState({
    name: "",
    port: "",
    url: "",
    status: "PENDING" as InstanceStatus,
    image: "codercom/code-server:latest",
  });

  const loadDockerImages = async () => {
    const response = await fetchImages();
    if (response.status === "success") {
      setImages(response.data);
    }
  };
  useEffect(() => {
    loadDockerImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && !formData.image) {
      setFormData((prev) => ({ ...prev, image: images[0].imageTag }));
    }
  }, [images]);
  useEffect(() => {
    if (instance) {
      setFormData({
        name: instance.name || "",
        port: instance.port?.toString() || "",
        url: instance.url || "",
        status: instance.status || "PENDING",
        image: instance.image || "codercom/code-server:latest",
      });
    } else {
      setFormData({
        name: "",
        port: "",
        url: "",
        status: "PENDING" as InstanceStatus,
        image: "codercom/code-server:latest",
      });
    }
  }, [instance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {instance ? "Edit Instance" : "Create New Instance"}
          </DialogTitle>
          <DialogDescription>
            {instance
              ? "Update the code server instance details."
              : "Create a new code server instance."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Development Server"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) =>
                  setFormData({ ...formData, port: e.target.value })
                }
                className="col-span-3"
                placeholder="8080"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="col-span-3"
                placeholder="https://dev.example.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: InstanceStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="RUNNING">Running</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="STOPPED">Stopped</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image">Image</Label>
              <Select
                value={formData.image}
                onValueChange={(value) =>
                  setFormData({ ...formData, image: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Docker image" />
                </SelectTrigger>
                <SelectContent>
                  {images.map((img) => (
                    <SelectItem key={img.id} value={img.imageTag}>
                      {img.imageTag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {instance ? "Update" : "Create"} Instance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
