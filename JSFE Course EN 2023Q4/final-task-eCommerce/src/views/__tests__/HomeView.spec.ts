import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import HomeView from "../HomeView.vue";
import { it, expect, describe } from "vitest";

global.ResizeObserver = require("resize-observer-polyfill");

describe("HomeView.vue", () => {
    it("should render correctly", () => {
        const wrapper = mount(HomeView, {
            global: {
                plugins: [vuetify]
            }
        });
        expect(wrapper.exists()).toBe(true);
    });

    it("toggles the active state of a category on hover", async () => {
        const wrapper = mount(HomeView, {
            global: {
                plugins: [vuetify]
            }
        });

        const categoryIndex = 0;

        expect(wrapper.vm.categories[categoryIndex].active).toBe(false);

        const categoryCard = wrapper.findAll(".category-card").at(categoryIndex);

        if (categoryCard) {
            await categoryCard.trigger("mouseover");
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.categories[categoryIndex].active).toBe(true);

            await categoryCard.trigger("mouseleave");
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.categories[categoryIndex].active).toBe(false);
        } else {
            throw new Error("Category card at index ${categoryIndex} not found");
        }
    });
});
