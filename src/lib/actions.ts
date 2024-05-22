'use server';

import { sessionOptions, SessionData, defaultSession } from '@/lib/definitions';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

let email = 'admin@nuawoman.com';
let isPro = true;
let isBlocked = true;

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  // CHECK THE USER IN THE DB
  session.isBlocked = isBlocked;
  session.isPro = isPro;

  return session;
};

export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();

  const formEmail = formData.get('email') as string;
  const formPassword = formData.get('password') as string;

  if (formEmail !== email) {
    console.log(formEmail, email);
    return { error: 'Wrong Credentials!' };
  }

  session.userId = '1';
  session.email = formEmail;
  session.isPro = isPro;
  session.isLoggedIn = true;

  await session.save();
  redirect('/admin');
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect('/');
};
