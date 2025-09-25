import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { getUsers, setCurrentUser } from '@/utils/localStorage';
import { LogIn, Waves } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const users = getUsers();
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (!user) {
        toast({
          title: "Error",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return;
      }

      setCurrentUser(user);

      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${user.role}.`,
      });

      // Navigate to appropriate dashboard
      switch (user.role) {
        case 'Project Owner':
          navigate('/dashboard/project-owner');
          break;
        case 'Credit Buyer':
          navigate('/dashboard/buyer');
          break;
        case 'Verifier':
          navigate('/dashboard/verifier');
          break;
        case 'Admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md ocean-shadow">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 ocean-gradient rounded-full flex items-center justify-center">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold font-sora">Sign In</CardTitle>
              <CardDescription>
                Welcome back to AquaCreds
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full btn-ocean" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Create one here
                </Link>
              </div>
            </form>

            {/* Demo hint */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Mode:</strong> Create a new account or use any test credentials
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}