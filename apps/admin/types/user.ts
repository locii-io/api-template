export interface User {
  id: 1;
  name: string;
  email: string;
  isActive: boolean;
}

export interface AllUsersResult {
  users: User[];
}
