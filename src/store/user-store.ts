import { create } from "zustand"
import { persist } from "zustand/middleware"

export type RoleType = "ADMIN" | "USER" | "SECRETARY" | "ENGINEER" | null

export interface User {
  id: string
  role: RoleType
  username: string
}

interface UserState {
  user: User
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: "",
        role: null,
        username: "",
      },
      setUser: (user) => set({ user }),
      clearUser: () =>
        set({
          user: {
            id: "",
            role: null,
            username: "",
          },
        }),
    }),
    {
      name: "user-storage", // nome per il localStorage
    },
  ),
)

