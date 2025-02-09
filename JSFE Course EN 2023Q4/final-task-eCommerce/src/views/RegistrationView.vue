<script lang="ts">
    import type { RegisterUser, Credentials, DateOfBirthFormat } from "@/types";
    import { registerUser, isUserExistWithEmail, isUserExistCheckCache } from "@/services/commercetoolsApi";
    import { ValidationRules } from "@/utils/validationRules";
    import { useAuthStore } from "@/store";
    import { COUNTRIES } from "@/constants";
    import { formatDateOfBirth } from "@/utils/formatDateOfBirth";

    export default {
        data: () => ({
            isPasswordVisible: false,
            form: false,
            menu: false,
            dateOfBirth: null,
            registerUserModel: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                dateOfBirth: "",
                shippingAddressStreet: "",
                shippingAddressCity: "",
                shippingAddressPostCode: "",
                shippingAddressCountry: "",
                isShippingAddressDefault: true,
                billingAddressStreet: "",
                billingAddressCity: "",
                billingAddressPostCode: "",
                billingAddressCountry: "",
                isBillingAddressDefault: true
            } as RegisterUser,

            isUsingShippingAddressAsBillingAlso: true,
            loading: false,
            showErrorAlert: false,
            errorAlertMessage: "",
            commonRules: ValidationRules,
            countries: COUNTRIES,

            rules: {
                isEmailExist: async (value: string) => {
                    if (!value) {
                        return "Required";
                    }

                    return !(await isUserExistWithEmail(value)) || "There is already an existing customer with the provided email";
                }
            }
        }),
        computed: {
            computedDateFormatted(): string {
                return this.formatDate(this.dateOfBirth);
            }
        },
        methods: {
            formatDate (date: Date | null): string {
                const formattedDateOfBirth: DateOfBirthFormat = formatDateOfBirth(date);

                this.registerUserModel.dateOfBirth = formattedDateOfBirth.serviceFormat;

                return formattedDateOfBirth.uiFormat;
            },
            async onSubmit() {
                if (!this.form) {
                    return;
                }

                this.loading = true;
                this.showErrorAlert = false;

                if (this.isUsingShippingAddressAsBillingAlso) {
                    this.registerUserModel.billingAddressStreet = this.registerUserModel.shippingAddressStreet;
                    this.registerUserModel.billingAddressCity = this.registerUserModel.shippingAddressCity;
                    this.registerUserModel.billingAddressPostCode = this.registerUserModel.shippingAddressPostCode;
                    this.registerUserModel.billingAddressCountry = this.registerUserModel.shippingAddressCountry;
                    this.registerUserModel.isBillingAddressDefault = this.registerUserModel.isShippingAddressDefault;
                }

                try {
                    await registerUser(this.registerUserModel);

                    const credentials: Credentials = {
                        email: this.registerUserModel.email,
                        password: this.registerUserModel.password
                    };

                    isUserExistCheckCache[credentials.email] = true;

                    const authStore = useAuthStore();

                    try {
                        const response = await authStore.logIn(credentials);

                        if (response instanceof Error) {
                            throw new Error(response.message);
                        }

                        this.loading = false;
                    } catch {
                        setTimeout(() => {
                            this.loading = false;
                        }, 500);
                    }

                } catch(error) {
                    this.showErrorAlert = true;
                    this.errorAlertMessage = String(error);
                }

                setTimeout(() => (this.loading = false), 3000);
            }
        }
    };
</script>

