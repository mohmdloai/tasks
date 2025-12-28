import prisma from '../config/database';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { Role } from '@prisma/client';

export interface RegisterUserData {
  email: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: Role;
}

export const registerUser = async (
  data: RegisterUserData
): Promise<UserResponse> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: Role.USER, // Default role
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const loginUser = async (
  data: LoginUserData
): Promise<UserResponse> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};
