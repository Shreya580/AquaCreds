import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, saveUser, setCurrentUser, User, getUserWallet, getPurchasesByBuyer, getProjectsByOwner } from '@/utils/localStorage';
import { User as UserIcon, CreditCard, TreePine, TrendingUp } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wallet: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    creditsPurchased: 0,
    totalCO2Offset: 0,
    walletBalance: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    setUser(currentUser);
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      wallet: currentUser.wallet || '',
      role: currentUser.role
    });

    // Load user stats
    const walletBalance = getUserWallet(currentUser.id);
    const purchases = getPurchasesByBuyer(currentUser.id);
    const projects = getProjectsByOwner(currentUser.id);
    
    const totalCredits = purchases.reduce((sum, p) => sum + p.credits, 0);
    const totalCO2 = purchases.reduce((sum, p) => sum + p.co2Offset, 0);

    setStats({
      projects: projects.length,
      creditsPurchased: totalCredits,
      totalCO2Offset: totalCO2,
      walletBalance
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser: User = {
        ...user,
        name: formData.name,
        email: formData.email,
        wallet: formData.wallet,
        role: formData.role as User['role']
      };

      saveUser(updatedUser);
      setCurrentUser(updatedUser);
      setUser(updatedUser);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 ocean-gradient rounded-full flex items-center justify-center">
              <UserIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-sora">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your AquaCreds account</p>
            </div>
          </div>

          {/* Quick Stats */}
          {user.role !== 'Verifier' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <TreePine className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.projects}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.creditsPurchased.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Credits Purchased</p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-coral-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.totalCO2Offset.toFixed(1)} tons</p>
                  <p className="text-sm text-muted-foreground">Total CO₂ Offset</p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="h-8 w-8 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-warning font-bold">₹</span>
                  </div>
                  <p className="text-2xl font-bold">₹{stats.walletBalance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                </CardContent>
              </Card>
            </div>
          )}

          {user.role === 'Verifier' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <TreePine className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.projects}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-coral-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.totalCO2Offset.toFixed(1)} tons</p>
                  <p className="text-sm text-muted-foreground">Total CO₂ Offset</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile Form */}
          <Card className="ocean-shadow">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile information and preferences
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input
                      id="wallet"
                      type="text"
                      placeholder="0x... (optional)"
                      value={formData.wallet}
                      onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Project Owner">Project Owner</SelectItem>
                        <SelectItem value="Credit Buyer">Credit Buyer</SelectItem>
                        <SelectItem value="Verifier">Verifier</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="btn-ocean" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
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
                          navigate('/');
                      }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}