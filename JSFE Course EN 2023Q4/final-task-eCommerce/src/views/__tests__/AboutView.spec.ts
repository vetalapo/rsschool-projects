import { describe, it, expect, beforeEach } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import AboutView from "@/views/AboutView.vue";
import vuetify from "@/plugins/vuetify";

describe("AboutView.vue", () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        wrapper = mount(AboutView, {
            global: {
                plugins: [vuetify]
            }
        });
    });

    it("renders the AboutView component correctly", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it("renders Valeria info correctly", () => {
        const valeryiaCard = wrapper.findAllComponents({ name: "v-card" })[0];

        expect(valeryiaCard.find(".v-card-title").text()).toBe("Valeryia Yarash");
        expect(valeryiaCard.find(".v-card-subtitle").text()).toBe("Student");
        expect(valeryiaCard.find(".card-text").text()).toContain("Valeryia was instrumental in shaping the visual identity of our project.");
    });

    it("renders Vitaly info correctly", () => {
        const vitalyCard = wrapper.findAllComponents({ name: "v-card" })[1];

        expect(vitalyCard.find(".v-card-title").text()).toBe("Vitaly Dushkin");
        expect(vitalyCard.find(".v-card-subtitle").text()).toBe("Software Engineer");
        expect(vitalyCard.find(".card-text").text()).toContain("Vitaly spearheaded our technical endeavors, bringing a wealth of expertise and precision to the project.");
    });

    it("renders Joelle info correctly", () => {
        const joelleCard = wrapper.findAllComponents({ name: "v-card" })[2];

        expect(joelleCard.find(".v-card-title").text()).toBe("Joëlle Marianek");
        expect(joelleCard.find(".v-card-subtitle").text()).toBe("Student");
        expect(joelleCard.find(".card-text").text()).toContain("Joelle was responsible for researching and setting up our project management tool, as well as establishing meeting protocols.");
    });
});
