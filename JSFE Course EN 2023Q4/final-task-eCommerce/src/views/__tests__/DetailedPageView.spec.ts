import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import DetailedPageView from "../DetailedPageView.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { getProductDetails, addProductToCart, getAnonymousUser } from "@/services/commercetoolsApi";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "@/store";
import type { CustomerWithToken, TokenResponse, Cart } from "@/types";
import type { DetailedPageViewData } from "./types";

global.ResizeObserver = require("resize-observer-polyfill");

vi.mock("@/services/commercetoolsApi", () => ({
    getProductDetails: vi.fn(),
    getMyCarts: vi.fn(),
    createCart: vi.fn(),
    addProductToCart: vi.fn(),
    getAnonymousUser: vi.fn(),
    removeProductFromCart: vi.fn()
}));

const mockedGetProductDetails = getProductDetails as ReturnType<typeof vi.fn>;
const mockedAddProductToCart = addProductToCart as ReturnType<typeof vi.fn>;
const mockedGetAnonymousUser = getAnonymousUser as ReturnType<typeof vi.fn>;

let wrapper: VueWrapper;

beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const authStore = useAuthStore();
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

    mockedGetProductDetails.mockResolvedValue({
        id: "1",
        masterData: {
            current: {
                name: { "en-GB": "Sample Product" },
                description: { "en-GB": "Sample Description" },
                masterVariant: {
                    prices: [{ value: { currencyCode: "EUR", centAmount: 1000 } }],
                    images: [{ url: "https://example.com/image1-large.jpg" }]
                }
            }
        }
    });

    mockedGetAnonymousUser.mockResolvedValue({
        user: {
            id: "anon-1",
            version: 1,
            email: "anonymous@example.com",
            firstName: "Anon",
            lastName: "User",
            dateOfBirth: "1990-01-01",
            addresses: [],
            shippingAddressIds: [],
            billingAddressIds: []
        },
        cart: null,
        token: {
            access_token: "anon-token",
            expires_in: "3600",
            token_type: "Bearer",
            scope: "view",
            expires_at: "2023-01-01T00:00:00Z",
            refresh_token: "anon_refresh_token"
        } as TokenResponse
    });

    const mockCart: Cart = {
        id: "cart-1",
        version: 1,
        discountCodes: [],
        lineItems: [{
            id: "line-item-1",
            productId: "1",
            name: { "en-US": "Sample Product", "en-GB": "Sample Product", "de-DE": "Beispielprodukt" },
            price: {
                value: { centAmount: 1000, currencyCode: "EUR", fractionDigits: 2 },
                discounted: {
                    value: { currencyCode: "EUR", centAmount: 900, fractionDigits: 2 },
                    discount: { id: "discount-1" }
                },
                id: "price-1"
            },
            discountedPrice: {
                value: { currencyCode: "EUR", centAmount: 900, fractionDigits: 2 },
                includedDiscounts: [{
                    discount: { typeId: "discount", id: "discount-1" },
                    discountedAmount: { currencyCode: "EUR", centAmount: 100, fractionDigits: 2 }
                }]
            },
            productSlug: "sample-product",
            totalPrice: { currencyCode: "EUR", centAmount: 1000, fractionDigits: 2 },
            variant: { sku: "sample-sku", images: [{ url: "https://example.com/image1-large.jpg" }] },
            quantity: 1
        }],
        totalPrice: {
            centAmount: 1000,
            currencyCode: "EUR",
            fractionDigits: 2
        }
    };

    mockedAddProductToCart.mockResolvedValue(mockCart);

    wrapper = mount(DetailedPageView, {
        global: {
            plugins: [vuetify, router, pinia]
        }
    });

    router.push("/product/1");

    await router.isReady();
});

afterEach(() => {
    wrapper.unmount();
});

describe("Detailed Page:", () => {
    it("renders detailed page", async () => {
        await wrapper.vm.$nextTick();

        expect(mockedGetProductDetails).toHaveBeenCalled();
        expect(wrapper.find("h2").text()).toContain("Sample Product");
        expect(wrapper.find("p").text()).toContain("Sample Description");
        expect(wrapper.findAllComponents({ name: "v-carousel-item" }).length).toBe(1);
    });

    it("redirects to 404 if product not found", async () => {
        mockedGetProductDetails.mockResolvedValue(null);

        router.push("/product/unknown");
        await router.isReady();
        await wrapper.vm.$nextTick();

        expect(router.currentRoute.value.name).toBe("not-found");
    });


    it("adds a product to the cart", async () => {
        console.log("mockedAddProductToCart called: ", mockedAddProductToCart.mock.calls);

        const wrapperData = wrapper.vm as unknown as DetailedPageViewData;

        const spy = vi.spyOn(wrapperData, "addToCart")
        await wrapperData.addToCart("1");
        expect(spy).toHaveBeenCalled();
    });

    it("removes a product from the cart", async () => {

        const wrapperData = wrapper.vm as unknown as DetailedPageViewData;

        const spy = vi.spyOn(wrapperData, "removeFromCart")
        await wrapperData.removeFromCart("1");

        expect(spy).toHaveBeenCalled();
        expect(wrapperData.notification.message).toBe("");
    });

    it("displays messages correctly", async () => {
        const wrapperData = wrapper.vm as unknown as DetailedPageViewData;
        await wrapperData.displayMessage("Test message", "mdi-information", "text-blue");
        expect(wrapperData.message).toBe("Test message");
        expect(wrapperData.messageIcon).toBe("mdi-information");
        expect(wrapperData.iconColor).toBe("text-blue");

        await new Promise((resolve) => setTimeout(resolve, 3000));
        expect(wrapperData.message).toBe("");
    });

    it("computes breadcrumb items correctly", () => {
        const wrapperData = wrapper.vm as unknown as DetailedPageViewData;
        const expectedBreadcrumbs = [
            { title: "Home", disabled: false, to: { name: "home" } },
            { title: "Products", disabled: false, to: { name: "products" } },
            { title: "Sample Product", disabled: true, to: "" }
        ];

        expect(wrapperData.breadcrumbItems).toEqual(expectedBreadcrumbs);
    });
});
