import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ImageUploader } from "@/components/analyze/ImageUploader";
import { LoadingState } from "@/components/analyze/LoadingState";
import { NutritionResults } from "@/components/analyze/NutritionResults";
import { ErrorState } from "@/components/analyze/ErrorState";
import { useFoodAnalysis } from "@/hooks/useFoodAnalysis";

export default function AnalyzePage() {
  const { status, data, error, imageUrl, analyzeImage, reset } = useFoodAnalysis();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-1 py-6 lg:py-8">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="mb-6 text-center animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Analyze Your Food
              </h1>
              <p className="mt-2 text-muted-foreground text-sm max-w-lg mx-auto">
                Upload or capture a photo of your meal to get instant nutritional insights
              </p>
            </div>

            {status === "idle" && (
              <div className="animate-scale-in">
                <ImageUploader
                  onImageSelect={analyzeImage}
                  isLoading={false}
                />
              </div>
            )}

            {status === "uploading" && (
              <ImageUploader
                onImageSelect={analyzeImage}
                isLoading={true}
              />
            )}

            {status === "analyzing" && (
              <LoadingState imageUrl={imageUrl} />
            )}

            {status === "success" && data && (
              <div className="space-y-6 animate-fade-in">
                <NutritionResults
                  data={data}
                  imageUrl={imageUrl}
                  onReset={reset}
                />
              </div>
            )}

            {status === "error" && (
              <ErrorState
                error={error || "An unknown error occurred"}
                imageUrl={imageUrl}
                onReset={reset}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
