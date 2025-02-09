<script lang="ts">
    import { mergeProps } from "vue";
    import { useAuthStore } from "@/store";

    export default {
        async created() {
            await this.authStore.refreshToken();
        },
        data: () => ({
            isDrawerOpen: false,
            authStore: useAuthStore(),
            currentYear: new Date().getFullYear()
        }),
        methods: {
            mergeProps
        },
        computed: {
            getFullCustomerName(): string {
                const firstName = this.authStore?.user?.user?.firstName;
                const lastName = this.authStore?.user?.user?.lastName;

                return `${firstName} ${lastName}`;
            },
            getCartItemsCount(): number {
                return this.authStore?.user?.cart?.lineItems.length || 0;
            }
        }
    };
</script>

<template>
    <v-layout class="wrapper">
        <v-app-bar class="app-bar" dense flat :elevation="8">
            <v-app-bar-nav-icon class="d-md-none" @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>

            <v-app-bar-title
                class="app-bar-title cursor-pointer text-h6 mr-10"
                @click="$router.push('/')"
            >
                Ternion Squad
            </v-app-bar-title>

            <v-toolbar-items class="d-none d-md-flex ml-10">
                <v-btn to="/" prepend-icon="mdi-home" exact>Home</v-btn>
                <v-btn to="/products" exact>Products</v-btn>
                <v-btn to="/about" exact>About</v-btn>
            </v-toolbar-items>

            <v-spacer />

            <v-menu transition="slide-x-transition">
                <template v-slot:activator="{ props, isActive }">
                    <div class="user-container d-flex align-center cursor-pointer mr-3">
                        <v-card
                            v-if="authStore.isAuthorized()"
                            class="mx-auto d-flex align-center"
                            v-bind="props"
                        >
                            <v-avatar color="grey-darken-3 ml-1">
                                <img
                                    width="44"
                                    height="44"
                                    alt="Default profile image"
                                    src="@/assets/img/default-avatar.svg"
                                />
                            </v-avatar>
                            <v-card-text class="customer-greeting">
                                <span id="customer-greeting" class="text-body-1">Hi, {{ getFullCustomerName }}!</span>
                                <v-icon v-if="isActive" icon="mdi-menu-down"></v-icon>
                                <v-icon v-else icon="mdi-menu-right"></v-icon>
                            </v-card-text>
                        </v-card>
                        <v-tooltip v-else location="top">
                            <template v-slot:activator="{ props }">
                                <v-btn to="/login" v-bind="props" icon="mdi-account">
                                    <v-icon color="grey-lighten-1">mdi-account</v-icon>
                                </v-btn>
                            </template>
                            <span>Login</span>
                        </v-tooltip>
                    </div>
                </template>
                <v-card>
                    <v-list v-if="authStore.isAuthorized()" class="text-center">
                        <v-list-item>
                            <v-btn to="/profile" exact>Profile</v-btn>
                        </v-list-item>
                        <v-divider />
                        <v-list-item>
                            <v-btn @click="authStore.logOut()">Logout</v-btn>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>

            <v-btn id="cart-button" class="text-none" to="/basket" stacked>
                <v-icon v-if="getCartItemsCount === 0">mdi-cart</v-icon>
                <v-badge
                    v-else
                    color="#099a9a"
                    :content="getCartItemsCount"
                >
                    <v-icon id="cart-button-badge-icon">mdi-cart-heart</v-icon>
                </v-badge>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="isDrawerOpen" app temporary class="d-md-none">
            <v-list>
                <v-list-item>
                    <v-btn to="/" prepend-icon="mdi-home" exact>Home</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn to="/products" exact>Products</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn to="/about" exact>About</v-btn>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main class="main">
            <RouterView />
        </v-main>

        <v-footer class="footer justify-center" app>© 2023-{{ currentYear }}, Ternion Squad, Inc. or its affiliates</v-footer>
    </v-layout>
</template>

<style scoped>
    .wrapper {
        margin: 0 auto;
        width: 100%;
        max-width: 1600px;
        position: unset !important;
    }

    .app-bar-title {
        flex: none;
    }

    .customer-greeting {
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .app-bar {
        padding-left: 130px;
    }

    #cart-button {
        margin-right: 125px;
    }

    @media only screen and (max-width: 600px) {
        .app-bar {
            padding-left: 0;
        }

        .app-bar-title, .user-container {
            margin-right: 0;
        }

        #customer-greeting {
            position: relative;
            bottom: -1px;
        }

        .main {
            min-height: 300px;
            display: flex;
            align-items: center;
        }

        .footer {
            padding-left: 0;
            padding-right: 0;
        }

        .customer-greeting {
            max-width: calc(100vw - 100px);
        }
    }

    @media only screen and (max-width: 400px) {
        .app-bar-title {
            flex: 1;
        }
    }
</style>
