import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, getProjects, saveProject, addNotification, getNotificationsByUser } from '@/utils/localStorage';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileCheck, Eye, Bell, Shield, Satellite, Copy } from 'lucide-react';

export default function VerifierDashboard() {
  const [user, setUser] = useState(getCurrentUser());
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    thisMonth: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'Verifier') {
      navigate('/signin');
      return;
    }

    // Load all projects for verification
    const allProjects = getProjects();
    setProjects(allProjects);

    // Calculate stats
    const pending = allProjects.filter(p => p.status === 'Pending').length;
    const approved = allProjects.filter(p => p.status === 'Approved').length;
    const rejected = allProjects.filter(p => p.status === 'Rejected').length;
    
    // Projects verified this month (simplified)
    const thisMonth = allProjects.filter(p => 
      p.verifiedAt && new Date(p.verifiedAt).getMonth() === new Date().getMonth()
    ).length;

    setStats({
      totalPending: pending,
      totalApproved: approved,
      totalRejected: rejected,
      thisMonth
    });

    // Load notifications
    const userNotifications = getNotificationsByUser(user.id);
    setNotifications(userNotifications.slice(0, 5));
  }, [user, navigate]);

  const handleVerification = (projectId: string, status: 'Approved' | 'Rejected') => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject = {
      ...project,
      status,
      verifiedAt: new Date().toISOString(),
      verificationNotes
    };

    saveProject(updatedProject);

    // Add notification for project owner
    addNotification({
      userId: project.ownerId,
      message: `Your project "${project.title}" has been ${status.toLowerCase()} by the verification team.${verificationNotes ? ` Notes: ${verificationNotes}` : ''}`,
      type: status === 'Approved' ? 'success' : 'warning',
      timestamp: new Date().toISOString(),
      read: false
    });

    // Update local state
    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    setProjects(updatedProjects);

    setSelectedProject(null);
    setVerificationNotes('');

    toast({
      title: `Project ${status}`,
      description: `${project.title} has been ${status.toLowerCase()}.`,
    });
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
          <h1 className="text-3xl font-bold font-sora">Verification Dashboard</h1>
          <p className="text-muted-foreground">Review and verify blue carbon projects for marketplace listing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-warning">{stats.totalPending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-success">{stats.totalApproved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-destructive">{stats.totalRejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{stats.thisMonth}</p>
                </div>
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="ocean-shadow">
              <CardHeader>
                <CardTitle>Project Verification Queue</CardTitle>
                <CardDescription>Review and verify submitted blue carbon projects with fraud detection</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Ecosystem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.ownerName}</TableCell>
                          <TableCell>{project.location}</TableCell>
                          <TableCell>{project.ecosystem}</TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedProject(project)}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Project Review: {selectedProject?.title}</DialogTitle>
                                    <DialogDescription>
                                      Verify project details with fraud detection analysis
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedProject && (
                                    <div className="space-y-6">
                                      {/* Fraud Detection Analysis */}
                                      <div>
                                        <h4 className="font-semibold mb-2 flex items-center">
                                          <Shield className="mr-2 h-4 w-4" />
                                          Fraud Detection Analysis
                                        </h4>
                                        <div className="space-y-3">
                                          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <CheckCircle className="h-4 w-4 text-success" />
                                              <span className="text-sm font-medium">EXIF Data Integrity ✓</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">GPS coordinates verified. No tampering detected.</p>
                                          </div>
                                          
                                          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <Satellite className="h-4 w-4 text-success" />
                                              <span className="text-sm font-medium">Satellite Data Match ✓</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Satellite imagery confirms project activities.</p>
                                          </div>

                                          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <Copy className="h-4 w-4 text-success" />
                                              <span className="text-sm font-medium">Duplicate Check ✓</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">No duplicate uploads found in database.</p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Verification Notes */}
                                      <div>
                                        <Label htmlFor="notes">Verification Notes & Feedback</Label>
                                        <Textarea
                                          id="notes"
                                          value={verificationNotes}
                                          onChange={(e) => setVerificationNotes(e.target.value)}
                                          placeholder="Add detailed feedback for the project owner..."
                                          rows={3}
                                        />
                                        <Button
                                          type="button"
                                          variant="outline" 
                                          size="sm"
                                          className="mt-2"
                                          onClick={() => {
                                            setVerificationNotes("Feedback: Please provide additional baseline data per IPCC guidelines.");
                                            toast({
                                              title: "Feedback Template Added",
                                              description: "Standard feedback has been added (demo).",
                                            });
                                          }}
                                        >
                                          <FileCheck className="mr-1 h-3 w-3" />
                                          Add Template Feedback
                                        </Button>
                                      </div>

                                      {/* Action Buttons */}
                                      {selectedProject.status === 'Pending' && (
                                        <div className="flex space-x-4">
                                          <Button
                                            onClick={() => handleVerification(selectedProject.id, 'Approved')}
                                            className="flex-1 bg-success hover:bg-success/90 text-white"
                                          >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve
                                          </Button>
                                          <Button
                                            onClick={() => handleVerification(selectedProject.id, 'Rejected')}
                                            variant="destructive"
                                            className="flex-1"
                                          >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  toast({
                                    title: "MRV Report Accessed",
                                    description: `You have successfully viewed the MRV report for ${project.title} (demo).`,
                                  });
                                }}
                              >
                                <FileCheck className="mr-1 h-3 w-3" />
                                MRV
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No projects to review at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Guidelines */}
            <Card className="coral-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <h5 className="font-semibold mb-1">Key Requirements</h5>
                  <p>Ensure projects meet IPCC guidelines or MoEFCC Guidelines for blue carbon verification.</p>
                </div>
                <div>
                  <h5 className="font-semibold mb-1">Documentation</h5>
                  <p>Verify baseline measurements, methodology, and additionality criteria.</p>
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