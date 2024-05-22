'use server';

import { sessionOptions, SessionData, defaultSession } from '@/lib/definitions';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

let email = process.env.ADMIN_EMAIL;
let password = process.env.ADMIN_PASSWORD;

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
};

export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();

  const formEmail = formData.get('email') as string;
  const formPassword = formData.get('password') as string;

  if (formEmail !== email || formPassword !== password) {
    // console.log(formEmail, email);
    return { error: 'Wrong Credentials!' };
  }

  session.userId = '1';
  session.email = formEmail;
  session.isLoggedIn = true;

  await session.save();
  redirect('/admin');
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect('/');
};
