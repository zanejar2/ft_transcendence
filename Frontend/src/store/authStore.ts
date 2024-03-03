import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist, createJSONStorage } from 'zustand/middleware';

type StoreUserType = {
    redirectedFor2FA: boolean;
    setRedirectedFor2FA: (v: boolean) => void;
};

export const useAuthStore = createWithEqualityFn<StoreUserType>()(
    persist(
        (set) => ({
            redirectedFor2FA: false,
            setRedirectedFor2FA: (v) => set({ redirectedFor2FA: v })
        }),
        {
            name: 'userStore',
            storage: createJSONStorage(() => localStorage) as any
        }
    ),
    shallow
);
