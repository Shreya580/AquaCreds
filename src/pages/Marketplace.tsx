import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { getProjects, Project, getCurrentUser, savePurchase, updateUserWallet, getUserWallet, addNotification, saveProject } from '@/utils/localStorage';
import { Search, Filter, MapPin, TreePine, ShoppingCart, CheckCircle } from 'lucide-react';
import mangroveImage from '@/assets/mangrove-project.jpg';
import seagrassImage from '@/assets/seagrass-project.jpg';
import coralImage from '@/assets/coral-project.jpg';

export default function Marketplace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ecosystem: 'all',
    location: '',
    priceRange: 'all'
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [walletBalance, setWalletBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const allProjects = getProjects().filter(p => p.status === 'Approved' && p.creditsAvailable > 0);
    setProjects(allProjects);
    setFilteredProjects(allProjects);
    
    if (user) {
      setWalletBalance(getUserWallet(user.id));
    }
  }, [user]);

  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ecosystem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ecosystem filter
    if (filters.ecosystem && filters.ecosystem !== 'all') {
      filtered = filtered.filter(p => p.ecosystem === filters.ecosystem);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => p.pricePerCredit >= min && p.pricePerCredit <= max);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, filters, projects]);

  const getProjectImage = (ecosystem: string) => {
    switch (ecosystem) {
      case 'Mangroves':
        return mangroveImage;
      case 'Seagrass':
        return seagrassImage;
      case 'Coral Reefs':
        return coralImage;
      default:
        return mangroveImage;
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase credits.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProject) return;

    const totalCost = purchaseAmount * selectedProject.pricePerCredit;
    
    if (totalCost > walletBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough funds in your wallet.",
        variant: "destructive",
      });
      return;
    }

    if (purchaseAmount > selectedProject.creditsAvailable) {
      toast({
        title: "Not Enough Credits",
        description: "The requested amount exceeds available credits.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create purchase record
      const purchase = {
        id: Date.now().toString(),
        projectId: selectedProject.id,
        buyerId: user.id,
        credits: purchaseAmount,
        totalAmount: totalCost,
        co2Offset: purchaseAmount * 2, // Assuming 2 tons CO2 per credit
        timestamp: new Date().toISOString()
      };

      savePurchase(purchase);

      // Update buyer's wallet
      updateUserWallet(user.id, -totalCost);
      setWalletBalance(getUserWallet(user.id));

      // Update project owner's revenue (add to their wallet)
      updateUserWallet(selectedProject.ownerId, totalCost);

      // Update project's available credits
      const updatedProject = {
        ...selectedProject,
        creditsAvailable: selectedProject.creditsAvailable - purchaseAmount
      };
      saveProject(updatedProject);

      // Add notifications
      addNotification({
        userId: user.id,
        message: `Successfully purchased ${purchaseAmount} credits from ${selectedProject.title} for ₹${totalCost.toLocaleString()}`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
      });

      addNotification({
        userId: selectedProject.ownerId,
        message: `${user.name} purchased ${purchaseAmount} credits from your project ${selectedProject.title} - Revenue: ₹${totalCost.toLocaleString()}`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
      });

      // Update local state
      const updatedProjects = projects.map(p => p.id === selectedProject.id ? updatedProject : p);
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects.filter(p => p.status === 'Approved' && p.creditsAvailable > 0));

      toast({
        title: "Purchase Successful!",
        description: `You've purchased ${purchaseAmount} credits for ₹${totalCost.toLocaleString()}. CO₂ offset: ${purchase.co2Offset} tons.`,
      });

      setSelectedProject(null);
      setPurchaseAmount(1);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Failed to complete purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold font-sora">Blue Carbon Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover and purchase verified blue carbon credits from coastal restoration projects across India
          </p>
          {user && (
            <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full">
              <span className="font-medium">Wallet Balance: ₹{walletBalance.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 card-shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.ecosystem} onValueChange={(value) => setFilters({ ...filters, ecosystem: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Ecosystem Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ecosystems</SelectItem>
                <SelectItem value="Mangroves">Mangroves</SelectItem>
                <SelectItem value="Seagrass">Seagrass</SelectItem>
                <SelectItem value="Coral Reefs">Coral Reefs</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Location (e.g., West Bengal)"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />

            <Select value={filters.priceRange} onValueChange={(value) => setFilters({ ...filters, priceRange: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-400">₹0 - ₹400</SelectItem>
                <SelectItem value="400-500">₹400 - ₹500</SelectItem>
                <SelectItem value="500-1000">₹500+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover-lift ocean-shadow overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={getProjectImage(project.ecosystem)}
                  alt={`${project.ecosystem} restoration project`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-success text-white px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="inline h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.ecosystem}
                  </span>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{project.creditsAvailable}</p>
                    <p className="text-xs text-muted-foreground">Credits Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">₹{project.pricePerCredit}</p>
                    <p className="text-xs text-muted-foreground">Per Credit</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CO₂ Offset Potential:</span>
                    <span className="font-medium">{project.co2Offset} tons</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Project Owner:</span>
                    <span className="font-medium">{project.ownerName}</span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full btn-ocean" 
                      onClick={() => setSelectedProject(project)}
                      disabled={!user || user.role !== 'Credit Buyer'}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {!user ? 'Sign In to Purchase' : user.role !== 'Credit Buyer' ? 'Buyer Access Only' : 'Buy Credits'}
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Purchase Blue Carbon Credits</DialogTitle>
                      <DialogDescription>
                        {selectedProject?.title} - {selectedProject?.location}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedProject && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-sm text-muted-foreground">Price per Credit</p>
                            <p className="text-2xl font-bold">₹{selectedProject.pricePerCredit}</p>
                          </div>
                          <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-sm text-muted-foreground">Available</p>
                            <p className="text-2xl font-bold">{selectedProject.creditsAvailable}</p>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="amount">Number of Credits</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="1"
                            max={selectedProject.creditsAvailable}
                            value={purchaseAmount}
                            onChange={(e) => setPurchaseAmount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="mt-1"
                          />
                        </div>

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span>Credits:</span>
                            <span>{purchaseAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price per credit:</span>
                            <span>₹{selectedProject.pricePerCredit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CO₂ Offset:</span>
                            <span>{purchaseAmount * 2} tons</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2">
                            <span>Total Cost:</span>
                            <span>₹{(purchaseAmount * selectedProject.pricePerCredit).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Wallet Balance:</span>
                            <span>₹{walletBalance.toLocaleString()}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={handlePurchase} 
                          className="w-full btn-ocean"
                          disabled={isLoading || (purchaseAmount * selectedProject.pricePerCredit) > walletBalance}
                        >
                          {isLoading ? 'Processing...' : 'Confirm Purchase'}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}