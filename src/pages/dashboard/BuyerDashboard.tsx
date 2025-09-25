import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, getUserWallet, getPurchasesByBuyer, getProjects, getNotificationsByUser } from '@/utils/localStorage';
import { ShoppingCart, CreditCard, TrendingUp, Download, Wallet, TreePine, Bell, Award } from 'lucide-react';

export default function BuyerDashboard() {
  const [user, setUser] = useState(getCurrentUser());
  const [purchases, setPurchases] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalCredits: 0,
    totalCO2Offset: 0,
    totalSpent: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'Credit Buyer') {
      navigate('/signin');
      return;
    }

    // Load user's purchases
    const userPurchases = getPurchasesByBuyer(user.id);
    setPurchases(userPurchases);

    // Get wallet balance
    const balance = getUserWallet(user.id);
    setWalletBalance(balance);

    // Calculate stats
    const totalCredits = userPurchases.reduce((sum, p) => sum + p.credits, 0);
    const totalCO2 = userPurchases.reduce((sum, p) => sum + p.co2Offset, 0);
    const totalSpent = userPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

    setStats({
      totalPurchases: userPurchases.length,
      totalCredits,
      totalCO2Offset: totalCO2,
      totalSpent
    });

    // Load notifications
    const userNotifications = getNotificationsByUser(user.id);
    setNotifications(userNotifications.slice(0, 5));
  }, [user, navigate]);

  const downloadCertificate = (purchase: any) => {
    // Simulate PDF download
    toast({
      title: "Certificate Downloaded",
      description: `Impact certificate for ${purchase.credits} credits has been downloaded.`,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sora">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Track your carbon offset impact and manage your purchases</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                  <p className="text-2xl font-bold">₹{walletBalance.toLocaleString()}</p>
                </div>
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits Owned</p>
                  <p className="text-2xl font-bold animate-count-up">{stats.totalCredits.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CO₂ Offset</p>
                  <p className="text-2xl font-bold">{stats.totalCO2Offset.toFixed(1)} tons</p>
                </div>
                <TreePine className="h-8 w-8 text-coral-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Overview */}
            <Card className="ocean-shadow">
              <CardHeader>
                <CardTitle>Carbon Portfolio</CardTitle>
                <CardDescription>Your environmental impact at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Impact Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success mb-1">{stats.totalCredits.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Blue Carbon Credits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">{stats.totalCO2Offset.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Tons CO₂ Offset</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-coral-accent mb-1">{stats.totalPurchases}</div>
                      <div className="text-sm text-muted-foreground">Projects Supported</div>
                    </div>
                  </div>

                  {/* Environmental Equivalents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Environmental Equivalent</h4>
                      <p className="text-sm text-muted-foreground">
                        Your {stats.totalCO2Offset.toFixed(1)} tons of CO₂ offset is equivalent to:
                      </p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>• {Math.round(stats.totalCO2Offset * 2.4)} trees planted and grown for 10 years</li>
                        <li>• {Math.round(stats.totalCO2Offset * 0.25)} cars driven for a year</li>
                        <li>• {Math.round(stats.totalCO2Offset * 1.2)} homes powered for a month</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Ocean Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        Your investment has supported:
                      </p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>• {Math.round(stats.totalCredits * 0.1)} hectares of coastal restoration</li>
                        <li>• Protection of marine biodiversity</li>
                        <li>• Community livelihood support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase History */}
            <Card className="ocean-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Your recent carbon credit purchases</CardDescription>
                </div>
                <Link to="/marketplace">
                  <Button className="btn-ocean">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy More Credits
                  </Button>
                </Link>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {purchases.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No purchases yet. Start offsetting your carbon footprint!</p>
                      <Link to="/marketplace">
                        <Button className="btn-ocean">
                          Visit Marketplace
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    purchases.map((purchase) => {
                      const projects = getProjects();
                      const project = projects.find(p => p.id === purchase.projectId);
                      
                      return (
                        <Card key={purchase.id} className="hover-lift">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold mb-1">{project?.title || 'Unknown Project'}</h4>
                                <p className="text-sm text-muted-foreground">{project?.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Purchase Date</p>
                                <p className="text-sm font-medium">
                                  {new Date(purchase.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div>
                                <p className="text-muted-foreground">Credits</p>
                                <p className="font-semibold">{purchase.credits.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total Cost</p>
                                <p className="font-semibold">₹{purchase.totalAmount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">CO₂ Offset</p>
                                <p className="font-semibold">{purchase.co2Offset} tons</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Certificate</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadCertificate(purchase)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Download className="mr-1 h-3 w-3" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="coral-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/marketplace" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Browse Marketplace
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Award className="mr-2 h-4 w-4" />
                  My Certificates
                </Button>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TreePine className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Achievement Badge */}
            <Card className="bg-gradient-to-br from-success/10 to-primary/10 border-success/20">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-success mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Ocean Guardian</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You've offset {stats.totalCO2Offset.toFixed(1)} tons of CO₂ through blue carbon projects!
                </p>
                <div className="text-xs text-success">
                  🌊 Marine Conservation Supporter
                </div>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}