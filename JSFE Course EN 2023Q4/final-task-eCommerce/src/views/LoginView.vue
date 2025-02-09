<script lang="ts">
    import { ValidationRules } from "@/utils/validationRules";
    import type { Credentials } from "@/types";
    import { useAuthStore } from "@/store";

    export default {
        data: () => ({
            isPasswordVisible: false,
            form: false,
            credentials: { email: "", password: "" } as unknown as Credentials,
            loading: false,
            isLoginError: false,
            commonValidationRules: ValidationRules
        }),
        methods: {
            async onSubmit() {
                if (!this.form) {
                    return;
                }

                this.loading = true;
                this.isLoginError = false;

                const authStore = useAuthStore();

                try {
                    const response = await authStore.logIn(this.credentials);

                    if (response instanceof Error) {
                        throw Error(response.message);
                    }

                    this.loading = false;
                } catch {
                    setTimeout(() => {
                        this.loading = false;
                        this.isLoginError = true;
                    }, 500);
                }
            }
        }
    };
</script>

<template>
    <v-layout>
        <v-main id="login-container" class="d-sm-flex align-center justify-center ga-16">
            <h1 class="text-center">Welcome to our<br />eCommerce</h1>
            <v-card class="pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <div class="app-logo text-center d-sm-flex justify-center ga-5">
                        <h2 class="brand">eCommerce</h2>
                        <span class="app">app</span>
                    </div>

                    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                    <v-text-field
                        class="mb-5"
                        v-model="credentials.email"
                        :rules="[
                            commonValidationRules.required,
                            commonValidationRules.isProperEmail,
                            commonValidationRules.isEmailWithDomain,
                            commonValidationRules.noLeadingTrailingWhitespace,
                            commonValidationRules.isEmailProperlyFormatted
                        ]"
                        density="compact"
                        placeholder="Email address"
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                        clearable
                        data-test="email"
                    >
                    </v-text-field>

                    <v-text-field
                        class="mb-5"
                        v-model="credentials.password"
                        :readonly="loading"
                        :rules="[
                            commonValidationRules.required,
                            commonValidationRules.minLength(8, 'Min 8 characters'),
                            commonValidationRules.minOneDigit,
                            commonValidationRules.minOneLowerCase,
                            commonValidationRules.minOneUpperCase,
                            commonValidationRules.minOneSpecialChar,
                            commonValidationRules.noLeadingTrailingWhitespace
                        ]"
                        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        density="compact"
                        placeholder="Enter your password"
                        prepend-inner-icon="mdi-lock-outline"
                        variant="outlined"
                        @click:append-inner="isPasswordVisible = !isPasswordVisible"
                        clearable
                        data-test="password"
                    >
                    </v-text-field>

                    <v-card
                        v-if="isLoginError"
                        class="mb-10 text-center"
                        color="surface-variant"
                        variant="tonal"
                        data-test="wrong-password"
                    >
                        <v-card-text class="text-medium-emphasis text-error font-weight-bold">
                            Your password is incorrect or this account doesn't exist.
                            Please verify and try to log in again!
                        </v-card-text>
                    </v-card>

                    <v-btn
                        :disabled="!form"
                        :loading="loading"
                        type="submit"
                        class="mb-8"
                        color="blue"
                        size="large"
                        variant="tonal"
                        block
                    >
                        Log In
                    </v-btn>

                    <v-divider />

                    <v-card-text class="text-center">
                        <p class="mb-1">Don't have an account?</p>
                        <RouterLink class="text-blue text-decoration-none" to="/register">
                            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                        </RouterLink>
                    </v-card-text>
                </v-form>
            </v-card>
        </v-main>
    </v-layout>
</template>

<style scoped>
    #login-container {
        background:
            linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            center / cover no-repeat url("../assets/img/eCommerce-store.png");
    }

    h1 {
        font-size: 96px;
        font-family: Poppins;
        font-weight: 300;
        line-height: 144px;
    }

    .app-logo .brand {
        font-family: Prata;
        font-size: 40px;
        font-weight: 400;
    }

    .app-logo .app {
        font-family: Poppins;
        transform: rotate(-90deg);
    }
</style>
