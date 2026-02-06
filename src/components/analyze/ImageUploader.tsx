import { useCallback, useState } from "react";
import { Camera, Upload, X, Sparkles, ImagePlus } from "lucide-react";
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
    <div className="space-y-5">
      {/* Drop Zone / Preview Area */}
      <Card
        className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : preview
            ? "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-5 sm:p-8">
          {preview ? (
            <div className="relative w-full">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-1 -top-1 z-10 h-7 w-7 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:scale-110 transition-transform"
                onClick={clearPreview}
                disabled={isLoading}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              
              {/* Image Preview */}
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={preview}
                  alt="Food preview"
                  className="h-48 w-full object-contain sm:h-60 transition-transform duration-300"
                />
                
                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <p className="text-xs font-medium text-foreground animate-pulse">
                      Analyzing your food...
                    </p>
                  </div>
                )}
              </div>
              
              {/* Ready indicator */}
              {!isLoading && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Image ready for analysis
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-center">
              {/* Icon Container */}
              <div className="relative mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner">
                  <ImagePlus className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <Sparkles className="h-3 w-3" />
                </div>
              </div>
              
              <h3 className="text-base font-bold text-foreground">
                Upload Your Meal
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                Drag and drop your food photo here, or use the buttons below
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Supports JPEG, PNG, and WebP • Max 10MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Action Buttons - hidden when preview is shown */}
      {!preview && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Take Photo - Primary */}
          <button
            onClick={() => {
              const input = document.getElementById("file-input") as HTMLInputElement;
              if (input) {
                input.setAttribute("capture", "environment");
                input.click();
                input.removeAttribute("capture");
              }
            }}
            disabled={isLoading}
            className="group relative flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-5 py-3 text-primary-foreground font-medium shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform group-hover:scale-110">
              <Camera className="h-4 w-4" />
            </div>
            <span className="text-sm">Take Photo</span>
          </button>
          
          {/* Choose File - Secondary */}
          <button
            onClick={() => document.getElementById("file-input")?.click()}
            disabled={isLoading}
            className="group relative flex-1 flex items-center justify-center gap-2.5 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-3 font-medium text-primary shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/15 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 transition-transform group-hover:scale-110">
              <Upload className="h-4 w-4" />
            </div>
            <span className="text-sm">Choose File</span>
          </button>
        </div>
      )}

      {/* Analyze Button - shown when preview exists */}
      {preview && !isLoading && (
        <Button
          className="w-full h-11 text-sm font-semibold rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99]"
          size="default"
          onClick={handleAnalyze}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze Food
        </Button>
      )}
    </div>
  );
}
