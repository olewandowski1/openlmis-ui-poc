import { create } from 'zustand';

type PasswordModalState = {
  isOpen: boolean;
  username: string;
  open: (username: string) => void;
  close: () => void;
};

export const usePasswordModal = create<PasswordModalState>((set) => ({
  isOpen: false,
  userId: null,
  username: '',

  open: (username: string) => {
    return set({
      isOpen: true,
      username: username,
    });
  },
  close: () =>
    set({
      isOpen: false,
      username: '',
    }),
}));
