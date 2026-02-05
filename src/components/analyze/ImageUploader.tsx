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
    <div className="space-y-8">
      {/* Drop Zone / Preview Area */}
      <Card
        className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
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
        <CardContent className="flex flex-col items-center justify-center p-6 sm:p-10">
          {preview ? (
            <div className="relative w-full">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 z-10 h-9 w-9 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:scale-110 transition-transform"
                onClick={clearPreview}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Image Preview */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={preview}
                  alt="Food preview"
                  className="h-64 w-full object-contain sm:h-80 transition-transform duration-300 hover:scale-105"
                />
                
                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-foreground animate-pulse">
                      Analyzing your food...
                    </p>
                  </div>
                )}
              </div>
              
              {/* Ready indicator */}
              {!isLoading && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Image ready for analysis
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner">
                  <ImagePlus className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground">
                Upload Your Meal
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
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

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
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
          className="group relative flex-1 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-6 py-4 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform group-hover:scale-110">
            <Camera className="h-5 w-5" />
          </div>
          <span className="text-lg">Take Photo</span>
        </button>
        
        {/* Choose File - Secondary */}
        <button
          onClick={() => document.getElementById("file-input")?.click()}
          disabled={isLoading}
          className="group relative flex-1 flex items-center justify-center gap-3 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 font-semibold text-primary shadow-md transition-all duration-300 hover:border-primary/50 hover:bg-primary/15 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 transition-transform group-hover:scale-110">
            <Upload className="h-5 w-5" />
          </div>
          <span className="text-lg">Choose File</span>
        </button>
      </div>

      {/* Analyze Button */}
      {preview && !isLoading && (
        <Button
          className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]"
          size="lg"
          onClick={handleAnalyze}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Analyze Food
        </Button>
      )}
    </div>
  );
}