<template>
    <v-layout>
        <v-main id="registration-container" class="d-sm-flex align-center justify-space-around">
            <div class="text-container d-flex flex-column align-center text-center mb-8">
                <h1 class="text-center">Join us<br>today!</h1>
                <h2 class="text-center pa-4">Sign up to get access to exclusive features and benefits.</h2>
            </div>
            <v-card class="pa-5 w-100 w-md-75 w-lg-50" elevation="8" rounded="lg">
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <div class="app-logo text-center d-sm-flex justify-center ga-3 mb-5">
                        <h2 class="brand">eCommerce</h2><span class="app">app</span>
                    </div>

                    <div v-if="isUsingShippingAddressAsBillingAlso" class="cta-form mb-5">
                        <h3 class="text-center">Sign up to get goods <br><span>you love</span></h3>
                    </div>

                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="registerUserModel.firstName"
                                :rules="[
                                    commonRules.required,
                                    commonRules.noSpecialChar,
                                    commonRules.minLength(2, 'First name must be at least 2 character long')
                                ]"
                                density="compact"
                                placeholder="First Name"
                                variant="outlined"
                                clearable
                            >
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="registerUserModel.lastName"
                                :rules="[
                                    commonRules.required,
                                    commonRules.noSpecialChar,
                                    commonRules.minLength(2, 'Last name must be at least 2 character long')
                                ]"
                                density="compact"
                                placeholder="Last Name"
                                variant="outlined"
                                clearable
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ props }">
                                    <v-text-field
                                        v-model="computedDateFormatted"
                                        prepend-inner-icon="mdi-calendar"
                                        placeholder="Day of Birth"
                                        readonly
                                        density="compact"
                                        variant="outlined"
                                        v-bind="props"
                                        :rules="[commonRules.required, commonRules.ageLimit]"
                                    >
                                    </v-text-field>
                                </template>
                                <v-date-picker v-model="dateOfBirth"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="registerUserModel.email"
                                :rules="[
                                    commonRules.required,
                                    commonRules.isProperEmail,
                                    commonRules.isEmailWithDomain,
                                    commonRules.noLeadingTrailingWhitespace,
                                    commonRules.isEmailProperlyFormatted
                                ]"
                                density="compact"
                                placeholder="Email address"
                                prepend-inner-icon="mdi-email-outline"
                                variant="outlined"
                                clearable
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="registerUserModel.password"
                                :readonly="loading"
                                :rules="[
                                    commonRules.required,
                                    commonRules.minLength(8, 'Min 8 characters'),
                                    commonRules.minOneDigit,
                                    commonRules.minOneLowerCase,
                                    commonRules.minOneUpperCase,
                                    commonRules.minOneSpecialChar,
                                    commonRules.noLeadingTrailingWhitespace
                                ]"
                                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                :type="isPasswordVisible ? 'text' : 'password'"
                                density="compact"
                                placeholder="Password"
                                prepend-inner-icon="mdi-lock-outline"
                                variant="outlined"
                                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                                clearable
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <fieldset class="pa-3 mb-5">
                        <legend>Shipping Address</legend>
                        <v-row class="mt-1">
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="registerUserModel.shippingAddressCountry"
                                    :items="countries"
                                    :item-props="true"
                                    item-title="title"
                                    item-value="code"
                                    density="compact"
                                    label="Select a country"
                                    variant="outlined"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="registerUserModel.shippingAddressCity"
                                    :rules="[
                                        commonRules.required,
                                        commonRules.noSpecialChar,
                                        commonRules.minLength(2, 'City name must be at least 2 character long')
                                    ]"
                                    density="compact"
                                    placeholder="City"
                                    variant="outlined"
                                    clearable
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="registerUserModel.shippingAddressPostCode"
                                    :rules="[commonRules.required, commonRules.zipCodeContainsFiveDigits]"
                                    density="compact"
                                    placeholder="Postal Code"
                                    variant="outlined"
                                    clearable
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-row class="mt-3">
                            <v-col cols="12">
                                <v-text-field
                                    v-model="registerUserModel.shippingAddressStreet"
                                    :rules="[
                                        commonRules.required,
                                        commonRules.minLength(2, 'Street name must be at least 2 character long')
                                    ]"
                                    density="compact"
                                    placeholder="Street"
                                    variant="outlined"
                                    clearable
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-switch
                                            v-model="registerUserModel.isShippingAddressDefault"
                                            color="primary"
                                            label="Set as default shipping address?"
                                        ></v-switch>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-switch
                                            v-model="isUsingShippingAddressAsBillingAlso"
                                            color="orange-darken-3"
                                            label="Use as billing address?"
                                        ></v-switch>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </fieldset>

                    <fieldset v-if="!isUsingShippingAddressAsBillingAlso" class="pa-3 mb-5">
                        <legend>Billing Address</legend>
                        <v-row class="mt-1">
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="registerUserModel.billingAddressCountry"
                                    :items="countries"
                                    :item-props="true"
                                    item-title="title"
                                    item-value="code"
                                    density="compact"
                                    label="Select a country"
                                    variant="outlined"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="registerUserModel.billingAddressCity"
                                    :rules="[
                                        commonRules.required,
                                        commonRules.noSpecialChar,
                                        commonRules.minLength(2, 'City name must be at least 2 character long')
                                    ]"
                                    density="compact"
                                    placeholder="City"
                                    variant="outlined"
                                    clearable
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="registerUserModel.billingAddressPostCode"
                                    :rules="[commonRules.required, commonRules.zipCodeContainsFiveDigits]"
                                    density="compact"
                                    placeholder="Postal Code"
                                    variant="outlined"
                                    clearable
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-row class="mt-3">
                            <v-col cols="12">
                                <v-text-field
                                    v-model="registerUserModel.billingAddressStreet"
                                    :rules="[
                                        commonRules.required,
                                        commonRules.minLength(2, 'Street name must be at least 2 character long')
                                    ]"
                                    density="compact"
                                    placeholder="Street"
                                    variant="outlined"
                                    clearable
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-row>
                                    <v-col cols="12">
                                        <v-switch
                                          v-model="registerUserModel.isBillingAddressDefault"
                                          color="primary"
                                          label="Set as default billing address?"
                                        ></v-switch>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </fieldset>

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
                        Create an account
                    </v-btn>

                    <v-alert
                      v-if="showErrorAlert"
                      border="top"
                      type="error"
                      variant="outlined"
                      prominent
                    >
                        {{ errorAlertMessage }}
                    </v-alert>

                    <v-divider />

                    <v-card-text class="text-center">
                        <p class="mb-1">Already have an account?</p>
                        <RouterLink class="text-blue text-decoration-none" to="/login">
                            Log in <v-icon icon="mdi-chevron-right"></v-icon>
                        </RouterLink>
                    </v-card-text>
                </v-form>
            </v-card>
        </v-main>
    </v-layout>
