export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone?: string;
  company?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
