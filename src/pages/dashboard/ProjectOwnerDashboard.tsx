import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, getProjectsByOwner, saveProject, Project, getNotificationsByUser, addNotification } from '@/utils/localStorage';
import { Plus, TreePine, DollarSign, TrendingUp, Bell, MapPin, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function ProjectOwnerDashboard() {
  const [user, setUser] = useState(getCurrentUser());
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    location: '',
    ecosystem: '',
    description: '',
    saplingsPlanted: 0
  });
  const [stats, setStats] = useState({
    totalProjects: 0,
    creditsGenerated: 0,
    totalRevenue: 0,
    pendingProjects: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'Project Owner') {
      navigate('/signin');
      return;
    }

    // Load user's projects
    const userProjects = getProjectsByOwner(user.id);
    setProjects(userProjects);

    // Calculate stats
    const totalCredits = userProjects.reduce((sum, p) => sum + p.creditsGenerated, 0);
    const totalRevenue = userProjects.reduce((sum, p) => sum + (p.creditsGenerated - p.creditsAvailable) * p.pricePerCredit, 0);
    const pending = userProjects.filter(p => p.status === 'Pending').length;

    setStats({
      totalProjects: userProjects.length,
      creditsGenerated: totalCredits,
      totalRevenue,
      pendingProjects: pending
    });

    // Load notifications
    const userNotifications = getNotificationsByUser(user.id);
    setNotifications(userNotifications.slice(0, 5));
  }, [user, navigate]);

  const handleSubmitProject = () => {
    if (!user) return;

    if (!newProject.title || !newProject.location || !newProject.ecosystem || !newProject.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      location: newProject.location,
      ecosystem: newProject.ecosystem,
      description: newProject.description,
      creditsGenerated: 0,
      creditsAvailable: 0,
      pricePerCredit: 0,
      status: 'Pending',
      ownerId: user.id,
      ownerName: user.name,
      co2Offset: 0,
      saplingsPlanted: newProject.saplingsPlanted,
      createdAt: new Date().toISOString()
    };

    saveProject(project);
    
    // Add notification for user
    addNotification({
      userId: user.id,
      message: `Project "${newProject.title}" submitted for verification`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    });

    // Add notification for admin (assuming admin user ID exists)
    addNotification({
      userId: 'admin-1',
      message: `New project "${newProject.title}" submitted by ${user.name} for verification`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    });

    setProjects([...projects, project]);
    setIsDialogOpen(false);
    setNewProject({
      title: '',
      location: '',
      ecosystem: '',
      description: '',
      saplingsPlanted: 0
    });

    toast({
      title: "Project Submitted",
      description: "Your project has been submitted for verification.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'Rejected':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sora">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your blue carbon projects and track your impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <TreePine className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits Generated</p>
                  <p className="text-2xl font-bold animate-count-up">{stats.creditsGenerated.toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-success/20 rounded-full flex items-center justify-center">
                  <span className="text-success font-bold text-sm">C</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-coral-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pendingProjects}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <Card className="ocean-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Projects</CardTitle>
                  <CardDescription>Manage your blue carbon restoration projects</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-ocean">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Register New Project</DialogTitle>
                      <DialogDescription>
                        Submit your coastal restoration project for verification
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Project Title *</Label>
                          <Input
                            id="title"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            placeholder="e.g., Sundarbans Mangrove Restoration"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={newProject.location}
                            onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                            placeholder="e.g., West Bengal, India"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="ecosystem">Ecosystem Type *</Label>
                        <Select value={newProject.ecosystem} onValueChange={(value) => setNewProject({ ...newProject, ecosystem: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ecosystem type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mangroves">Mangroves</SelectItem>
                            <SelectItem value="Seagrass">Seagrass</SelectItem>
                            <SelectItem value="Salt Marsh">Salt Marsh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">Project Description *</Label>
                        <Textarea
                          id="description"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          placeholder="Describe your project's goals, methodology, and expected impact..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="saplings">No. of Saplings Planted</Label>
                        <Input
                          id="saplings"
                          type="number"
                          value={newProject.saplingsPlanted || ''}
                          onChange={(e) => setNewProject({ ...newProject, saplingsPlanted: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>

                      <Button onClick={handleSubmitProject} className="w-full btn-ocean">
                        Submit for Verification
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No projects yet. Add your first project to get started!</p>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <Card key={project.id} className="hover-lift">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold mb-1">{project.title}</h4>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {project.location}
                              </div>
                            </div>
                            <div className={`flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                              {getStatusIcon(project.status)}
                              <span className="text-sm font-medium">{project.status}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <div>
                              <p className="text-muted-foreground">Saplings Planted</p>
                              <p className="font-semibold">{project.saplingsPlanted?.toLocaleString() || 0}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
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
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Marketplace
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TreePine className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/help" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Help Center
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
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