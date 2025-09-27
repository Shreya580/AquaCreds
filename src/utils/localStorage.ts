// LocalStorage utility functions for AquaCreds demo

export interface User {
  id: string;
  name: string;
  email: string;
  wallet?: string;
  role: 'Project Owner' | 'Credit Buyer' | 'Verifier' | 'Admin';
  password: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  ecosystem: string;
  description: string;
  creditsGenerated: number;
  creditsAvailable: number;
  pricePerCredit: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  ownerId: string;
  ownerName: string;
  image?: string;
  co2Offset: number;
  saplingsPlanted?: number;
  createdAt: string;
  verifiedAt?: string;
  verificationNotes?: string;
}

export interface Purchase {
  id: string;
  projectId: string;
  buyerId: string;
  credits: number;
  totalAmount: number;
  co2Offset: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

// Initialize demo data
export function initializeDemoData() {
  if (!localStorage.getItem('aquacreds_projects')) {
    const demoProjects: Project[] = [
      {
        id: '1',
        title: 'Sundarbans Mangrove Restoration',
        location: 'West Bengal, India',
        ecosystem: 'Mangroves',
        description: 'Large-scale mangrove restoration project in the Sundarbans delta, protecting coastal communities and sequestering carbon.',
        creditsGenerated: 1200,
        creditsAvailable: 800,
        pricePerCredit: 450,
        status: 'Approved',
        ownerId: 'demo-owner-1',
        ownerName: 'Coastal Conservation Trust',
        co2Offset: 2400,
        createdAt: '2024-01-15',
        verifiedAt: '2024-02-01'
      },
      {
        id: '2',
        title: 'Goa Seagrass Conservation',
        location: 'Goa, India',
        ecosystem: 'Seagrass',
        description: 'Seagrass meadow restoration and protection project along the Goa coastline.',
        creditsGenerated: 850,
        creditsAvailable: 650,
        pricePerCredit: 380,
        status: 'Approved',
        ownerId: 'demo-owner-2',
        ownerName: 'Marine Conservation Society',
        co2Offset: 1700,
        createdAt: '2024-02-10',
        verifiedAt: '2024-02-25'
      },
      {
        id: '3',
        title: 'Andaman Coral Reef Protection',
        location: 'Andaman & Nicobar Islands, India',
        ecosystem: 'Coral Reefs',
        description: 'Coral reef restoration and protection initiative in the pristine waters of Andaman Islands.',
        creditsGenerated: 950,
        creditsAvailable: 400,
        pricePerCredit: 520,
        status: 'Approved',
        ownerId: 'demo-owner-3',
        ownerName: 'Island Ecology Foundation',
        co2Offset: 1900,
        createdAt: '2024-01-20',
        verifiedAt: '2024-02-05'
      }
    ];
    localStorage.setItem('aquacreds_projects', JSON.stringify(demoProjects));
  }
}

// User management
export function saveUser(user: User) {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('aquacreds_users', JSON.stringify(users));
}

export function getUsers(): User[] {
  const users = localStorage.getItem('aquacreds_users');
  return users ? JSON.parse(users) : [];
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem('aquacreds_user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem('aquacreds_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('aquacreds_user');
  }
}

// Project management
export function saveProject(project: Project) {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem('aquacreds_projects', JSON.stringify(projects));
}

export function getProjects(): Project[] {
  const projects = localStorage.getItem('aquacreds_projects');
  return projects ? JSON.parse(projects) : [];
}

export function getProjectsByOwner(ownerId: string): Project[] {
  return getProjects().filter(p => p.ownerId === ownerId);
}

// Purchase management
export function savePurchase(purchase: Purchase) {
  const purchases = getPurchases();
  purchases.push(purchase);
  localStorage.setItem('aquacreds_purchases', JSON.stringify(purchases));
}

export function getPurchases(): Purchase[] {
  const purchases = localStorage.getItem('aquacreds_purchases');
  return purchases ? JSON.parse(purchases) : [];
}

export function getPurchasesByBuyer(buyerId: string): Purchase[] {
  return getPurchases().filter(p => p.buyerId === buyerId);
}

// Notification management
export function addNotification(notification: Omit<Notification, 'id'>) {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
  };
  notifications.unshift(newNotification);
  localStorage.setItem('aquacreds_notifications', JSON.stringify(notifications));
}

export function getNotifications(): Notification[] {
  const notifications = localStorage.getItem('aquacreds_notifications');
  return notifications ? JSON.parse(notifications) : [];
}

export function getNotificationsByUser(userId: string): Notification[] {
  return getNotifications().filter(n => n.userId === userId);
}

export function markNotificationAsRead(notificationId: string) {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem('aquacreds_notifications', JSON.stringify(notifications));
  }
}

// Wallet management (simplified for demo)
export function getUserWallet(userId: string): number {
  const wallets = localStorage.getItem('aquacreds_wallets');
  const walletsData = wallets ? JSON.parse(wallets) : {};
  return walletsData[userId] || 100000; // Default ₹1,00,000 for demo
}

export function updateUserWallet(userId: string, amount: number) {
  const wallets = localStorage.getItem('aquacreds_wallets');
  const walletsData = wallets ? JSON.parse(wallets) : {};
  walletsData[userId] = (walletsData[userId] || 100000) + amount;
  localStorage.setItem('aquacreds_wallets', JSON.stringify(walletsData));
}

// Analytics data
export function getAnalyticsData() {
  const analytics = localStorage.getItem('aquacreds_analytics');
  return analytics ? JSON.parse(analytics) : {
    monthlyCredits: [2500, 3200, 2800, 4100, 3600, 4500],
    totalUsers: 147,
    totalProjects: 23,
    totalCreditsTraded: 18500,
    totalRevenue: 8200000
  };
}

export function updateAnalytics(data: any) {
  localStorage.setItem('aquacreds_analytics', JSON.stringify(data));
}