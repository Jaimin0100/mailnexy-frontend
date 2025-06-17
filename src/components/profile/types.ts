export interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactElement;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  companyName: string;
  companySize: string;
  location: string;
  timezone: string;
  currency: string;
  phoneNumber: string;
  email: string;
  plan: string;
  avatar?: string;
  receiveUpdates: boolean;
  receiveMarketing: boolean;
}




// export interface MenuItem {
//   name: string;
//   path: string;
//   icon: React.ReactElement;
// }

// export interface UserProfile {
//   firstName: string;
//   lastName: string;
//   companyName: string;
//   companySize: string;
//   location: string;
//   timezone: string;
//   currency: string;
//   phoneNumber: string;
//   email: string;
//   plan: string;
//   avatar?: string;
//   receiveUpdates: boolean;
//   receiveMarketing: boolean;
// }