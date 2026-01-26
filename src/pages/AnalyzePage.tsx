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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Analyze Your Food
              </h1>
              <p className="mt-2 text-muted-foreground">
                Upload or capture a photo of your meal to get instant nutritional insights
              </p>
            </div>

            {status === "idle" && (
              <ImageUploader
                onImageSelect={analyzeImage}
                isLoading={false}
              />
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
              <NutritionResults
                data={data}
                imageUrl={imageUrl}
                onReset={reset}
              />
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
