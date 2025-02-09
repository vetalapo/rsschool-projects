import type { Credentials, CustomerWithToken } from "@/types";
import { LOCALSTORAGE_NAME } from "@/constants";
import { defineStore } from "pinia";
import { getRefreshedToken, getUser } from "@/services/commercetoolsApi";
import router from "@/router";

const getLocalStorageUserData = (): CustomerWithToken | null =>
    JSON.parse(localStorage.getItem(LOCALSTORAGE_NAME) || "{}");

const userData = getLocalStorageUserData();

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        user: userData
    }),
    actions: {
        async logIn(credentials: Credentials) {
            try {
                const userResponse: CustomerWithToken = await getUser(credentials);

                if (userResponse instanceof Error) {
                    throw Error(userResponse.message);
                }

                localStorage.clear();

                this.updateUserData(userResponse);

                router.push({ path: "/" });
            } catch (error) {
                return error;
            }
        },
        logOut() {
            this.user = null;

            this.updateUserData(null);

            router.push({ path: "/" });
        },
        isAuthorized() {
            return Boolean(this.user?.user);
        },
        async isValidCredentials(credentials: Credentials) {
            try {
                const userResponse: CustomerWithToken | Error = await getUser(credentials);

                if (userResponse instanceof Error) {
                    throw Error(userResponse.message);
                }

                return userResponse.user?.email === credentials.email;
            } catch {
                return false;
            }
        },
        updateUserData(userData: CustomerWithToken | null) {
            if (userData === null) {
                localStorage.clear();
            } else {
                this.user = userData;
                localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(userData));
            }
        },
        async refreshToken(): Promise<void> {
            if (this.user?.token) {
                const isTokenExpired = Date.now() > Number(this.user?.token.expires_at);

                if (!isTokenExpired) {
                    return;
                }

                try {
                    this.user.token = await getRefreshedToken(this.user.token.refresh_token);
                } catch (error) {
                    this.user = null;
                }
            } else {
                this.user = null;
            }

            this.updateUserData(this.user);
        }
    }
});
