"use server"
import  prisma  from '@/lib/prisma';
import bcrypt from 'bcrypt';


export const create_user = async (name: string, display_name: string, password: string | Buffer) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { display_name },
  });

  if (existingUser) {
    return { status: 400, error: 'This display_name is already associated with an account' };
  }

  try {
    await prisma.user.create({
      data: {
        name,
        display_name,
        password: hashedPassword,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error('An error occurred while creating the user:', error);
    return { status: 400, error: 'An error occurred while creating the user.' };
  }
};

export const check_display_name_availability = async (display_name: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { display_name },
  });

  if (existingUser) {
    return false;
  }

  return true;
}