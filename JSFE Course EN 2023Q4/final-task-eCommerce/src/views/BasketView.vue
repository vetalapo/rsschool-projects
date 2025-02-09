<script lang="ts">
    import { useAuthStore } from "@/store";

    import {
        addProductToCart,
        getAnonymousUser,
        getMyCarts,
        removeProductFromCart,
        createCart,
        removeProductsFromCart,
        addDiscountCode
    } from "@/services/commercetoolsApi";

    import type { CustomerWithToken } from "@/types";
    import { PROMOCODES } from "@/constants";

    export default {
        data: () => ({
            authStore: useAuthStore(),
            promoCodeModel: "",
            promoCodes: PROMOCODES,
            isValidPromoCode: true,
            isPromoCodeInputFocused: false,
            notification: {
                isDisplay: false,
                message: ""
            },
            alertClearCart: false
        }),
        methods: {
            async addToCart(productId: string, quantity: number = 1): Promise<void> {
                this.notification.message = "";

                // If anonymous user, creating temporary session
                if (!this.authStore.user?.token) {
                    const anonymousUser = await getAnonymousUser();
                    this.authStore.updateUserData(anonymousUser as CustomerWithToken);
                }

                let userCart = this.authStore.user?.cart;

                if (!userCart) {
                    try {
                        const userCarts = await getMyCarts(this.authStore.user?.token?.access_token || "");

                        if (userCarts.count) {
                            userCart = userCarts.results[0];
                        } else {
                            throw new Error("CT_NO_CART_ERROR");
                        }
                    } catch (error) {
                        userCart = await createCart(this.authStore.user!.token.access_token);
                    }
                }

                try {
                    const cartResult = await addProductToCart(
                        this.authStore.user?.token?.access_token || "",
                        productId,
                        userCart!.id,
                        userCart!.version,
                        quantity
                    );

                    if (cartResult instanceof Error) {
                        throw Error(cartResult.message);
                    }

                    this.authStore.updateUserData({
                        user: this.authStore.user?.user || null,
                        cart: cartResult,
                        token: this.authStore!.user!.token
                    });
                } catch (error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }
            },
            async removeFromCart(productId: string, quantity: number = 1): Promise<void> {
                const lineItem = this.authStore.user?.cart?.lineItems.find((item) => item.productId === productId);

                if (!lineItem) {
                    return;
                }

                this.notification.message = "";

                try {
                    const cartResult = await removeProductFromCart(
                        this.authStore.user?.token?.access_token || "",
                        lineItem.id,
                        this.authStore.user?.cart!.id || "",
                        this.authStore.user?.cart!.version,
                        quantity
                    );

                    if (cartResult instanceof Error) {
                        throw Error(cartResult.message);
                    }

                    this.authStore.updateUserData({
                        user: this.authStore.user?.user || null,
                        cart: cartResult,
                        token: this.authStore!.user!.token
                    });
                } catch (error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }
            },
            clearCart() {
                this.alertClearCart = true;
            },
            async confirmClearCart(): Promise<void> {
                this.alertClearCart = false;

                if (!this.authStore.user?.cart?.lineItems || this.authStore.user?.cart?.lineItems.length === 0) {
                    return;
                }

                this.notification.message = "";

                const productsIds = this.authStore.user.cart.lineItems.map((item) => item.id);

                try {
                    const cartResult = await removeProductsFromCart(
                        this.authStore.user?.token?.access_token || "",
                        productsIds,
                        this.authStore.user?.cart!.id || "",
                        this.authStore.user?.cart!.version
                    );

                    if (cartResult instanceof Error) {
                        throw Error(cartResult.message);
                    }

                    this.authStore.updateUserData({
                        user: this.authStore.user?.user || null,
                        cart: cartResult,
                        token: this.authStore!.user!.token
                    });
                } catch (error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }
            },
            async applyPromoCode() {
                const inputCode = this.promoCodeModel.trim().toLowerCase();
                const isValid = !(inputCode.length === 0) && inputCode === "ternion24";

                this.isValidPromoCode = isValid;

                if (!isValid || (this.authStore?.user?.cart?.discountCodes?.length || 0) > 0) {
                    this.togglePromoCodeInputFocus();

                    return;
                }

                this.promoCodeModel = "";

                this.togglePromoCodeInputFocus();

                this.notification.message = "";

                try {
                    const cartResult = await addDiscountCode(
                        inputCode,
                        this.authStore.user?.token?.access_token || "",
                        this.authStore.user?.cart!.id || "",
                        this.authStore.user?.cart!.version
                    );

                    if (cartResult instanceof Error) {
                        throw Error(cartResult.message);
                    }

                    this.authStore.updateUserData({
                        user: this.authStore.user?.user || null,
                        cart: cartResult,
                        token: this.authStore!.user!.token
                    });
                } catch (error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }
            },
            togglePromoCodeInputFocus() {
                this.isPromoCodeInputFocused = true;

                setTimeout(() => this.isPromoCodeInputFocused = false, 300);
            },
            isPromoCodeExistRule() {
                return this.isValidPromoCode || "This code is invalid";
            }
        },
        computed: {
            totalCost(): number {
                return this.authStore.user?.cart?.lineItems
                    .reduce((acc, item) => acc + (item.price.value.centAmount / 100) * item.quantity, 0) || 0;
            }
        }
    };
