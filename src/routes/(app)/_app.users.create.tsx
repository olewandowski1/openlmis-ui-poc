import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/_app/users/create')({
  component: CreateUserPage,
});

function CreateUserPage() {
  return <div>Create User </div>;
}
