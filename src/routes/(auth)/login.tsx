import { ModeToggle } from '@/components/mode-toggle';
import { LoginForm } from '@/features/auth/components/login-form';
import { useLoginData } from '@/features/auth/store/login-data';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/login')({
  beforeLoad: async () => {
    const { isAuthenticated } = useLoginData.getState();

    if (isAuthenticated) {
      throw redirect({
        to: '/home',
      });
    }
  },
  component: LoginPage,
});

/**
 * @name LoginPage
 *
 * @description
 * This is the login page component. It is displayed when the user is not authenticated.
 */
function LoginPage() {
  return (
    <div className='flex flex-col items-center justify-center p-2 md:p-4 min-h-svh'>
      <div className='w-full max-w-4xl'>
        <LoginForm />
      </div>

      <div className='absolute top-2 right-2'>
        <ModeToggle />
      </div>
    </div>
  );
}
