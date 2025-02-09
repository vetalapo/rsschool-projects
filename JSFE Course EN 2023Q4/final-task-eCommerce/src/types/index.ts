import type { RouteLocationRaw } from "vue-router";

interface BreadcrumbItem {
    title: string;
    disabled: boolean;
    to: RouteLocationRaw;
}

type Address = {
    readonly id?: string;
    streetName: string;
    city: string;
    postalCode: string;
    country: string;
};

type FullCustomerAddress = {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
    streetName: string;
    streetNumber: string;
}

type AddressType = {
    isShipping: boolean;
    isShippingAddressDefault: boolean;
    isBilling: boolean;
    isBillingAddressDefault: boolean;
};

type FullCustomerAddressModel = FullCustomerAddress & AddressType;

type RegisterUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    shippingAddressStreet: string;
    shippingAddressCity: string;
    shippingAddressPostCode: string;
    shippingAddressCountry: string;
    isShippingAddressDefault: boolean;
    billingAddressStreet: string;
    billingAddressCity: string;
    billingAddressPostCode: string;
    billingAddressCountry: string;
    isBillingAddressDefault: boolean;
};

type CreateUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    addresses: Address[];
    shippingAddresses: number[];
    billingAddresses: number[];
    defaultShippingAddress?: number;
    defaultBillingAddress?: number;
};

type TokenResponse = {
    access_token: string;
    expires_in: string;
    expires_at: string;
    refresh_token: string;
    scope: string;
    token_type: string;
};

type Customer = {
    id: string;
    version: number;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: Address[];
    shippingAddressIds: string[];
    billingAddressIds: string[];
    defaultShippingAddressId?: string;
    defaultBillingAddressId?: string;
};

type CustomerWithToken = {
    user: Customer | null;
    cart: Cart | null;
    token: TokenResponse;
};

type Credentials = {
    email: string;
    password: string;
};

interface Dictionary<T> {
    [key: string]: T;
};

interface DateOfBirthFormat {
    serviceFormat: string,
    uiFormat: string
}

type StateFields = {
    customer?: null | CustomerWithToken;
};

type Category = {
    id: number;
    name: Dictionary<string>;
    url: string;
    parentId: number | null;
    ctId: string | null;
    path?: Category[];
    image: string;
    active: boolean;
};

type ProductAllData = {
    id: string;
    name: Dictionary<string>;
    description: Dictionary<string>;
    categories: string[];
    slug: string;
    masterVariant: {
        attributes: {
            name: string;
            value: {
                key: string;
            };
        }[];
        sku: string;
        images: {
            url: string;
            dimensions: {
                w: number;
                h: number;
            };
        }[];
        prices: {
            value: {
                centAmount: number;
                currencyCode: string;
            };
            discounted: {
                value: {
                    type: string;
                    currencyCode: string;
                    centAmount: number;
                };
            };
        }[];
    };
};

interface ProductSingle {
    id: string;
    version: number;
    masterData: {
        current: {
            name: {
                "en-GB": string;
            };
            description: {
                "en-GB": string;
            };
            masterVariant: {
                prices: {
                    value: {
                        currencyCode: string;
                        centAmount: number;
                    },
                    discounted: {
                        value: {
                            currencyCode: string;
                            centAmount: number;
                        }
                    }
                }[];
                images: {
                    url: string;
                    dimensions: {
                        w: number;
                        h: number;
                    }
                }[];
            };
        }
    }
}

type ProductApiResponse = {
    total: number;
    results: ProductAllData[];
};

interface LineItem {
    id: string;
    productId: string;
    name: {
        "en-US": string,
        "en-GB": string,
        "de-DE": string
    };
    price: {
        value: {
            centAmount: number;
            currencyCode: string;
            fractionDigits: number;
        };
        discounted: {
            value: {
                currencyCode: string;
                centAmount: number;
                fractionDigits: number;
            };
            discount: { id: string };
        };
        id: string;
    };

    discountedPrice: {
        value: {
            currencyCode: string;
            centAmount: number;
            fractionDigits: number;
        };
        includedDiscounts: [
            {
                discount: {
                    typeId: string;
                    id: string;
                };
                discountedAmount: {
                    currencyCode: string;
                    centAmount: number;
                    fractionDigits: number;
                };
            }
        ];
    };

    productSlug: string;
    totalPrice: {
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
    };
    variant: {
        sku: string;
        images: { url: string }[];
    };
    quantity: number;
}

type Cart = {
    id: string;
    version: number;
    discountCodes: {
        discountCode: {
            id: string;
        };
        state: string;
    }[];

    lineItems: LineItem[];
    totalPrice: {
        centAmount: number;
        currencyCode: string;
        fractionDigits: number;
    };
};

type CartAPI = {
    count: number;
    limit: number;
    offset: number;
    results: Cart[];
};

interface SelectOption {
    title: string;
    value: string;
}

interface Slide {
    title: string;
    description: string;
    image: string;
}

export type {
    BreadcrumbItem,
    Address,
    FullCustomerAddress,
    AddressType,
    FullCustomerAddressModel,
    TokenResponse,
    Customer,
    Credentials,
    DateOfBirthFormat,
    Dictionary,
    CustomerWithToken,
    RegisterUser,
    CreateUser,
    StateFields,
    Category,
    ProductAllData,
    ProductSingle,
    ProductApiResponse,
    Cart,
    CartAPI,
    SelectOption,
    Slide
};
