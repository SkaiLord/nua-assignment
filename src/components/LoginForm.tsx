'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { login } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export function LoginForm() {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);
  const { toast } = useToast();
  useEffect(() => {
    if (state?.error)
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: state.error,
      });
  }, [state, toast]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
