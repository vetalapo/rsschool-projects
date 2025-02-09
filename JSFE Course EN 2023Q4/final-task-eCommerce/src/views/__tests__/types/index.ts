import type { Credentials } from "@/types";
import type { ValidationRules } from "@/utils/validationRules";
import type { BreadcrumbItem, ProductSingle, ProductAllData, Category, CustomerWithToken } from "@/types";
import { useAuthStore } from "@/store";

export interface LoginViewData {
    isPasswordVisible: boolean;
    form: boolean;
    credentials: Credentials;
    loading: boolean;
    isLoginError: boolean;
    commonValidationRules: ValidationRules;
};

export interface DetailedPageViewData {
    product: ProductSingle;
    loading: boolean;
    overlayVisible: boolean;
    currentImageIndex: number;
    authStore: ReturnType<typeof useAuthStore>;
    message: string;
    messageIcon: string;
    messageColor: string;
    iconColor: string;
    notification: {
        isDisplay: boolean;
        message: string;
    };
    getPrice(currencyCode: string): string;
    getDiscount(): string;
    showOverlay(index: number): void;
    displayMessage(message: string, icon: string, iconColor: string): void;
    handleCartAction(): Promise<void>;
    isProductInCart(productId: string): boolean;
    addToCart(productId: string, quantity?: number): Promise<void>;
    removeFromCart(productId: string, quantity?: number): Promise<void>;
    breadcrumbItems: BreadcrumbItem[];
    largeImages: Array<{ url: string }>;
    extraLargeImages: Array<{ url: string }>;
    showArrows: boolean;
}

export interface ProductsViewData {
    products: ProductAllData[];
    categories: Category[];
    selectedCategory: Category | null;
    searchQuery: string;
    filters: {
        minPrice: number | null;
        maxPrice: number | null;
        sortBy: string;
    };
    isLoading: boolean;
    errorMessage: string | null;
    notification: {
        isDisplay: boolean;
        message: string;
    };
    authStore: {
        user: CustomerWithToken | null;
        updateUserData: (data: CustomerWithToken) => void;
    };
    fetchProducts: () => Promise<void>;
    updateFilters: (key: string, value: string | number | null) => void;
    removeFromCart: (productId: string, quantity?: number) => Promise<void>;
    addToCart(productId: string, quantity?: number): Promise<void>;
}
