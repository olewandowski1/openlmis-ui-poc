import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/_app/users/$userId/edit')({
  component: EditUserPage,
});

function EditUserPage() {
  const { userId } = useParams({ from: '/(app)/_app/users/$userId/edit' });

  return <div className='p-2 md:p-4'>User {userId}</div>;
}
