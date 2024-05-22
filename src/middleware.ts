import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/actions';

export async function middleware(request: NextRequest) {
  const user = await getSession();

  if (!user.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Protected routes
export const config = {
  matcher: ['/admin'],
};
