export interface User {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
  createdAt: string;
  isVerified: string;
}

export interface RegisterData {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

export interface LoginData {
  email: string;
  password: string;
}
