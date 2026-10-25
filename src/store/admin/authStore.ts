import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthResponse } from '@/types/admin/auth';

interface AuthState {
    session: AuthResponse | null;
    sessionVersion: number;
    setSession: (session: AuthResponse) => void;
    updateSession: (version: number, session: AuthResponse) => boolean;
    clearSession: () => void;
}

// Axios và route guard cùng đọc một nguồn trạng thái. sessionStorage giữ phiên khi reload tab.
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            session: null,
            sessionVersion: 0,

            // Tính năng login sẽ gọi hàm này sau khi nhận AuthResponse từ BE.
            setSession: (session) => {
                set({ session, sessionVersion: get().sessionVersion + 1 });
            },

            // Không cho kết quả refresh cũ khôi phục phiên sau logout hoặc ghi đè lần login mới.
            updateSession: (version, session) => {
                if (get().sessionVersion !== version || get().session === null) {
                    return false;
                }

                set({ session });
                return true;
            },

            clearSession: () => {
                set({ session: null, sessionVersion: get().sessionVersion + 1 });
            },
        }),
        {
            name: 'bitetobusiness.auth',
            storage: createJSONStorage(() => sessionStorage),
            // Không lưu các hàm hoặc bộ đếm vào storage.
            partialize: (state) => ({ session: state.session }),
        },
    ),
);
