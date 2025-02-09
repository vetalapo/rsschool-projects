<script lang="ts">
    import { useAuthStore } from "@/store";

    import {
        getProducts,
        getCategories,
        getMyCarts,
        createCart,
        addProductToCart,
        getAnonymousUser,
        removeProductFromCart
    } from "@/services/commercetoolsApi";

    import type { ProductAllData, ProductApiResponse, SelectOption, Category, CustomerWithToken } from "@/types";
    import { PRODUCTS_ON_PAGE } from "@/constants";

    export default {
        data: () => ({
            authStore: useAuthStore(),
            products: [] as ProductAllData[],
            productsCurrentPage: 1,
            productsTotalPages: 0,
            categories: [] as Category[],
            selectedCategory: null as Category | null,
            isLoading: false,
            errorMessage: null as string | null,
            filters: {
                minPrice: null as number | null,
                maxPrice: null as number | null,
                sortBy: "price_desc"
            },
            allowedFilters: new Set(["minPrice", "maxPrice", "brand", "color", "size", "sortBy"]),
            searchQuery: "",
            brands: [] as string[],
            colors: [] as string[],
            sizes: [] as string[],
            sortOptions: [
                { title: "Price - Low to High", value: "price_asc" },
                { title: "Price - High to Low", value: "price_desc" },
                { title: "Name - A to Z", value: "name_asc" },
                { title: "Name - Z to A", value: "name_desc" }
            ] as SelectOption[],
            sortedProducts: [] as ProductAllData[],
            hoveredCategory: null as number | null,
            notification: {
                isDisplay: false,
                message: ""
            }
        }),
        async mounted() {
            this.isLoading = true;

            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    getProducts(undefined, this.productsCurrentPage - 1),
                    getCategories()
                ]);

                this.products = productsResponse.results;
                this.productsTotalPages = Math.ceil(productsResponse.total / PRODUCTS_ON_PAGE);
                this.categories = categoriesResponse;

                const brandSet = new Set<string>();
                const colorSet = new Set<string>();
                const sizeSet = new Set<string>();

                this.products.forEach((product) => {
                    const brand = product.masterVariant.attributes.find(
                        (attr) => attr.name === "brand"
                    )?.value.key;

                    const color = product.masterVariant.attributes.find(
                        (attr) => attr.name === "color"
                    )?.value.key;

                    const size = product.masterVariant.attributes.find(
                        (attr) => attr.name === "size"
                    )?.value.key;

                    if (brand) {
                        brandSet.add(brand);
                    }

                    if (color) {
                        colorSet.add(color);
                    }

                    if (size) {
                        sizeSet.add(size);
                    }
                });

                this.brands = Array.from(brandSet);
                this.colors = Array.from(colorSet);
                this.sizes = Array.from(sizeSet);
            } catch (err) {
                this.errorMessage = "Failed to fetch products";
            } finally {
                this.isLoading = false;
            }
        },
        computed: {
            filteredProducts(): ProductAllData[] {
                const { minPrice, maxPrice, sortBy } = this.filters;
                const selectedCategoryId = this.selectedCategory?.id;

                return this.products
                    .filter((product) => {
                        const price = product.masterVariant.prices[0].value.centAmount;

                        const matchesSearchQuery = product.description?.["en-GB"]?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) || "";

                        return (
                            (!selectedCategoryId || product.categories.some((category: string | Category) => {
                                if (typeof category === "string") {
                                    return category === selectedCategoryId.toString();
                                }

                                return category.id.toString() === String(selectedCategoryId);
                            })) &&
                            (!minPrice || price >= minPrice * 100) &&
                            (!maxPrice || price <= maxPrice * 100) &&
                            matchesSearchQuery
                        );
                    })
                    .sort((a, b) => {
                        const priceA = a.masterVariant.prices[0].value.centAmount;
                        const priceB = b.masterVariant.prices[0].value.centAmount;
                        const nameA = a.name && a.name["en-GB"] ? a.name["en-GB"].toLowerCase() : "";
                        const nameB = b.name && b.name["en-GB"] ? b.name["en-GB"].toLowerCase() : "";

                        switch (sortBy) {
                            case "price_asc":
                                return priceA - priceB;
                            case "price_desc":
                                return priceB - priceA;
                            case "name_asc":
                                return nameA.localeCompare(nameB);
                            case "name_desc":
                                return nameB.localeCompare(nameA);
                            default:
                                return 0;
                        }
                    });
            }
        },
        methods: {
            updateFilters(key: string, value: string | number | null) {
                if (this.allowedFilters.has(key)) {
                    (this.filters as Record<string, string | number | null>)[key] = value;
                }
            },
            extractAttributes() {
                const brandSet = new Set<string>();
                const colorSet = new Set<string>();
                const sizeSet = new Set<string>();

                this.products.forEach((product) => {
                    const brand = product.masterVariant.attributes.find(attr => attr.name === "brand")?.value.key;
                    const color = product.masterVariant.attributes.find(attr => attr.name === "color")?.value.key;
                    const size = product.masterVariant.attributes.find(attr => attr.name === "size")?.value.key;

                    if (brand) {
                        brandSet.add(brand);
                    }

                    if (color) {
                        colorSet.add(color);
                    }

                    if (size) {
                        sizeSet.add(size);
                    }
                });

                this.brands = Array.from(brandSet);
                this.colors = Array.from(colorSet);
                this.sizes = Array.from(sizeSet);
            },
            formatPrice(amount: number): string {
                return (amount / 100).toFixed(2);
            },
            goToDetailedProduct(productId: string) {
                this.$router.push({ name: "detailed", params: { id: productId } });
            },
            async applyFilters() {
                this.isLoading = true;

                try {
                    const response: ProductApiResponse = await getProducts();
                    this.products = response.results;
                    this.extractAttributes();
                } catch (err) {
                    this.errorMessage = "Failed to fetch products";
                } finally {
                    this.isLoading = false;
                }
            },
            resetFilters() {
                this.filters = {
                    minPrice: null,
                    maxPrice: null,
                    sortBy: "price_desc"
                };

                this.applyFilters();
                this.searchQuery = "";
                this.productsCurrentPage = 1;
            },
            clearFilters() {
                this.filters.sortBy = "price_desc";
                this.applyFilters();
            },
            getProductColors(product: ProductAllData): string[] {
                const colors = product.masterVariant.attributes
                    .filter((attr) => attr.name === "color")
                    .map((attr) => attr.value.key) || [];

                return colors;
            },
            async navigateToCategory(category: Category) {
                this.selectedCategory = category;

                this.products = (await getProducts([String(category.id) || ""], 0)).results;
            },
            navigateToHome() {
                this.selectedCategory = null;
                this.productsCurrentPage = 1;
                this.applyFilters();
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
            },
            async onPaginationUpdate(pagination: number): Promise<void> {
                this.products = (await getProducts(undefined, pagination - 1)).results;
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    };
</script>

<template>
    <v-container id="products-catalog-container" class="catalog-container" fluid>
        <v-row>
            <v-col cols="12">
                <h1 class="text-center">Product Catalog</h1>

                <v-breadcrumbs>
                    <v-breadcrumbs-item @click="navigateToHome" class="cursor-pointer">Products</v-breadcrumbs-item>
                    <v-breadcrumbs-item v-if="selectedCategory" class="cursor-default">
                        /&nbsp;&nbsp;{{ selectedCategory.name["en-GB"] }}
                    </v-breadcrumbs-item>
                </v-breadcrumbs>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="3">
                <v-card class="filter-card">
                    <v-card-title>Categories</v-card-title>
                    <v-row>
                        <v-col cols="12">
                            <div class="category-buttons">
                                <v-btn
                                    v-for="category in categories"
                                    :key="category.id"
                                    @click="navigateToCategory(category)"
                                    class="category-button"
                                    :class="{ 'active-category': selectedCategory && selectedCategory.id === category.id, 'hover-effect': hoveredCategory === category.id }"
                                    @mouseover="hoveredCategory = category.id"
                                    @mouseleave="hoveredCategory = null"
                                >
                                    {{ category.name["en-GB"] }}
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card class="filter-card">
                    <v-card-title>Search</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="searchQuery"
                            label="Search Products"
                            prepend-icon="mdi-magnify"
                            @change="applyFilters"
                            @click:clear="resetFilters"
                            clearable
                        ></v-text-field>
                        <span v-if="filteredProducts.length">
                            {{ filteredProducts.length }} Products Found
                        </span>
                    </v-card-text>
                </v-card>
                <v-card class="filter-card">
                    <v-card-title>Sorting</v-card-title>
                    <v-card-text>
                        <v-select
                            v-model="filters.sortBy"
                            :items="sortOptions"
                            label="Sort By"
                            @change="applyFilters"
                            @click:clear="resetFilters"
                            clearable
                        ></v-select>
                    </v-card-text>
                </v-card>
                <v-card class="filter-card">
                    <v-card-title>Filters</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="filters.minPrice"
                            label="Min Price"
                            type="number"
                            @change="applyFilters"
                        ></v-text-field>
                        <v-text-field
                            v-model="filters.maxPrice"
                            label="Max Price"
                            type="number"
                            @change="applyFilters"
                        ></v-text-field>

                        <v-btn @click="resetFilters">Reset Filters</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="9">
                <v-row>
                    <v-col cols="12" class="text-center">
                        <v-col cols="12" v-if="isLoading">
                            <v-progress-circular indeterminate></v-progress-circular>
                        </v-col>
                        <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
                    </v-col>
                </v-row>
                <v-row v-if="filteredProducts.length" class="products-grid" dense justify="center">
                    <v-col
                        v-for="product in filteredProducts"
                        :key="product.id"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                    >
                        <v-card class="product-card" elevation="2" @click="goToDetailedProduct(product.id)">
                            <v-img
                                v-if="product.masterVariant.images.length"
                                :src="product.masterVariant.images[0].url"
                                alt="Product Image"
                                class="product-image"
                                height="200px"
                            ></v-img>
                            <v-card-title class="product-name">
                                {{ product.name && product.name["en-GB"] ? product.name["en-GB"] : "Name Not Available" }}
                            </v-card-title>
                            <v-card-text class="product-description">
                                {{ product.description && product.description["en-GB"] ? product.description["en-GB"] : "Description Not Available" }}
                            </v-card-text>
                            <v-card-subtitle class="price">
                                <v-hover v-if="isProductInCart(product.id)">
                                    <template v-slot:default="{ isHovering, props }">
                                        <v-btn
                                            v-if="isHovering"
                                            v-bind="props"
                                            class="text-none delete-from-cart-button"
                                            icon="mdi-delete"
                                            @click.stop="removeFromCart(product.id)"
                                        ></v-btn>
                                        <v-btn
                                            v-else
                                            v-bind="props"
                                            class="text-none added-to-cart-button"
                                            icon="mdi-basket-check"
                                            @click.stop=""
                                        ></v-btn>
                                    </template>
                                </v-hover>
                                <v-btn v-else class="text-none" icon="mdi-basket-plus-outline" @click.stop="addToCart(product.id)"></v-btn>

                                <div v-if="product.masterVariant.prices.length">
                                    <template v-if="product.masterVariant.prices[0].discounted">
                                        <span class="original-price">€ {{ formatPrice(product.masterVariant.prices[0].value.centAmount) }}</span>
                                        <span class="discounted-price">€ {{ formatPrice(product.masterVariant.prices[0].discounted.value.centAmount) }}</span>
                                    </template>
                                    <template v-else>
                                        € {{ formatPrice(product.masterVariant.prices.filter((price) => price.value.currencyCode === "EUR")[0].value.centAmount) }}
                                    </template>
                                </div>
                                <span v-else class="no-price">No Price Available</span>
                            </v-card-subtitle>
                            <v-card-actions v-if="colors.length !== 0">
                                <v-chip
                                    v-for="color in getProductColors(product)"
                                    :key="color"
                                    :style="{ backgroundColor: color }"
                                    class="color-chip"
                                ></v-chip>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-if="!selectedCategory && searchQuery === '' && !filters.minPrice && !filters.maxPrice" justify="center">
                    <v-col cols="8">
                        <v-container class="max-width">
                            <v-pagination
                                v-model="productsCurrentPage"
                                :length="productsTotalPages"
                                class="my-4"
                                @update:modelValue="onPaginationUpdate"
                            ></v-pagination>
                        </v-container>
                    </v-col>
                </v-row>
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
    .catalog-container {
        max-width: 1600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Poppins, sans-serif;
    }

    .text-center {
        text-align: center;
    }

    .category-buttons {
        text-align: center;
    }

    .category-button {
        margin: 1px 10px;
        transition: background-color 0.3s ease, color 0.3s ease;
        color: #999;
    }

    .category-button.hover-effect,
    .category-button.active-category {
        background-color: #099a9a;
        color: white;
    }

    .product-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        background-color: #fff;
        transition: transform 0.3s ease, filter 0.3s ease;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .product-card:hover {
        transform: translateY(-10px);
        filter: brightness(1.05);
    }

    .product-image {
        width: 100%;
        object-fit: cover;
    }

    .product-name {
        font-size: 20px;
        font-weight: bold;
        margin: 10px 0;
        text-align: center;
        color: #099a9a;
    }

    .product-description {
        font-size: 16px;
        color: #666666;
        text-align: left;
        margin-bottom: 10px;
        flex-grow: 1;
        height: 66px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;
        color: #099a9a;
        text-align: center;
    }

    .original-price {
        text-decoration: line-through;
        color: #999;
        margin-right: 10px;
    }

    .discounted-price {
        font-size: 24px;
        color: #e60000;
        font-weight: bold;
    }

    .no-price {
        font-size: 20px;
        color: #999;
        text-align: center;
        margin-bottom: 20px;
    }

    .filter-card {
        border-radius: 8px;
        padding: 20px;
        margin-top: 8px;
        margin-bottom: 20px;
    }

    .color-chip {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 4px;
    }

    .added-to-cart-button, .delete-from-cart-button {
        background-color: #099a9a;
    }

    .delete-from-cart-button {
        color: #500101;
    }
</style>
