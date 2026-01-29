import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  NutriScan collects information you provide directly, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Account information (email, name, profile details)</li>
                  <li>Health and nutrition data (weight, height, dietary preferences)</li>
                  <li>Food images you upload for analysis</li>
                  <li>Meal logs and nutrition tracking data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Provide AI-powered food analysis and nutrition insights</li>
                  <li>Generate personalized meal plans based on your goals</li>
                  <li>Track your progress and provide recommendations</li>
                  <li>Send notifications and reminders (with your consent)</li>
                  <li>Improve our AI models and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Encryption in transit and at rest</li>
                  <li>Secure authentication with optional two-factor authentication</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and monitoring</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell your personal data. We may share data with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Service providers who help operate our platform</li>
                  <li>Legal authorities when required by law</li>
                  <li>Third parties with your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>Access and download your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Food Image Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Food images you upload are processed by our AI to provide nutritional analysis. 
                  Images are stored securely and used only for providing our services. 
                  You can delete your meal history at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Cookies and Analytics</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use essential cookies for authentication and preferences. 
                  Analytics help us understand how users interact with NutriScan to improve the experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For privacy-related questions or to exercise your rights, please contact us at privacy@nutriscan.app
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
