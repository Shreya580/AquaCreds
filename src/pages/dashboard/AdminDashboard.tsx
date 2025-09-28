import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { getUsers, getProjects, getPurchases, getAnalyticsData, getNotificationsByUser } from '@/utils/localStorage';
import { Users, TrendingUp, CreditCard, Shield, Bell, BarChart3, CheckCircle, UserPlus, UserMinus, AlertTriangle, Link as ChainIcon, Eye, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(() => {
    const currentUser = localStorage.getItem('aquacreds_user');
    return currentUser ? JSON.parse(currentUser) : null;
  });
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    
    totalRevenue: 0,
    pendingVerifications: 0,
    activeProjects: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/signin');
      return;
    }

    // Load all data
    const allUsers = getUsers();
    const allProjects = getProjects();
    const allPurchases = getPurchases();
    const analyticsData = getAnalyticsData();

    setUsers(allUsers);
    setProjects(allProjects);
    setPurchases(allPurchases);
    setAnalytics(analyticsData);

    // Calculate stats
    const totalRevenue = allPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const pendingProjects = allProjects.filter(p => p.status === 'Pending').length;
    const activeProjects = allProjects.filter(p => p.status === 'Approved').length;

    setStats({
      totalUsers: allUsers.length,
      totalProjects: allProjects.length,
      totalRevenue,
      pendingVerifications: pendingProjects,
      activeProjects
    });

    // Load notifications (assuming admin ID)
    const adminNotifications = getNotificationsByUser('admin-1');
    setNotifications(adminNotifications.slice(0, 5));
  }, [user, navigate]);

  const getUserRoleBadge = (role: string) => {
    const roleColors = {
      'Project Owner': 'bg-primary text-white',
      'Credit Buyer': 'bg-success text-white',
      'Verifier': 'bg-warning text-white',
      'Admin': 'bg-destructive text-white'
    };
    
    return <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-500 text-white'}>{role}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-success text-white">Approved</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="border-warning text-warning">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sora">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and system management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>


          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
                </div>
                <Shield className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-ocean-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* User Management */}
            <Card className="ocean-shadow">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Overview of all platform users</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.slice(0, 10).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-success text-white">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Project Analytics */}
            <Card className="ocean-shadow">
              <CardHeader>
                <CardTitle>Project Status Overview</CardTitle>
                <CardDescription>All projects and their verification status</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.ownerName}</TableCell>
                          <TableCell>{project.location}</TableCell>
                          <TableCell>{project.creditsGenerated.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell>
                            ₹{((project.creditsGenerated - project.creditsAvailable) * project.pricePerCredit).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Analytics */}
            <Card className="coral-shadow">
              <CardHeader>
                <CardTitle>Monthly Trading Analytics</CardTitle>
                <CardDescription>Credits traded per month (₹ in thousands)</CardDescription>
              </CardHeader>
              
              <CardContent>
                 <div className="grid grid-cols-6 gap-4 text-center">
                  {[120, 150, 180, 135, 165, 190].map((revenue: number, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        ₹{revenue}k
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(0, index + 6).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(revenue / 190) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role Management */}
            <Card className="ocean-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Role Management
                </CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="flex items-center justify-center p-6 h-auto flex-col space-y-2"
                    onClick={() => {
                      toast({
                        title: "Verifier Added Successfully",
                        description: "New verifier role has been assigned to user@example.com (demo).",
                      });
                    }}
                  >
                    <UserPlus className="h-8 w-8" />
                    <span>Add Verifier</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center justify-center p-6 h-auto flex-col space-y-2"
                    onClick={() => {
                      toast({
                        title: "Verifier Removed Successfully",
                        description: "Verifier role has been removed from specified user (demo).",
                      });
                    }}
                  >
                    <UserMinus className="h-8 w-8" />
                    <span>Remove Verifier</span>
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    className="flex items-center justify-center p-6 h-auto flex-col space-y-2"
                    onClick={() => {
                      toast({
                        title: "User Flagged Successfully",
                        description: "Suspicious user has been flagged and restricted (demo).",
                      });
                    }}
                  >
                    <AlertTriangle className="h-8 w-8" />
                    <span>Flag Suspicious User</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Explorer */}
            <Card className="ocean-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChainIcon className="mr-2 h-5 w-5" />
                  Blockchain Explorer
                </CardTitle>
                <CardDescription>Track transactions and project activities on blockchain</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-success/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Latest Transactions</h4>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-3 w-3" />
                        View All
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>Credit Issuance - Project #1847</span>
                        <span className="text-success font-medium">2,500 Credits</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>Marketplace Purchase - Buyer #234</span>
                        <span className="text-primary font-medium">500 Credits</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>Project Verification - Verifier #12</span>
                        <span className="text-warning font-medium">Approved</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">24,567</div>
                      <div className="text-sm text-muted-foreground">Total Transactions</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-success">98.7%</div>
                      <div className="text-sm text-muted-foreground">Network Uptime</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platform Health */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-success">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">System Status</span>
                  <Badge className="bg-success text-white">Operational</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-success text-white">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-success text-white">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <Badge className="bg-success text-white">85% Free</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">IPCC guidelines compliance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Gold Standard Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">MRV Data Integrity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Financial Audits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Security Protocols</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent System Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  System Activity
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