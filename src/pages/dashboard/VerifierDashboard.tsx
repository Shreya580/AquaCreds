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
import { CheckCircle, XCircle, Clock, AlertTriangle, FileCheck, Eye, Bell } from 'lucide-react';

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

    // Add notification for admin
    addNotification({
      userId: 'admin-1',
      message: `Project "${project.title}" has been ${status.toLowerCase()} by ${user.name}`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    });

    // Update local state
    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    setProjects(updatedProjects);

    // Update stats
    const pending = updatedProjects.filter(p => p.status === 'Pending').length;
    const approved = updatedProjects.filter(p => p.status === 'Approved').length;
    const rejected = updatedProjects.filter(p => p.status === 'Rejected').length;

    setStats(prev => ({
      ...prev,
      totalPending: pending,
      totalApproved: approved,
      totalRejected: rejected
    }));

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
                <CardDescription>Review and verify submitted blue carbon projects</CardDescription>
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
                              
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Project Review: {selectedProject?.title}</DialogTitle>
                                  <DialogDescription>
                                    Verify project details and compliance with blue carbon standards
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedProject && (
                                  <div className="space-y-6">
                                    {/* Project Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2">Project Information</h4>
                                        <div className="space-y-2 text-sm">
                                          <div><strong>Title:</strong> {selectedProject.title}</div>
                                          <div><strong>Location:</strong> {selectedProject.location}</div>
                                          <div><strong>Ecosystem:</strong> {selectedProject.ecosystem}</div>
                                          <div><strong>Owner:</strong> {selectedProject.ownerName}</div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-semibold mb-2">Impact Metrics</h4>
                                        <div className="space-y-2 text-sm">
                                          <div><strong>Credits Generated:</strong> {selectedProject.creditsGenerated.toLocaleString()}</div>
                                          <div><strong>Price per Credit:</strong> ₹{selectedProject.pricePerCredit}</div>
                                          <div><strong>CO₂ Offset:</strong> {selectedProject.co2Offset} tons</div>
                                          <div><strong>Status:</strong> {selectedProject.status}</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Project Description */}
                                    <div>
                                      <h4 className="font-semibold mb-2">Project Description</h4>
                                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                        {selectedProject.description}
                                      </p>
                                    </div>

                                    {/* Verification Checklist */}
                                    <div>
                                      <h4 className="font-semibold mb-2">Verification Checklist</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                          <CheckCircle className="h-4 w-4 text-success" />
                                          <span>Project location verified</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <CheckCircle className="h-4 w-4 text-success" />
                                          <span>Ecosystem type confirmed</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <CheckCircle className="h-4 w-4 text-success" />
                                          <span>Carbon sequestration methodology reviewed</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <CheckCircle className="h-4 w-4 text-success" />
                                          <span>Additionality criteria met</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Verification Notes */}
                                    <div>
                                      <Label htmlFor="notes">Verification Notes (Optional)</Label>
                                      <Textarea
                                        id="notes"
                                        value={verificationNotes}
                                        onChange={(e) => setVerificationNotes(e.target.value)}
                                        placeholder="Add any notes or feedback for the project owner..."
                                        rows={3}
                                      />
                                    </div>

                                     {/* Action Buttons - Approve and Reject at the end */}
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

                                    {selectedProject.status !== 'Pending' && (
                                      <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                          This project has already been {selectedProject.status.toLowerCase()}.
                                          {selectedProject.verificationNotes && (
                                            <>
                                              <br />
                                              <strong>Notes:</strong> {selectedProject.verificationNotes}
                                            </>
                                          )}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
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
                  <h4 className="font-medium mb-1">Blue Carbon Standards</h4>
                  <p className="text-muted-foreground">Ensure projects meet IPCC guidelines or MoEFCC Guidelines.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Additionality</h4>
                  <p className="text-muted-foreground">Verify that conservation wouldn't happen without the project.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Permanence</h4>
                  <p className="text-muted-foreground">Assess long-term protection measures and risks.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Monitoring Plan</h4>
                  <p className="text-muted-foreground">Review MRV methodology and data collection plans.</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
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