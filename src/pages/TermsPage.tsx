import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using NutriScan, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NutriScan provides AI-powered food recognition, calorie estimation, meal planning, 
                  and nutrition tracking services. Our AI analysis is for informational purposes only 
                  and should not replace professional medical or nutritional advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To use certain features, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Upload inappropriate, harmful, or illegal content</li>
                  <li>Attempt to bypass security measures or access unauthorized areas</li>
                  <li>Use the service to harm others or violate their rights</li>
                  <li>Reverse engineer or extract our AI models</li>
                  <li>Use automated systems to abuse the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. AI Accuracy Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Important:</strong> NutriScan's AI-powered food recognition and calorie 
                  estimation are approximations based on visual analysis. Results may vary based on:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Image quality and lighting conditions</li>
                  <li>Food preparation methods and hidden ingredients</li>
                  <li>Portion size estimation limitations</li>
                  <li>Regional variations in recipes and ingredients</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Always verify nutritional information for critical dietary needs. Consult healthcare 
                  professionals for medical nutrition advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NutriScan and its original content, features, and functionality are owned by us. 
                  You retain ownership of content you upload but grant us a license to process it 
                  for providing our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NutriScan is provided "as is" without warranties of any kind. We are not liable 
                  for any indirect, incidental, or consequential damages arising from your use of 
                  the service or reliance on nutritional information provided.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of 
                  significant changes via email or in-app notification. Continued use after changes 
                  constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us at support@nutriscan.app
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
