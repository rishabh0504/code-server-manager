"use client";

import type React from "react";

import { API_END_POINTS } from "@/common/constant";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const [images, setImages] = useState<ImageTagType[]>([]);

  const {
    get: fetchImages,
    post: createCodeServer,
    error,
  } = useFetch({
    url: `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.DOCKER_SCRIPTS.images}`,
  });

  const [formData, setFormData] = useState({
    name: "",
    image: "",
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
        image: instance.image || "",
      });
    } else {
      setFormData({
        name: "",
        image: "",
      });
    }
  }, [instance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response: any = await createCodeServer(
        formData,
        `${process.env.NEXT_PUBLIC_BASE_API_POINT}${API_END_POINTS.CODE_SERVER.create}`
      );

      if (response && response?.status === "success") {
        toast({
          title: "Code server instance created ✅",
          description: `Code server instance "${formData.name}" was created successfully.`,
        });
        onClose();
      } else {
        // In case API responds but with error status
        console.log(response);
        toast({
          variant: "destructive",
          title: "Failed to create code server",
          description: response?.detail || "An unknown error occurred.",
        });
      }
    } catch (errorMessage: any) {
      // In case fetch or internal logic throws
      console.error("Error while creating code server:", errorMessage);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error,
      // });
    }
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
