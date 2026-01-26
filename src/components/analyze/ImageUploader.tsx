import { useCallback, useState } from "react";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export function ImageUploader({ onImageSelect, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }, [toast]);

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;
    
    const url = URL.createObjectURL(file);
    setPreview(url);
  }, [validateFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = useCallback(() => {
    if (!preview) return;
    
    // Get the file from the input
    const input = document.getElementById("file-input") as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [preview, onImageSelect]);

  const clearPreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    const input = document.getElementById("file-input") as HTMLInputElement;
    if (input) input.value = "";
  }, [preview]);

  return (
    <div className="space-y-6">
      <Card
        className={`relative border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5"
            : preview
            ? "border-primary/30 bg-card"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-8">
          {preview ? (
            <div className="relative w-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 z-10 h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={clearPreview}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="overflow-hidden rounded-xl">
                <img
                  src={preview}
                  alt="Food preview"
                  className="h-64 w-full object-contain sm:h-80"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Upload your food image
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Drag and drop an image here, or click to browse. Supports JPEG, PNG, and WebP.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => document.getElementById("file-input")?.click()}
          disabled={isLoading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            // Trigger camera on mobile
            const input = document.getElementById("file-input") as HTMLInputElement;
            if (input) {
              input.setAttribute("capture", "environment");
              input.click();
              input.removeAttribute("capture");
            }
          }}
          disabled={isLoading}
        >
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
      </div>

      {preview && (
        <Button
          className="w-full"
          size="lg"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>Analyze Food</>
          )}
        </Button>
      )}
    </div>
  );
}
