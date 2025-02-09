<script lang="ts">
    import { defineComponent } from "vue";
    import type { Category, Slide } from "@/types/index";

    export default defineComponent({
        name: "HomePage",
        data() {
            const categories: Category[] = [
                {
                    id: 1,
                    name: { "en-GB": "Armor & Shields" },
                    url: "",
                    parentId: null,
                    ctId: null,
                    image: new URL("@/assets/img/cat4.jpg", import.meta.url).href,
                    active: false,
                    path: []
                },
                {
                    id: 2,
                    name: { "en-GB": "Arts & Crafts" },
                    url: "",
                    parentId: null,
                    ctId: null,
                    image: new URL("@/assets/img/cat5.jpg", import.meta.url).href,
                    active: false,
                    path: []
                },
                {
                    id: 3,
                    name: { "en-GB": "Home Decor" },
                    url: "",
                    parentId: null,
                    ctId: null,
                    image: new URL("@/assets/img/cat6.jpg", import.meta.url).href,
                    active: false,
                    path: []
                },
                {
                    id: 4,
                    name: { "en-GB": "Gadgets" },
                    url: "",
                    parentId: null,
                    ctId: null,
                    image: new URL("@/assets/img/cat7.jpg", import.meta.url).href,
                    active: false,
                    path: []
                },
                {
                    id: 5,
                    name: { "en-GB": "Books" },
                    url: "",
                    parentId: null,
                    ctId: null,
                    image: new URL("@/assets/img/cat8.jpg", import.meta.url).href,
                    active: false,
                    path: []
                },
                {
                    id: 6,
                    name: { "en-GB": "Clothing" },
                    url: "",
                    parentId: null,
                    ctId: null,
                    image: new URL("@/assets/img/cat9.jpg", import.meta.url).href,
                    active: false,
                    path: []
                }
            ];

            return {
                categories,
                search: "",
                slides: [
                    {
                        title: "Check This Out",
                        description: "Tactical Gear Kit",
                        image: new URL("@/assets/img/cat1.jpg", import.meta.url).href
                    },
                    {
                        title: "Gifts Under €50",
                        description: "Surprise your beloved ones with a Design gift! For less than €50",
                        image: new URL("@/assets/img/cat2.jpg", import.meta.url).href
                    },
                    {
                        title: "Unusual Geek Gadgets",
                        description: "Pac Man and Ghosts Light, Pac Man Collectable Figure Lamp",
                        image: new URL("@/assets/img/cat3.jpg", import.meta.url).href
                    }
                ] as Slide[]
            };
        },
        methods: {
            toggleHover(index: number) {
                this.categories[index].active = !this.categories[index].active;
            }
        }
    });
</script>

<template>
    <v-container class="wrapper">
        <v-row>
            <v-col class="sale-container d-flex justify-between align-center">
                <p>FLASH SALE: Use code TERNION24 to get 25% off everything!</p>
            </v-col>
        </v-row>
        <v-row>
            <v-carousel
                class="carousel-item"
                height="600"
                show-arrows="hover"
                cycle
                hide-delimiter-background
            >
                <v-carousel-item
                    v-for="(slide, index) in slides"
                    :key="index"
                    :src="slide.image"
                    cover
                >
                    <v-card color="#099a9ac0" width="400" height="150" class="ma-10">
                        <v-card-title class="text-h4 font-weight-black">{{ slide.title }}</v-card-title>
                        <v-card-text class="text-subtitle-1 font-weight-bold">{{ slide.description }}</v-card-text>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </v-row>

        <v-divider class="divider mt-15"></v-divider>

        <v-row>
            <v-col cols="12" class="text-center">
                <h1>Welcome to our store!</h1>
                <h3>We offer a wide range of products to suit your needs.</h3>
            </v-col>
        </v-row>

        <v-divider class="divider mb-15"></v-divider>

        <v-row>
            <h2 class="text-center">Shop by Category</h2>
        </v-row>
        <v-row justify="space-between" class="category-row">
            <v-col
                v-for="(category, index) in categories"
                :key="index"
                cols="12"
                sm="4"
                md="2"
                lg="2"
                class="category-card"
                @mouseover="toggleHover(index)"
                @mouseleave="toggleHover(index)"
            >
                <v-card
                    :class="{ 'v-card--hover': category.active }"
                    class="mx-auto"
                    :color="category.active ? 'primary' : 'surface-variant'"
                    :image="category.image"
                    max-width="340"
                >
                    <v-card-title class="category-name">
                        {{ category.name["en-GB"] }}
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    .wrapper {
        max-width: 1600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Poppins, sans-serif;
    }

    .sale-container {
        background-color: #099a9a;
    }

    .sale-container p {
        font-weight: bold;
    }

    .text-center {
        text-align: center;
    }

    .category-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 100px;
    }

    .category-card {
        margin-top: 20px;
        padding: 0;
    }

    .v-card {
        background-size: cover;
        background-position: center;
        height: 275px;
        width: 220px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin: 0 5px 5px 0;
    }

    .card-content {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 300px;
    }

    .category-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .category-name {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin-top: auto;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 10px;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        box-sizing: border-box;
    }

    .category-card:hover .category-name {
        opacity: 1;
    }

    .divider {
        margin: 20px 0;
    }

    @media (max-width: 1450px) {
        .category-card {
            flex-basis: calc(33.33% - 20px);
        }

        .category-name {
            font-size: 18px;
        }

        .carousel-caption {
            padding: 15px;
        }

        .carousel-caption h3 {
            font-size: 1.8em;
        }

        .carousel-caption p {
            font-size: 1em;
        }

        .v-card {
            width: 200px;
            height: 250px;
        }
    }

    @media (max-width: 1300px) {
        .v-card {
            width: 150px;
            height: 188px;
        }
    }

    @media (max-width: 992px) {
        .category-card {
            flex-basis: calc(50% - 20px);
        }

        .category-name {
            font-size: 16px;
        }

        .carousel-caption {
            padding: 10px;
        }

        .carousel-caption h3 {
            font-size: 1.6em;
        }

        .carousel-caption p {
            font-size: 0.9em;
        }

        .v-card {
            height: 290px;
            width: 230px;
        }
    }

    @media (max-width: 768px) {
        .category-card {
            flex-basis: calc(50% - 10px);
            height: auto;
        }

        .category-name {
            font-size: 16px;
        }

        .carousel-caption {
            padding: 10px;
        }

        .carousel-caption h3 {
            font-size: 1.4em;
        }

        .carousel-caption p {
            font-size: 0.8em;
        }

        .v-card {
            width: 160px;
            height: 200px;
        }
    }

    @media (max-width: 576px) {
        .category-card {
            flex-basis: calc(100% - 10px);
        }

        .category-name {
            font-size: 14px;
        }

        .carousel-caption {
            padding: 5px;
        }

        .carousel-caption h3 {
            font-size: 1.2em;
        }

        .carousel-caption p {
            font-size: 0.7em;
        }

        .v-card {
            height: 360px;
            width: 280px;
        }
    }
</style>
