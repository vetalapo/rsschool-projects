import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, it, expect, vi } from "vitest";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import ProfileView from "../ProfileView.vue";

global.ResizeObserver = require("resize-observer-polyfill");

let wrapper: VueWrapper;

beforeEach(async () => {
    wrapper = mount(ProfileView, {
        global: {
            plugins: [vuetify, router]
        }
    });
});

vi.mock("@/store", () => ({
    useAuthStore: vi.fn()
}));

describe("Profile Page:", () => {
    it("renders empty page with no input but has some default elements", async () => {
        expect(wrapper.find("h2").text()).toEqual("");
        expect(() => wrapper.get(".birthday-text")).toThrowError();
        expect(wrapper.text()).toContain("Addresses");
    });
});
