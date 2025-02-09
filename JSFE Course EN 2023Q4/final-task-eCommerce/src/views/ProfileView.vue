<script lang="ts">
    import { mergeProps } from "vue";

    import type {
        AddressType,
        Customer,
        CustomerWithToken,
        DateOfBirthFormat,
        FullCustomerAddress,
        FullCustomerAddressModel
    } from "@/types";

    import { COUNTRIES } from "@/constants";
    import { formatDateOfBirth } from "@/utils/formatDateOfBirth";
    import { ValidationRules } from "@/utils/validationRules";
    import { useAuthStore } from "@/store";
    import { changePassword, removeAddress, updateUser } from "@/services/commercetoolsApi";

    export default {
        data: () => ({
            authStore: useAuthStore(),
            customerTabs: null,
            editGeneralDetails: {
                isDialogOpen: false,
                form: false,
                loading: false,
                isSubmitError: false,
                errorMessage: "",
                dateOfBirth: null as Date | null,
                isDateOfBirthMenuOpen: false,
                isCurrPasswordVisible: false,
                isCurrPasswordInvalid: false,
                isCurrPasswordInputFocused: false,
                isNewPasswordVisible: false,
                isOperationSuccessDisplayed: false
            },
            generalCustomerInfoModel: {
                firstName: "",
                lastName: "",
                email: "",
                dateOfBirth: "",
                currPassword: "",
                newPassword: ""
            },
            addressDetails: {
                dialogAddressDelete: false,
                dialogAddressNewOrUpdate: false,
                newOrEditForm: false,
                editAddressItem: {} as FullCustomerAddress,
                addressFormModel: {} as FullCustomerAddressModel,
                addressFormModelShadowCopy: {} as FullCustomerAddressModel,
                countries: COUNTRIES
            },
            commonValidationRules: ValidationRules,
            notification: {
                isDisplay: false,
                message: ""
            }
        }),
        methods: {
            mergeProps,
            formatBirthDate(date: string | null): string {
                if (!date) {
                    return "N/A";
                }

                return new Date(date)
                    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            },
            getColorForAddressType(addressType: string): string {
                if (addressType.includes("Default")) {
                    return "blue";
                }

                return "";
            },
            formatGeneralInfoModelDate (date: Date | null): string {
                const formattedDateOfBirth: DateOfBirthFormat = formatDateOfBirth(date);

                this.generalCustomerInfoModel.dateOfBirth = formattedDateOfBirth.serviceFormat;

                return formattedDateOfBirth.uiFormat;
            },
            diffCustomerDetailsFieldsToUpdate(): any[] {
                const diff = [];

                if (this.generalCustomerInfoModel.firstName !== (this.authStore?.user?.user?.firstName || "")) {
                    diff.push({
                        action: "setFirstName",
                        firstName: this.generalCustomerInfoModel.firstName
                    });
                }

                if (this.generalCustomerInfoModel.lastName !== (this.authStore?.user?.user?.lastName || "")) {
                    diff.push({
                        action: "setLastName",
                        lastName: this.generalCustomerInfoModel.lastName
                    });
                }

                if (this.generalCustomerInfoModel.dateOfBirth !== (this.authStore?.user?.user?.dateOfBirth || "")) {
                    diff.push({
                        action: "setDateOfBirth",
                        dateOfBirth: this.generalCustomerInfoModel.dateOfBirth
                    });
                }

                return diff;
            },
            diffCustomerEmailAndPasswordToUpdate(): any[] {
                const diff = [];

                if (this.generalCustomerInfoModel.email !== (this.authStore?.user?.user?.email || "")) {
                    diff.push({
                        action: "changeEmail",
                        email: this.generalCustomerInfoModel.email
                    });
                }

                if (this.generalCustomerInfoModel.newPassword !== (this.authStore?.user?.user?.password || "")) {
                    diff.push({
                        action: "changePassword",
                        password: this.generalCustomerInfoModel.currPassword,
                        passwordNew: this.generalCustomerInfoModel.newPassword
                    });
                }

                return diff;
            },
            onCustomerDetailsDialogOpen() {
                this.generalCustomerInfoModel.firstName = this.authStore?.user?.user?.firstName || "";
                this.generalCustomerInfoModel.lastName = this.authStore?.user?.user?.lastName || "";
                this.generalCustomerInfoModel.email = this.authStore?.user?.user?.email || "";
                this.generalCustomerInfoModel.newPassword = this.authStore?.user?.user?.password || "";
                this.generalCustomerInfoModel.currPassword = "";

                this.generalCustomerInfoModel.dateOfBirth = this.authStore?.user?.user?.dateOfBirth || "";
                this.editGeneralDetails.dateOfBirth = new Date(this.generalCustomerInfoModel.dateOfBirth);

                this.editGeneralDetails.isCurrPasswordVisible = false;
                this.editGeneralDetails.isNewPasswordVisible = false;
                this.editGeneralDetails.isNewPasswordVisible = false;

                this.editGeneralDetails.loading = false;
                this.editGeneralDetails.isSubmitError = false;

                this.editGeneralDetails.isDialogOpen = true;
            },
            onCustomerDetailsPasswordInput() {
                if (this.editGeneralDetails.isCurrPasswordInvalid) {
                    this.editGeneralDetails.isCurrPasswordInvalid = false;
                    this.editGeneralDetails.isSubmitError = false;
                    this.editGeneralDetails.errorMessage = "";
                }
            },
            displayOperationSuccess() {
                this.editGeneralDetails.isOperationSuccessDisplayed = true;

                setTimeout(() => {
                    this.editGeneralDetails.isOperationSuccessDisplayed = false;
                }, 5000);
            },
            async onCustomerDetailsFormSubmit() {
                if (!this.editGeneralDetails.form) {
                    return;
                }

                this.editGeneralDetails.loading = true;
                this.editGeneralDetails.isSubmitError = false;

                const formGeneralDetailsDiff = this.diffCustomerDetailsFieldsToUpdate();
                const formLoginAndPasswordDiff = this.diffCustomerEmailAndPasswordToUpdate();

                if (formGeneralDetailsDiff.length === 0 && formLoginAndPasswordDiff.length == 0) {
                    this.editGeneralDetails.loading = false;

                    return;
                }

                const { id, version } = this.authStore.user!.user!;
                const { cart, token} = this.authStore.user!;

                try {
                    // General details update, like First Name, Last Name, Bay of Birth
                    if (formGeneralDetailsDiff.length !== 0) {
                        const updatedUserData: Customer | Error = await updateUser(formGeneralDetailsDiff, id, token.access_token, version);

                        if (updatedUserData instanceof Error) {
                            throw new Error(updatedUserData.message);
                        }

                        this.authStore.updateUserData({ user: updatedUserData, cart: cart!, token: token });
                    }

                    // Login and password update
                    if (formLoginAndPasswordDiff.length !== 0) {
                        // See if credential are valid
                        const isValidCredentials = await this.authStore.isValidCredentials({
                            email: this.authStore.user!.user!.email,
                            password: this.generalCustomerInfoModel.currPassword
                        });

                        if (!isValidCredentials) {
                            this.editGeneralDetails.isCurrPasswordInvalid = true;
                            this.editGeneralDetails.form = false;

                            // Toggle focus
                            this.editGeneralDetails.isCurrPasswordInputFocused = true;
                            setTimeout(() => {
                                this.editGeneralDetails.isCurrPasswordInputFocused = false;
                            }, 200);

                            throw new Error("Current Password is invalid");
                        }

                        // If email up to update, update it first
                        const emailObj = formLoginAndPasswordDiff.find((item) => item.action === "changeEmail");

                        if (emailObj) {
                            const updatedUserData: Customer | Error = await updateUser(
                                [{ action: `${ emailObj.action }`, email: `${ emailObj.email }` }],
                                id,
                                token.access_token,
                                version
                            );

                            if (updatedUserData instanceof Error) {
                                throw new Error(updatedUserData.message);
                            }

                            this.authStore.updateUserData({ user: updatedUserData, cart: cart!, token: token });
                        }

                        // Next up is the password to update, if present
                        const passwordObj = formLoginAndPasswordDiff.find((item) => item.action === "changePassword");

                        if (passwordObj) {
                            const updatedUserData: CustomerWithToken | Error = await changePassword(
                                { password: `${ passwordObj.password }`, passwordNew: `${ passwordObj.passwordNew }` },
                                this.generalCustomerInfoModel.email,
                                id,
                                token.access_token,
                                version
                            );

                            if (updatedUserData instanceof Error) {
                                throw new Error(updatedUserData.message);
                            }

                            this.authStore.updateUserData(updatedUserData);
                        }
                    }

                    this.editGeneralDetails.loading = false;
                    this.displayOperationSuccess();
                }
                catch (error) {
                    this.editGeneralDetails.isSubmitError = true;
                    this.editGeneralDetails.errorMessage = String(error);

                    setTimeout(() => {
                        this.editGeneralDetails.loading = false;
                    }, 500);
                }
            },
            onShippingAddressChange() {
                if (!this.addressDetails.addressFormModel.isShipping && this.addressDetails.addressFormModel.isShippingAddressDefault ) {
                    this.addressDetails.addressFormModel.isShippingAddressDefault = false;
                }
            },
            onBillingAddressChange() {
                if (!this.addressDetails.addressFormModel.isBilling && this.addressDetails.addressFormModel.isBillingAddressDefault ) {
                    this.addressDetails.addressFormModel.isBillingAddressDefault = false;
                }
            },
            onDefaultShippingAddressChange() {
                if (this.addressDetails.addressFormModel.isShippingAddressDefault && !this.addressDetails.addressFormModel.isShipping ) {
                    this.addressDetails.addressFormModel.isShipping = true;
                }
            },
            onDefaultBillingAddressChange() {
                if (this.addressDetails.addressFormModel.isBillingAddressDefault && !this.addressDetails.addressFormModel.isBilling ) {
                    this.addressDetails.addressFormModel.isBilling = true;
                }
            },
            editAddressItem(item: FullCustomerAddress) {
                this.addressDetails.editAddressItem = item;
                this.notification.message = "";

                this.addressDetails.addressFormModel = {} as FullCustomerAddressModel;
                this.addressDetails.addressFormModelShadowCopy = {} as FullCustomerAddressModel;
                const addressInfo = this.getAddressTypeAndIfDefault(item.id);

                this.addressDetails.addressFormModel = { ...item, ...addressInfo } as FullCustomerAddressModel;
                this.addressDetails.addressFormModelShadowCopy = { ...this.addressDetails.addressFormModel } as FullCustomerAddressModel;

                if (!this.addressDetails.addressFormModel.firstName) {
                    this.addressDetails.addressFormModel.firstName = this.authStore.user?.user?.firstName || "";
                }

                if (!this.addressDetails.addressFormModel.lastName) {
                    this.addressDetails.addressFormModel.lastName = this.authStore.user?.user?.lastName || "";
                }

                this.addressDetails.dialogAddressNewOrUpdate = true;
            },
            newAddressItem() {
                this.addressDetails.editAddressItem = {} as FullCustomerAddress;
                this.notification.message = "";

                this.addressDetails.addressFormModel = {} as FullCustomerAddressModel;
                this.addressDetails.addressFormModelShadowCopy = {} as FullCustomerAddressModel;

                this.addressDetails.addressFormModel.firstName = this.authStore?.user?.user?.firstName || "";
                this.addressDetails.addressFormModel.lastName = this.authStore?.user?.user?.lastName || "";
                this.addressDetails.addressFormModel.id = "";
                this.addressDetails.addressFormModel.city = "";
                this.addressDetails.addressFormModel.country = "";
                this.addressDetails.addressFormModel.postalCode = "";
                this.addressDetails.addressFormModel.state = "";
                this.addressDetails.addressFormModel.streetName = "";
                this.addressDetails.addressFormModel.streetNumber = "";
                this.addressDetails.addressFormModel.isShipping = false;
                this.addressDetails.addressFormModel.isShippingAddressDefault = false;
                this.addressDetails.addressFormModel.isBilling = false;
                this.addressDetails.addressFormModel.isBillingAddressDefault = false;

                this.addressDetails.addressFormModelShadowCopy = { ...this.addressDetails.addressFormModel } as FullCustomerAddressModel;

                this.addressDetails.newOrEditForm = false;
                this.addressDetails.dialogAddressNewOrUpdate = true;
            },
            closeAddressItemDialog() {
                this.addressDetails.editAddressItem = {} as FullCustomerAddress;
                this.addressDetails.addressFormModel = {} as FullCustomerAddressModel;
                this.addressDetails.addressFormModelShadowCopy = {} as FullCustomerAddressModel;

                this.addressDetails.dialogAddressNewOrUpdate = false;
            },
            async editAddressItemConfirmSave() {
                let { id, version } = this.authStore.user!.user!;
                const { cart, token} = this.authStore.user!;

                try {
                    let actions = [];

                    if (this.computedIsAddressDataChanged) {
                        if (this.addressDetails.addressFormModel.id) {
                            actions.push({
                                action: "changeAddress",
                                addressId: this.addressDetails.addressFormModel.id,
                                address: { ...this.addressDetails.addressFormModel } as FullCustomerAddress
                            });
                        } else {
                            actions.push({
                                action: "addAddress",
                                address: { ...this.addressDetails.addressFormModel } as FullCustomerAddress
                            });
                        }
                    }

                    if (this.computedIsAddressBillingAndDeFaultDataChanged && this.addressDetails.addressFormModel.id === "") {
                        const updatedUserData: Customer | Error = await updateUser(
                            actions,
                            id,
                            token.access_token,
                            version
                        );

                        if (updatedUserData instanceof Error) {
                            throw new Error(updatedUserData.message);
                        }

                        this.authStore.updateUserData({ user: updatedUserData! as Customer, cart: cart!, token: token });

                        actions = [];
                        version = updatedUserData.version;
                        this.addressDetails.addressFormModel.id = updatedUserData.addresses[updatedUserData.addresses.length - 1].id || "";
                    }

                    if (this.computedIsAddressBillingAndDeFaultDataChanged) {
                        // TODO: Make builders out of these ifs
                        // Shipping
                        if (this.addressDetails.addressFormModel.isShipping &&
                            this.addressDetails.addressFormModel.isShipping !== this.addressDetails.addressFormModelShadowCopy.isShipping
                        ) {
                            actions.push({
                                action: "addShippingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        } else if (!this.addressDetails.addressFormModel.isShipping &&
                                    this.addressDetails.addressFormModel.isShipping !== this.addressDetails.addressFormModelShadowCopy.isShipping
                        ) {
                            actions.push({
                                action: "removeShippingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        }

                        // Shipping Default
                        if (this.addressDetails.addressFormModel.isShippingAddressDefault &&
                            this.addressDetails.addressFormModel.isShippingAddressDefault !== this.addressDetails.addressFormModelShadowCopy.isShippingAddressDefault
                        ) {
                            actions.push({
                                action: "setDefaultShippingAddress",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        } else if (!this.addressDetails.addressFormModel.isShippingAddressDefault &&
                                    this.addressDetails.addressFormModel.isShippingAddressDefault !== this.addressDetails.addressFormModelShadowCopy.isShippingAddressDefault
                        ) {
                            actions.push({
                                action: "removeShippingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });

                            actions.push({
                                action: "addShippingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        }

                        // Billing
                        if (this.addressDetails.addressFormModel.isBilling &&
                            this.addressDetails.addressFormModel.isBilling !== this.addressDetails.addressFormModelShadowCopy.isBilling
                        ) {
                            actions.push({
                                action: "addBillingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        } else if (!this.addressDetails.addressFormModel.isBilling &&
                                    this.addressDetails.addressFormModel.isBilling !== this.addressDetails.addressFormModelShadowCopy.isBilling
                        ) {
                            actions.push({
                                action: "removeBillingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        }

                        // Billing Default
                        if (this.addressDetails.addressFormModel.isBillingAddressDefault &&
                            this.addressDetails.addressFormModel.isBillingAddressDefault !== this.addressDetails.addressFormModelShadowCopy.isBillingAddressDefault
                        ) {
                            actions.push({
                                action: "setDefaultBillingAddress",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        } else if (!this.addressDetails.addressFormModel.isBillingAddressDefault &&
                                    this.addressDetails.addressFormModel.isBillingAddressDefault !== this.addressDetails.addressFormModelShadowCopy.isBillingAddressDefault
                        ) {
                            actions.push({
                                action: "removeBillingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });

                            actions.push({
                                action: "addBillingAddressId",
                                addressId: this.addressDetails.addressFormModel.id,
                            });
                        }
                    }

                    const updatedUserData: Customer | Error = await updateUser(
                            actions,
                            id,
                            token.access_token,
                            version
                        );

                    if (updatedUserData instanceof Error) {
                        throw new Error(updatedUserData.message);
                    }

                    this.authStore.updateUserData({ user: updatedUserData! as Customer, cart: cart!, token: token });
                } catch(error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;

                    return;
                }

                this.closeAddressItemDialog();
            },
            deleteAddressItem(item: FullCustomerAddress) {
                this.notification.message = "";
                this.addressDetails.editAddressItem = item;
                this.addressDetails.dialogAddressDelete = true;
            },
            closeAddressDeleteDialog() {
                this.addressDetails.editAddressItem = {} as FullCustomerAddress;;
                this.addressDetails.dialogAddressDelete = false;
            },
            async deleteAddressItemConfirm() {
                const { id, version } = this.authStore.user!.user!;
                const { cart, token} = this.authStore.user!;

                try {
                    const updatedUserData: Customer | Error = await removeAddress(
                        this.addressDetails.editAddressItem!.id,
                        id,
                        token.access_token,
                        version
                    );

                    if (updatedUserData instanceof Error) {
                        throw new Error(updatedUserData.message);
                    }

                    this.authStore.updateUserData({ user: updatedUserData, cart: cart!, token: token });
                } catch(error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }

                this.addressDetails.editAddressItem = {} as FullCustomerAddress;
                this.addressDetails.dialogAddressDelete = false;
            },
            getAddressTypeAndIfDefault(addressId: string): AddressType {
                return {
                    isShipping: this.authStore?.user?.user?.shippingAddressIds.includes(addressId),
                    isShippingAddressDefault: this.authStore?.user?.user?.defaultShippingAddressId === addressId,
                    isBilling: this.authStore?.user?.user?.billingAddressIds.includes(addressId),
                    isBillingAddressDefault: this.authStore?.user?.user?.defaultBillingAddressId === addressId
                } as AddressType;
            }
        },
        computed: {
            customerAddressesTableHeaders(): Object[] {
                return [
                    {
                        title: "Contact Name",
                        key: "contactName",
                        value: (item: FullCustomerAddress) =>
                            `${ item.firstName || this.authStore.user?.user?.firstName } ${ item.lastName || this.authStore.user?.user?.lastName }`
                    },
                    {
                        title: "Country",
                        key: "country",
                        value: (item: FullCustomerAddress) => {
                            const country = COUNTRIES.find((c) => c.code == item.country);

                            if (!country) {
                                return item.country;
                            }

                            return country.title;
                        }
                    },
                    {
                        title: "City",
                        key: "city",
                        value: (item: FullCustomerAddress) =>
                            `${ item.city || "" }${ item.state ? "," : "" } ${ item.state || "" }`
                    },
                    {
                        title: "Address",
                        key: "address",
                        value: (item: FullCustomerAddress) =>
                            `${ item.streetName } ${ item.streetNumber || "" }`
                    },
                    { title: "Postal Code", value: "postalCode" },
                    {
                        title: "Address Type",
                        key: "addressType",
                        value: (item: FullCustomerAddress): string[] => {
                            const result: string[] = [];

                            const isShippingAddress = this.authStore?.user?.user?.shippingAddressIds.includes(item.id);
                            const isShippingAddressDefault = this.authStore?.user?.user?.defaultShippingAddressId === item.id;

                            if (isShippingAddress) {
                                result.push(`Shipping ${ isShippingAddressDefault ? "(Default)" : "" }`);
                            }

                            const isBillingAddress = this.authStore?.user?.user?.billingAddressIds.includes(item.id);
                            const isBillingAddressDefault = this.authStore?.user?.user?.defaultBillingAddressId === item.id;

                            if (isBillingAddress) {
                                result.push(`Billing ${ isBillingAddressDefault ? "(Default)" : "" }`);
                            }

                            return result;
                        }
                    },
                    {
                        title: "Actions",
                        key: "actions",
                        sortable: false
                    }
                ];
            },
            computedGeneralInfoModelDateFormatted(): string {
                return this.formatGeneralInfoModelDate(this.editGeneralDetails.dateOfBirth);
            },
            computedIsNewPasswordRequired(): boolean {
                return this.generalCustomerInfoModel.newPassword !== this.authStore!.user!.user!.password;
            },
            computedIsCustomerGeneralDataChanged(): boolean {
                return this.generalCustomerInfoModel.firstName   !== this.authStore!.user!.user!.firstName   ||
                       this.generalCustomerInfoModel.lastName    !== this.authStore!.user!.user!.lastName    ||
                       this.generalCustomerInfoModel.dateOfBirth !== this.authStore!.user!.user!.dateOfBirth ||
                       this.generalCustomerInfoModel.email       !== this.authStore!.user!.user!.email       ||
                       this.generalCustomerInfoModel.newPassword !== this.authStore!.user!.user!.password;
            },
            computedIsAddressDataChanged(): boolean {
                return this.addressDetails.addressFormModel.id           !== this.addressDetails.addressFormModelShadowCopy.id           ||
                       this.addressDetails.addressFormModel.firstName    !== this.addressDetails.addressFormModelShadowCopy.firstName    ||
                       this.addressDetails.addressFormModel.lastName     !== this.addressDetails.addressFormModelShadowCopy.lastName     ||
                       this.addressDetails.addressFormModel.city         !== this.addressDetails.addressFormModelShadowCopy.city         ||
                       this.addressDetails.addressFormModel.country      !== this.addressDetails.addressFormModelShadowCopy.country      ||
                       this.addressDetails.addressFormModel.postalCode   !== this.addressDetails.addressFormModelShadowCopy.postalCode   ||
                       this.addressDetails.addressFormModel.state        !== this.addressDetails.addressFormModelShadowCopy.state        ||
                       this.addressDetails.addressFormModel.streetName   !== this.addressDetails.addressFormModelShadowCopy.streetName   ||
                       this.addressDetails.addressFormModel.streetNumber !== this.addressDetails.addressFormModelShadowCopy.streetNumber;
            },
            computedIsAddressBillingAndDeFaultDataChanged(): boolean {
                return this.addressDetails.addressFormModel.isShipping       !== this.addressDetails.addressFormModelShadowCopy.isShipping       ||
                       this.addressDetails.addressFormModel.isShippingAddressDefault !== this.addressDetails.addressFormModelShadowCopy.isShippingAddressDefault ||
                       this.addressDetails.addressFormModel.isBilling        !== this.addressDetails.addressFormModelShadowCopy.isBilling        ||
                       this.addressDetails.addressFormModel.isBillingAddressDefault !== this.addressDetails.addressFormModelShadowCopy.isBillingAddressDefault;
            },
            computedEditAddressFormTitle(): string {
                return this.addressDetails.editAddressItem?.id ? "Edit Address" : "Add Address";
            }
        }
    };
</script>

<template>
    <v-container class="container" fluid>
        <v-row>
            <v-col>
                <v-sheet rounded="lg">
                    <v-row>
                        <v-col cols="1" class="customer-avatar-column">
                            <v-card
                                min-width="200"
                                min-height="200"
                                flat
                            >
                                <v-avatar
                                    class="mx-auto customer-avatar"
                                    color="grey-darken-3"
                                    size="200"
                                    rounded="0"
                                >
                                    <img
                                        height="100%"
                                        min-width="200"
                                        alt="Default profile image"
                                        src="@/assets/img/default-avatar.svg"
                                    >
                                </v-avatar>
                            </v-card>
                        </v-col>

                        <v-col>
                            <h2 class="text-h4 font-weight-black">{{ authStore?.user?.user?.firstName }} {{ authStore?.user?.user?.lastName }}</h2>
                            <p
                                v-if="authStore?.user?.user?.dateOfBirth"
                                class="text-h6"
                            >
                                <v-icon icon="mdi-cake-layered"></v-icon>
                                <span class="birthday-text ml-2">Cake Day: {{ formatBirthDate(authStore?.user?.user?.dateOfBirth) }}</span>
                            </p>
                        </v-col>

                        <v-btn
                            @click="onCustomerDetailsDialogOpen()"
                            class="text-none font-weight-regular mt-3 mr-3"
                            prepend-icon="mdi-account"
                            variant="tonal"
                            text="Edit Profile"
                        ></v-btn>

                        <v-dialog
                            v-model="editGeneralDetails.isDialogOpen"
                            max-width="600"
                        >
                            <v-form v-model="editGeneralDetails.form" @submit.prevent="onCustomerDetailsFormSubmit">
                                <v-card
                                    prepend-icon="mdi-account"
                                    title="User Profile"
                                >
                                    <v-card-text>
                                        <v-row dense>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.firstName"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        commonValidationRules.noSpecialChar,
                                                        commonValidationRules.minLength(2, 'First name must be at least 2 character long')
                                                    ]"
                                                    label="First name"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.lastName"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        commonValidationRules.noSpecialChar,
                                                        commonValidationRules.minLength(2, 'Last name must be at least 2 character long')
                                                    ]"
                                                    label="Last name"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="4" sm="6">
                                                <v-menu
                                                    v-model="editGeneralDetails.isDateOfBirthMenuOpen"
                                                    :close-on-content-click="false"
                                                    transition="scale-transition"
                                                >
                                                    <template v-slot:activator="{ props }">
                                                        <v-text-field
                                                            v-model="computedGeneralInfoModelDateFormatted"
                                                            v-bind="props"
                                                            :rules="[commonValidationRules.required, commonValidationRules.ageLimit]"
                                                            label="Day of Birth"
                                                            readonly
                                                        >
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="editGeneralDetails.dateOfBirth"></v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </v-row>

                                        <v-row dense>
                                            <v-col cols="8" md="8" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.email"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.isProperEmail,
                                                        commonValidationRules.isEmailWithDomain,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        commonValidationRules.isEmailProperlyFormatted
                                                    ]"
                                                    label="Email"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>

                                            <v-col cols="4" md="4" sm="6">
                                                <v-text-field
                                                    v-model="generalCustomerInfoModel.newPassword"
                                                    :rules="computedIsNewPasswordRequired ? [
                                                        commonValidationRules.required,
                                                        commonValidationRules.minLength(8, 'Min 8 characters'),
                                                        commonValidationRules.minOneDigit,
                                                        commonValidationRules.minOneLowerCase,
                                                        commonValidationRules.minOneUpperCase,
                                                        commonValidationRules.minOneSpecialChar,
                                                        commonValidationRules.noLeadingTrailingWhitespace
                                                    ] : []"
                                                    label="Password"
                                                    :append-inner-icon="editGeneralDetails.isNewPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    :type="editGeneralDetails.isNewPasswordVisible ? 'text' : 'password'"
                                                    @click:append-inner="editGeneralDetails.isNewPasswordVisible = !editGeneralDetails.isNewPasswordVisible"
                                                    required
                                                    clearable
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>

                                        <v-row dense>
                                            <v-col cols="12" md="8" sm="6">
                                                <v-text-field
                                                    v-if="diffCustomerEmailAndPasswordToUpdate().length > 0"
                                                    v-model="generalCustomerInfoModel.currPassword"
                                                    :rules="[
                                                        commonValidationRules.required,
                                                        commonValidationRules.minLength(8, 'Min 8 characters'),
                                                        commonValidationRules.minOneDigit,
                                                        commonValidationRules.minOneLowerCase,
                                                        commonValidationRules.minOneUpperCase,
                                                        commonValidationRules.minOneSpecialChar,
                                                        commonValidationRules.noLeadingTrailingWhitespace,
                                                        () => !editGeneralDetails.isCurrPasswordInvalid || 'Provided Password is invalid'
                                                    ]"
                                                    :append-inner-icon="editGeneralDetails.isCurrPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    :type="editGeneralDetails.isCurrPasswordVisible ? 'text' : 'password'"
                                                    :focused="editGeneralDetails.isCurrPasswordInputFocused"
                                                    hint="Required if you want to change the e-mail address or specify a new password"
                                                    @click:append-inner="editGeneralDetails.isCurrPasswordVisible = !editGeneralDetails.isCurrPasswordVisible"
                                                    @keyup="onCustomerDetailsPasswordInput"
                                                    label="Current Password"
                                                    persistent-hint
                                                    required
                                                    clearable
                                                >
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>

                                    <v-divider v-if="editGeneralDetails.isSubmitError"></v-divider>

                                    <v-card
                                        v-if="editGeneralDetails.isSubmitError"
                                        class="mb-10 text-center"
                                        color="surface-variant"
                                        variant="tonal"
                                    >
                                        <v-card-text class="text-medium-emphasis text-error font-weight-bold">
                                            <h1>Unable to submit form</h1>
                                            <p>The information you entered is incomplete or invalid.</p>
                                            <br>
                                            <p v-if="editGeneralDetails.errorMessage">For geeks, {{ editGeneralDetails.errorMessage }}</p>
                                        </v-card-text>
                                    </v-card>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-chip
                                            v-if="editGeneralDetails.isOperationSuccessDisplayed"
                                            color="teal"
                                            class="float-start"
                                            prepend-icon="mdi-checkbox-marked-circle"
                                        >
                                            Saved Successfully
                                        </v-chip>

                                        <v-spacer></v-spacer>

                                        <v-btn
                                            text="Close"
                                            variant="plain"
                                            @click="editGeneralDetails.isDialogOpen = false"
                                        ></v-btn>

                                        <v-btn
                                            :disabled="!computedIsCustomerGeneralDataChanged || !editGeneralDetails.form"
                                            :loading="editGeneralDetails.loading"
                                            type="submit"
                                            color="primary"
                                            text="Save"
                                            variant="tonal"
                                        ></v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-dialog>
                    </v-row>
                </v-sheet>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-sheet
                    min-height="50vh"
                    rounded="lg"
                >
                    <v-tabs
                        v-model="customerTabs"
                        color="white"
                        slider-color="#f78166"
                        align-tabs="center"
                    >
                        <v-tab value="addresses">Addresses</v-tab>
                        <v-tab value="orders">Orders</v-tab>
                    </v-tabs>
                    <v-tabs-window v-model="customerTabs">
                        <v-tabs-window-item value="addresses">
                            <v-card class="ma-3" elevation="24">
                                <v-data-table
                                    :headers="customerAddressesTableHeaders"
                                    :items="authStore?.user?.user?.addresses"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.addressType`]="{ value }">
                                        <v-chip
                                            v-for="(item, i) in value"
                                            :key="i"
                                            :color="getColorForAddressType(item)"
                                            class="ma-1"
                                        >
                                            {{ item  }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-icon
                                            class="me-2"
                                            size="small"
                                            @click="editAddressItem(item as FullCustomerAddress)"
                                        >
                                            mdi-pencil
                                        </v-icon>
                                        <v-icon
                                            size="small"
                                            @click="deleteAddressItem(item as FullCustomerAddress)"
                                        >
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                </v-data-table>
                                <v-dialog v-model="addressDetails.dialogAddressNewOrUpdate" max-width="800px">
                                    <v-form v-model="addressDetails.newOrEditForm" @submit.prevent="editAddressItemConfirmSave">
                                        <v-card>
                                            <v-card-title>
                                                <span class="text-h5">{{ computedEditAddressFormTitle }}</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-container>
                                                    <fieldset class="mb-4">
                                                        <legend>Contact Name</legend>
                                                        <v-row>
                                                            <v-col cols="12" md="6">
                                                                <v-text-field
                                                                    v-model="addressDetails.addressFormModel.firstName"
                                                                    :rules="[
                                                                        commonValidationRules.required,
                                                                        commonValidationRules.noSpecialChar,
                                                                        commonValidationRules.minLength(2, 'First name must be at least 2 character long')
                                                                    ]"
                                                                    label="First Name *"
                                                                    required
                                                                    clearable
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                                <v-text-field
                                                                    v-model="addressDetails.addressFormModel.lastName"
                                                                    :rules="[
                                                                        commonValidationRules.required,
                                                                        commonValidationRules.noSpecialChar,
                                                                        commonValidationRules.minLength(2, 'Last name must be at least 2 character long')
                                                                    ]"
                                                                    label="Last Name *"
                                                                    required
                                                                    clearable
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </fieldset>

                                                    <v-row>
                                                        <v-col cols="12" md="4">
                                                            <v-select
                                                                v-model="addressDetails.addressFormModel.country"
                                                                :items="addressDetails.countries"
                                                                :item-props="true"
                                                                :rules="[
                                                                    commonValidationRules.required
                                                                ]"
                                                                item-value="code"
                                                                density="compact"
                                                                label="Select a country *"
                                                                variant="outlined"
                                                                required
                                                            >
                                                            </v-select>
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <v-text-field
                                                                v-model="addressDetails.addressFormModel.state"
                                                                density="compact"
                                                                label="State"
                                                                variant="outlined"
                                                                clearable
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <v-text-field
                                                                v-model="addressDetails.addressFormModel.postalCode"
                                                                :rules="[commonValidationRules.required, commonValidationRules.zipCodeContainsFiveDigits]"
                                                                density="compact"
                                                                label="Zip Code *"
                                                                variant="outlined"
                                                                required
                                                                clearable
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>

                                                    <v-row>
                                                        <v-col cols="12" md="4">
                                                            <v-text-field
                                                                v-model="addressDetails.addressFormModel.city"
                                                                :rules="[
                                                                    commonValidationRules.required,
                                                                    commonValidationRules.noSpecialChar,
                                                                    commonValidationRules.minLength(2, 'City name must be at least 2 character long')
                                                                ]"
                                                                density="compact"
                                                                label="City *"
                                                                variant="outlined"
                                                                required
                                                                clearable
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <v-text-field
                                                                v-model="addressDetails.addressFormModel.streetName"
                                                                :rules="[
                                                                    commonValidationRules.required,
                                                                    commonValidationRules.minLength(2, 'Street name must be at least 2 character long')
                                                                ]"
                                                                density="compact"
                                                                label="Street *"
                                                                variant="outlined"
                                                                required
                                                                clearable
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <v-text-field
                                                                v-model="addressDetails.addressFormModel.streetNumber"
                                                                density="compact"
                                                                label="Street Number"
                                                                variant="outlined"
                                                                clearable
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>

                                                    <v-row>
                                                        <v-col cols="12" md="6">
                                                            <v-switch
                                                                v-model="addressDetails.addressFormModel.isShipping"
                                                                density="compact"
                                                                color="primary"
                                                                label="Set as SHIPPING address?"
                                                                @change="onShippingAddressChange"
                                                            ></v-switch>
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-switch
                                                                v-model="addressDetails.addressFormModel.isBilling"
                                                                density="compact"
                                                                color="primary"
                                                                label="Set as BILLING address?"
                                                                @change="onBillingAddressChange"
                                                            ></v-switch>
                                                        </v-col>
                                                    </v-row>

                                                    <v-row>
                                                        <v-col cols="12" md="6">
                                                            <v-switch
                                                                v-model="addressDetails.addressFormModel.isShippingAddressDefault"
                                                                density="compact"
                                                                color="primary"
                                                                label="Set as SHIPPING DEFAULT address?"
                                                                @change="onDefaultShippingAddressChange"
                                                            ></v-switch>
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-switch
                                                                v-model="addressDetails.addressFormModel.isBillingAddressDefault"
                                                                density="compact"
                                                                color="primary"
                                                                label="Set as BILLING DEFAULT address?"
                                                                @change="onDefaultBillingAddressChange"
                                                            ></v-switch>
                                                        </v-col>
                                                    </v-row>

                                                    <small class="text-caption text-medium-emphasis">*indicates required field</small>
                                                </v-container>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="blue-darken-1"
                                                    variant="text"
                                                    @click="closeAddressItemDialog"
                                                >
                                                    Cancel
                                                </v-btn>
                                                <v-btn
                                                    :disabled="!(computedIsAddressDataChanged || computedIsAddressBillingAndDeFaultDataChanged) || !addressDetails.newOrEditForm"
                                                    color="blue-darken-1"
                                                    variant="text"
                                                    type="submit"
                                                >
                                                    Save
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-form>
                                </v-dialog>
                                <v-dialog v-model="addressDetails.dialogAddressDelete" class="text-center" max-width="600px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this address?</v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="green-darken-1" variant="text" @click="closeAddressDeleteDialog">Cancel</v-btn>
                                            <v-btn color="red-darken-1" variant="text" @click="deleteAddressItemConfirm">Delete</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-card>
                            <v-btn
                                elevation="10"
                                size="large"
                                class="ma-3 float-right"
                                color="#36393f"
                                append-icon="mdi-plus-box"
                                @click="newAddressItem"
                            >
                                Add Address
                            </v-btn>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="orders">
                            <v-card>
                                <v-card-text>This feature is coming in the next release</v-card-text>
                            </v-card>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-sheet>
            </v-col>
        </v-row>
        <v-snackbar v-model="notification.isDisplay" multi-line>
            {{ notification.message }}

            <template v-slot:actions>
                <v-btn
                    color="red"
                    variant="text"
                    @click="notification.isDisplay = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<style scoped>
    .container {
        max-width: 1600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Poppins, sans-serif;
    }

    .v-row {
        margin: 0;
    }

    .customer-avatar-column {
        display: inline-table;
    }

    .customer-avatar {
        border-radius: 5% !important;
    }

    .birthday-text {
        position: relative;
        bottom: -8px;
    }
</style>
