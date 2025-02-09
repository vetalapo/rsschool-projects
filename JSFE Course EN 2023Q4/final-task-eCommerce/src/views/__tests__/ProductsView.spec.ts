import { mount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ProductsView from "@/views/ProductsView.vue";
import {
    getProducts,
    getCategories,
    removeProductFromCart,
} from "@/services/commercetoolsApi";
import { useAuthStore } from "@/store";
import { setActivePinia, createPinia } from "pinia";
import type { ProductApiResponse, Category, Cart, TokenResponse, CustomerWithToken } from "@/types";
import type { Mock } from "vitest";
import vuetify from "@/plugins/vuetify";
import type { ProductsViewData } from "./types";
import type { Pinia } from "pinia";

global.ResizeObserver = require("resize-observer-polyfill");

vi.mock("@/services/commercetoolsApi", () => ({
    removeProductFromCart: vi.fn(),
    getProducts: vi.fn(),
    getCategories: vi.fn(),
    addProductToCart: vi.fn(),
    getAnonymousUser: vi.fn(),
    createCart: vi.fn(),
    getMyCarts: vi.fn()
}));

const mockedRemoveProductFromCart = removeProductFromCart as ReturnType<typeof vi.fn>;
type ProductsViewInstance = InstanceType<typeof ProductsView>;

let wrapper: VueWrapper<ProductsViewInstance>;
let authStore: ReturnType<typeof useAuthStore>;
let pinia: Pinia;

beforeEach(() => {
    vi.clearAllMocks();

    pinia = createPinia();
    setActivePinia(pinia);

    authStore = useAuthStore();
    authStore.$patch({
        user: {
            user: {
                id: "123",
                version: 1,
                email: "test@example.com",
                firstName: "Test",
                lastName: "User",
                dateOfBirth: "1990-01-01",
                addresses: [],
                shippingAddressIds: [],
                billingAddressIds: []
            },
            cart: null,
            token: {
                access_token: "token",
                expires_in: "3600",
                token_type: "Bearer",
                scope: "view",
                expires_at: "2023-01-01T00:00:00Z",
                refresh_token: "refresh_token"
            } as TokenResponse
        } as CustomerWithToken
    });

    vi.spyOn(authStore, 'isAuthorized').mockReturnValue(true);
    vi.spyOn(authStore, 'updateUserData').mockImplementation(() => { });

    wrapper = mount(ProductsView, {
        global: {
            plugins: [vi.fn(), vuetify, pinia],
        }
    });
});

afterEach(() => {
    if (wrapper) {
        wrapper.unmount();
    }
});

describe("ProductsView.vue", () => {

    it("should render correctly", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it("fetches products and categories on mount", async () => {
        const productsResponse: ProductApiResponse = {
            results: [],
            total: 0
        };

        const categoriesResponse: Category[] = [];

        (getProducts as Mock).mockResolvedValue(productsResponse);
        (getCategories as Mock).mockResolvedValue(categoriesResponse);

        await wrapper.vm.$nextTick();

        expect(getProducts).toHaveBeenCalled();
        expect(getCategories).toHaveBeenCalled();
        expect(wrapper.vm.products).toEqual(productsResponse.results);
        expect(wrapper.vm.categories).toEqual(categoriesResponse);
    });

    it("removes a product from the cart", async () => {
        const productId = "product-1";

        const cartResult: Cart = {
            id: "cart-1",
            version: 2,
            discountCodes: [],
            lineItems: [],
            totalPrice: {
                centAmount: 1000,
                currencyCode: "EUR",
                fractionDigits: 2
            }
        };

        mockedRemoveProductFromCart.mockResolvedValue(cartResult);

        const wrapperData = wrapper.vm as unknown as ProductsViewData;
        const spy = vi.spyOn(wrapperData, "removeFromCart");

        await wrapperData.removeFromCart(productId);

        expect(spy).toHaveBeenCalled();
        expect(wrapperData.notification.message).toBe("");
    });

    it("applies filters correctly", async () => {
        const response: ProductApiResponse = { results: [], total: 0 };
        (getProducts as Mock).mockResolvedValue(response);

        await wrapper.vm.applyFilters();

        expect(wrapper.vm.isLoading).toBe(false);
        expect(wrapper.vm.products).toEqual(response.results);
    });

    it("resets filters and fetches products", async () => {
        const response: ProductApiResponse = { results: [], total: 0 };
        (getProducts as Mock).mockResolvedValue(response);

        wrapper.vm.resetFilters();

        expect(wrapper.vm.filters).toEqual({
            minPrice: null,
            maxPrice: null,
            sortBy: "price_desc",
        });

        expect(wrapper.vm.products).toEqual(response.results);
    });
});
