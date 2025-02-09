import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BasketView from "@/views/BasketView.vue";
import { useAuthStore } from "@/store";
import {
    addProductToCart,
    removeProductFromCart,
    removeProductsFromCart,
} from "@/services/commercetoolsApi";

vi.mock("@/store");
vi.mock("@/services/commercetoolsApi");

describe("BasketView.vue", () => {
    let wrapper: any;
    const mockAuthStore = {
        user: {
            token: {
                access_token: "mock-token",
            },
            cart: {
                id: "mock-cart-id",
                version: 1,
                lineItems: [
                    {
                        id: "line-item-1",
                        productId: "product-1",
                        quantity: 2,
                        price: {
                            value: {
                                centAmount: 5000,
                            },
                        },
                        totalPrice: {
                            centAmount: 10000,
                        },
                        variant: {
                            images: [{ url: "image-url" }],
                        },
                        name: {
                            "en-GB": "Product 1",
                        },
                    },
                ],
            },
        },
        updateUserData: vi.fn()
    };

    beforeEach(() => {
        (useAuthStore as any).mockReturnValue(mockAuthStore);

        wrapper = shallowMount(BasketView);
    });

    it("adds a product to the cart", async () => {
        (addProductToCart as any).mockResolvedValue({
            id: "mock-cart-id",
            version: 2,
            lineItems: []
        });

        await wrapper.vm.addToCart("product-2", 1);

        expect(addProductToCart).toHaveBeenCalledWith(
            "mock-token",
            "product-2",
            "mock-cart-id",
            1,
            1
        );
    });

    it("removes a product from the cart", async () => {
        (removeProductFromCart as any).mockResolvedValue({
            id: "mock-cart-id",
            version: 2,
            lineItems: []
        });

        await wrapper.vm.removeFromCart("product-1", 1);

        expect(removeProductFromCart).toHaveBeenCalledWith(
            "mock-token",
            "line-item-1",
            "mock-cart-id",
            1,
            1
        );
    });

    it("calculates the total cost correctly", () => {
        expect(wrapper.vm.totalCost).toBe(100);
    });

    it("clears the cart", async () => {
        (removeProductsFromCart as any).mockResolvedValue({
            id: "mock-cart-id",
            version: 2,
            lineItems: []
        });

        await wrapper.vm.confirmClearCart();

        expect(removeProductsFromCart).toHaveBeenCalledWith(
            "mock-token",
            ["line-item-1"],
            "mock-cart-id",
            1
        );
    });
});
