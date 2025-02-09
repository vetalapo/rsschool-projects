<script lang="ts">
    import { getProductDetails, getMyCarts, createCart, addProductToCart, getAnonymousUser, removeProductFromCart } from "@/services/commercetoolsApi";
    import type { BreadcrumbItem, ProductSingle, CustomerWithToken } from "@/types";
    import { useAuthStore } from "@/store";

    export default {
        data: () => ({
            product: {} as ProductSingle,
            loading: true,
            overlayVisible: false,
            currentImageIndex: 0,
            authStore: useAuthStore(),
            message: "",
            messageIcon: "",
            messageColor: "",
            iconColor: "",
            notification: {
                isDisplay: false,
                message: ""
            }
        }),
        async mounted() {
            const productID = this.$route.params.id as string;

            try {
                this.product = await getProductDetails(productID);

                if (!this.product) {
                    this.$router.push("404");
                }
            }
            catch(error) {
                return console.error("Error fetching product:", error);
            } finally {
                this.loading = false;
            }
        },
        methods: {
            getPrice(currencyCode: string): string {
                const priceObj = this.product?.masterData?.current?.masterVariant?.prices?.find(
                    (elem) => elem.value.currencyCode === currencyCode
                );

                return priceObj ? (priceObj.value.centAmount / 100).toFixed(2) : "N/A";
            },
            getDiscount(): string {
                const discountPrice = this.product?.masterData?.current?.masterVariant?.prices[0]?.discounted.value.centAmount;

                return discountPrice ? (discountPrice / 100).toFixed(2) : "N/A";
            },
            showOverlay(index: number) {
                this.currentImageIndex = index;
                this.overlayVisible = true;
            },
            displayMessage(message: string, icon: string, iconColor: string) {
                this.message = message;
                this.messageIcon = icon;
                this.iconColor = iconColor;

                setTimeout(() => {
                    this.message = "";
                }, 3000);
            },
            async handleCartAction() {
                if (this.isProductInCart(this.product.id)) {
                    await this.removeFromCart(this.product.id);
                    this.displayMessage("Item removed from the cart", "mdi-close-circle", "text-red");
                } else {
                    await this.addToCart(this.product.id);
                    this.displayMessage("Item added to the cart", "mdi-check-circle", "text-green");
                }
            },
            isProductInCart(productId: string): boolean {
                return Boolean(this.authStore?.user?.token) &&
                    this.authStore.user?.cart?.lineItems.findIndex((item) => item.productId === productId) !== -1;
            },
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
            }
        },
        computed: {
            breadcrumbItems(): BreadcrumbItem[] {
                return [
                    { title: "Home", disabled: false, to:{ name: "home" } },
                    { title: "Products", disabled: false, to:{ name: "products" } },
                    { title: this.product.masterData?.current?.name["en-GB"] || "Detailed product", disabled: true, to: "" }
                ];
            },
            largeImages() {
                return this.product.masterData?.current?.masterVariant?.images.map(image => {
                    return {
                        ...image,
                        url: image.url.replace(/(\.[\w\d_-]+)$/i, "-large$1")
                    };
                }) || [];
            },
            extraLargeImages() {
                return this.product.masterData?.current?.masterVariant?.images.map(image => {
                    return {
                        ...image,
                        url: image.url.replace(/(\.[\w\d_-]+)$/i, "-zoom$1")
                    };
                }) || [];
            },
            showArrows() {
                return this.largeImages.length > 1;
            }
        }
    };
</script>

<template>
    <v-container class="wrapper-container">
        <v-row>
            <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
        </v-row>

        <v-row v-if="loading" justify="center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <v-row v-else-if="product">
            <v-col cols="12" md="6">
                <v-carousel :show-arrows="showArrows" hide-delimiters>
                    <v-carousel-item
                        v-for="(image, index) in largeImages"
                        :key="index"
                        class="carousel-item"
                        @click="showOverlay(index)"
                    >
                        <v-img :src="image.url" class="carousel-image" alt="Product Image"></v-img>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
            <v-col cols="12" md="6">
                <v-row class="justify-space-between pa-5">
                    <h2>{{ product.masterData?.current?.name["en-GB"] }}</h2>
                    <div v-if="product.masterData?.current.masterVariant.prices[0]?.discounted">
                        <h2>
                            <span class="discounted-price pr-5">€ {{ getDiscount() }}</span>
                            <span class="original-price">€ {{ getPrice("EUR") }}</span>
                        </h2>
                    </div>
                    <div v-else>
                        <h2>€ {{ getPrice("EUR") }}</h2>
                    </div>
                </v-row>
                <v-row class="pa-5">
                    <p class="pb-6">{{ product.masterData?.current?.description["en-GB"] }}</p>
                </v-row>
                <v-row class="justify-center">
                    <v-divider class="pa-5"></v-divider>
                    <v-btn 
                        size="x-large"
                        rounded="sm"
                        :prepend-icon="isProductInCart(product.id) ? 'mdi-cart-off' : 'mdi-cart-plus'"
                        :color="isProductInCart(product.id) ? '#ea7575' : '#158a8a'"
                        :text="isProductInCart(product.id) ? 'Remove from cart' : 'Add to cart'"
                        @click="handleCartAction"
                    >
                    </v-btn>
                </v-row>
                <v-row class="text-caption justify-center pa-4">
                    <transition name="fade">
                        <p v-if="message" class="text-grey">
                            <v-icon :class="iconColor">{{ messageIcon }}</v-icon>
                            {{ message }}
                        </p>
                    </transition>
                </v-row>
            </v-col>
        </v-row>

        <v-overlay
            class="overlay-content align-center justify-center"
            v-model="overlayVisible"
            opacity="1"
            scrim="rgba(0, 0, 0, 1)"
            contained
            persistent
        >
            <v-row class="overlay-wrapper" justify="center">
                <v-btn @click="overlayVisible = false" icon="$close"></v-btn>
                <v-carousel :show-arrows="showArrows" hide-delimiters>
                    <v-carousel-item
                        v-for="(image, index) in largeImages"
                        :key="index"
                        class="modal-carousel-item"
                        :src="image.url"
                    >
                        <v-img
                            :src="image.url"
                            class="overlay-image"
                            alt="Enlarged Product Image"
                            aspect-ratio="1"
                        >
                        </v-img>
                    </v-carousel-item>
                </v-carousel>
            </v-row>
        </v-overlay>
    </v-container>
</template>

<style scoped>
    .wrapper-container {
        overflow-x: hidden;
        max-width: 1600px;
        font-family: Poppins, sans-serif;
    }

    h2 {
        color: #099a9a;
    }

    p {
        font-size: large;
    }

    .carousel-item {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .carousel-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        cursor: pointer;
    }

    .discounted-price {
        font-size: 24px;
        color: #e60000;
        font-weight: bold;
    }

    .original-price {
        text-decoration: line-through;
        color: #999;
        margin-right: 10px;
        font-size: 22px;
    }

    .overlay-content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .modal-carousel-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .overlay-image {
        width: 50vw;
        height: 80vh;
        max-width: 80vw;
        max-height: 80vh;
        object-fit: contain;
        margin: auto;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
