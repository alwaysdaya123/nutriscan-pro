import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { lovable } from '@/integrations/lovable';
import { Mail, Shield, Link2, Unlink, Loader2 } from 'lucide-react';

export function AccountInfo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [linking, setLinking] = useState(false);

  const identities = user?.identities || [];
  const hasGoogle = identities.some(i => i.provider === 'google');
  const hasEmail = identities.some(i => i.provider === 'email');

  const getLoginMethod = () => {
    if (hasGoogle && hasEmail) return 'Email & Google';
    if (hasGoogle) return 'Google';
    return 'Email';
  };

  const handleLinkGoogle = async () => {
    setLinking(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: `${window.location.origin}/profile`,
      });
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLinking(false);
    }
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 5))}${local.slice(-1)}@${domain}`;
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Security
        </CardTitle>
        <CardDescription>
          Manage your login methods and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{maskEmail(user?.email || '')}</p>
                <p className="text-sm text-muted-foreground">Primary email</p>
              </div>
            </div>
            {user?.email_confirmed_at && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Verified
              </Badge>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Login Method</p>
            <Badge variant="outline" className="text-sm">
              {getLoginMethod()}
            </Badge>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-3">Connected Accounts</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium">Google</span>
                </div>
                {hasGoogle ? (
                  <Badge className="bg-primary/10 text-primary">
                    <Link2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLinkGoogle}
                    disabled={linking}
                  >
                    {linking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