</template>

<style scoped>
    #registration-container {
        background:
            linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            url("../assets/img/eCommerce-registration.svg") left no-repeat,
            url("../assets/img/backgroundRegistration.png") center / cover no-repeat;
            padding: 20px;
    }

    h1 {
        font-size: 48px;
        font-family: Poppins;
        font-weight: 300;
        line-height: 72px;
    }

    h2 {
        font-size: 24px;
    }

    .app-logo .brand {
        font-family: Prata;
        font-size: 28px;
        font-weight: 400;
    }

    .app-logo .app {
        font-family: Poppins;
        transform: rotate(-90deg);
        font-size: 16px;
    }

    .cta-form h3 {
        color: #099a9a;
        font-size: 20px;
    }

    .cta-form span {
        font-weight: 300;
    }

    .text-container h2 {
        color: #099a9a;
    }

    @media (min-width: 600px) {
        h1 {
            font-size: 72px;
            line-height: 96px;
        }

        .app-logo .brand {
            font-size: 40px;
        }

        .cta-form h3 {
            font-size: 24px;
        }
    }

    @media (min-width: 960px) {
        h1 {
            font-size: 96px;
            line-height: 144px;
        }

        .app-logo .brand {
            font-size: 40px;
        }

        .cta-form h3 {
            font-size: 28px;
        }
    }
</style>