</script>

<template>
    <v-container v-if="(authStore.user?.cart?.lineItems?.length || 0) === 0" class="empty-cart-container">
        <h1 class="pt-5 pb-15">My Shopping Cart</h1>
        <v-alert type="info" class="empty-cart-message" prominent>
            <v-icon>mdi-cart-outline</v-icon>
            Your cart is empty! <RouterLink to="products" class="white-color">Start</RouterLink> adding items to your cart to see them here.
        </v-alert>
        <v-card-text>
            <RouterLink class="text-info text-decoration-none text-h6" to="/products">
                <v-icon icon="mdi-chevron-left"></v-icon>
                <strong>Start Shopping</strong>
            </RouterLink>
        </v-card-text>
    </v-container>
    <v-container v-else fluid>
        <div class="cart-container">
            <v-card class="products-list-card ma-5">
                <div class="d-flex align-center justify-space-between pt-5 pb-5 pl-5 pr-5">
                    <h1>My Shopping Cart</h1>
                    <p>{{ authStore.user?.cart?.lineItems.length }} Items</p>
                </div>

                <v-divider></v-divider>

                <v-table>
                    <tbody>
                        <tr
                            v-for="lineItem in authStore.user?.cart?.lineItems"
                            :key="lineItem.id"
                        >
                            <td>
                                <div class="cart-avatar-section">
                                    <v-avatar
                                        size="100"
                                        class="mt-3 mb-3"
                                    >
                                        <v-img :src="lineItem.variant.images[0].url"></v-img>
                                    </v-avatar>
                                    <v-list-item
                                        :title="lineItem.name['en-GB']"
                                        :subtitle="`€ ${lineItem.price.value.centAmount / 100}`"
                                        class="d-inline-flex"
                                    ></v-list-item>
                                </div>
                            </td>
                            <td class="mt-3">
                                <div class="cart-quantity-price-section">
                                    <v-text-field
                                        id="basket-quantity-field"
                                        type="number"
                                        class="mt-6"
                                        :min="1"
                                        :max="100"
                                        :value="lineItem.quantity"
                                        control-variant="split"
                                        variant="solo"
                                        max-width="140px"
                                        hide-spin-buttons
                                        readonly
                                    >
                                        <template v-slot:prepend>
                                            <v-icon class="cursor-pointer" :disabled="lineItem.quantity <= 1" @click="removeFromCart(lineItem.productId)">mdi-minus</v-icon>
                                        </template>
                                        <template v-slot:append>
                                            <v-icon class="cursor-pointer" :disabled="lineItem.quantity >= 15" @click="addToCart(lineItem.productId)">mdi-plus</v-icon>
                                        </template>
                                    </v-text-field>
                                    <v-card-text class="cart-price-display text-h6 ml-5">
                                        € {{ `${(lineItem.totalPrice.centAmount || 0) / 100}` }}
                                    </v-card-text>
                                </div>
                            </td>
                            <td>
                                <v-btn icon="mdi-delete-outline" @click="removeFromCart(lineItem.productId, lineItem.quantity)"></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <v-divider class="pb-13"></v-divider>

                <div class="shopping-cart-bottom-controls">
                    <v-card-text>
                        <RouterLink class="text-blue-lighten-1 text-decoration-none" to="/products">
                            <v-icon icon="mdi-chevron-left"></v-icon>
                            <strong>Continue Shopping</strong>
                        </RouterLink>
                    </v-card-text>
                    <v-card-text class="text-right pr-5">
                        <p class="text-red-lighten-1 text-decoration-none cursor-pointer" @click="clearCart">
                            <strong class="mr-2">Clear Cart</strong>
                            <v-icon icon="mdi-backspace"></v-icon>
                        </p>
                    </v-card-text>
                </div>
            </v-card>
            <v-card class="order-summary-card ma-5 pa-5 w-50" max-width="400" max-height="500">
                <h2 class="pt-2 pb-6">Order Summary</h2>

                <v-divider></v-divider>

                <v-row>
                    <v-col>
                        <div class="d-flex align-center justify-space-between pt-5 pb-5">
                            <p>Items {{ authStore.user?.cart?.lineItems.length }}</p>
                            <p>€ {{ totalCost.toFixed(2) }}</p>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mb-8">
                        <h3 class="mb-3">Promo Code</h3>
                        <v-row class="mt-3">
                            <v-text-field
                                v-model="promoCodeModel"
                                :rules="[isPromoCodeExistRule]"
                                :focused="isPromoCodeInputFocused"
                                class="ml-2 mb-3"
                                placeholder="Enter your code"
                                density="compact"
                                variant="outlined"
                            ></v-text-field>
                            <v-btn
                                @click="applyPromoCode()"
                                :disabled="promoCodeModel.length === 0"
                                class="ml-1 mr-2 slight-margin-top"
                            >
                                Apply
                            </v-btn>
                        </v-row>
                        <div
                            v-if="(authStore?.user?.cart?.discountCodes?.length || 0) > 0"
                            class="d-flex align-center justify-space-between"
                        >
                            <v-list class="pt-0">
                                <v-list-item
                                    v-for="code in authStore.user?.cart?.discountCodes"
                                    :key="code.discountCode.id"
                                    :title="promoCodes[code.discountCode.id as keyof typeof promoCodes].code"
                                    :subtitle="promoCodes[code.discountCode.id as keyof typeof promoCodes].description"
                                    class="color-accent pt-0 pl-0"
                                ></v-list-item>
                            </v-list>
                            <p class="color-accent">- € {{ (totalCost - ((authStore.user?.cart?.totalPrice?.centAmount || 0) / 100)).toFixed(2) }}</p>
                        </div>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <v-row>
                    <v-col>
                        <div class="d-flex align-center justify-space-between pt-5 pb-5">
                            <h3>Total Cost</h3>
                            <p>€ {{ ((authStore.user?.cart?.totalPrice?.centAmount || 0) / 100).toFixed(2) }}</p>
                        </div>
                    </v-col>
                </v-row>
                <v-btn width="100%" color="#099a9a">Checkout</v-btn>
            </v-card>
        </div>
        <v-dialog max-width="450" v-model="alertClearCart">
            <v-card title="Clear Cart" color="warning">
                <v-alert type="warning" class="mb-8">
                    Are you sure you want to clear your shopping cart?
                </v-alert>
                <v-card-actions id="clear-cart-actions-container">
                    <v-spacer></v-spacer>
                    <v-btn @click="confirmClearCart" color="red">Yes</v-btn>
                    <v-btn @click="alertClearCart = false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style scoped>
    .empty-cart-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 1600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Poppins, sans-serif;
        text-align: center;
    }

    .empty-cart-message {
        padding: 30px;
        font-size: 1.2em;
    }

    .cart-container {
        display: flex;
        justify-content: center;
    }

    .shopping-cart-bottom-controls {
        display: flex;
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: #000000bf;
    }

    .products-list-card {
        width: 850px;
    }

    .cart-quantity-price-section {
        display: flex;
        align-items: baseline;
    }

    .white-color {
        color: white;
    }

    .color-accent {
        color: aquamarine;
    }

    .slight-margin-top {
        margin-top: 2px;
    }

    #clear-cart-actions-container {
        background-color: #000000a6;
    }

    @media (max-width: 1275px) {
        .cart-container {
            flex-direction: column;
            align-items: center;
        }
    }

    @media (max-width: 855px) {
        .products-list-card {
            width: 100%;
        }
    }

    @media (max-width: 835px) {
        .cart-quantity-price-section {
            flex-direction: column;
            height: 100% !important;
            align-items: center;
        }

        .cart-price-display {
            margin-left: 0 !important;
        }
    }

    @media (max-width: 790px) {
        .order-summary-card {
            flex-direction: column;
        }

        .cart-avatar-section {
            display: flex;
            flex-direction: column;
            height: 100% !important;
            align-items: center;
        }
    }

    @media (max-width: 670px) {
        .order-summary-card {
            width: 100% !important;
        }
    }

    @media (max-width: 600px) {
        .cart-avatar-section {
            max-width: 120px;
        }
    }
</style>
