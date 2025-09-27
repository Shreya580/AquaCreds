// Clear all localStorage data for a fresh start
export function clearAllLocalStorageData() {
  // Clear all AquaCreds related data
  localStorage.removeItem('aquacreds_user');
  localStorage.removeItem('aquacreds_users');
  localStorage.removeItem('aquacreds_projects');
  localStorage.removeItem('aquacreds_purchases');
  localStorage.removeItem('aquacreds_notifications');
  localStorage.removeItem('aquacreds_wallets');
  localStorage.removeItem('aquacreds_analytics');
  
  console.log('All localStorage data cleared');
}

// Call this immediately to clear all data
clearAllLocalStorageData();