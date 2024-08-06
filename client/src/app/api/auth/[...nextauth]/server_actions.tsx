"use server"
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function authenticate_user(display_name: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { display_name },
  });

  if (!user) {
    return null;
  }

  const passwordValid = await bcrypt.compare(password, user.password!);
  if (!passwordValid) {
    return null;
  }

  return user;
}