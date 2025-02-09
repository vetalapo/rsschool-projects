import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, it, expect, vi } from "vitest";
import LoginView from "@/views/LoginView.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { useAuthStore } from "@/store";
import type { LoginViewData } from "./types";

global.ResizeObserver = require("resize-observer-polyfill");

let wrapper: VueWrapper;

beforeEach(async () => {
    wrapper = mount(LoginView, {
        global: {
            plugins: [vuetify, router]
        }
    });
});

vi.mock("@/store", () => ({
    useAuthStore: vi.fn()
}));

describe("Login Page:", () => {
    it("renders the login page, its header, and app logo", () => {
        expect(wrapper.find("h1").text()).toEqual("Welcome to oureCommerce");
        expect(wrapper.find(".app-logo").text()).toEqual("eCommerceapp");
        expect(wrapper.find("h2").text()).toEqual("eCommerce");
        expect(wrapper.find("h2 + span").text()).toEqual("app");
    });

    it("has input form, Email, Password, Login Button controls", () => {
        expect(wrapper.get("form").isVisible()).toEqual(true);
        expect(wrapper.get("[data-test='email']").isVisible()).toEqual(true);
        expect(wrapper.get("[data-test='password']").isVisible()).toEqual(true);
        expect(wrapper.get("[type=submit]").isVisible()).toEqual(true);
    });

    it("Login error NOT displayed", () => {
        expect(wrapper.find("[data-test='wrong-password']").exists()).toBe(false);
    });

    it("Email input has value assignable", async () => {
        const sampleEmail = "example@example.example";
        const emailInput = wrapper.getComponent("[data-test=email]").get("input");

        await emailInput.setValue(sampleEmail);

        expect(emailInput.element.value).toEqual(sampleEmail);
    });

    it("Password input has value assignable", async () => {
        const samplePassword = "2i>3*0[+Z$q?";
        const passwordInput = wrapper.getComponent("[data-test='password']").get("input");

        await passwordInput.setValue(samplePassword);

        expect(passwordInput.element.value).toEqual(samplePassword);
    });

    it("Password input is a password type", async () => {
        const passwordInput = wrapper.getComponent("[data-test='password']").get("input");

        expect(passwordInput.attributes().type).toBe("password");
    });

    it("Email, Password accept data as formData", async () => {
        const formData = {
            email: "example@example.example",
            password: "2i>3*0[+Z$q?"
        };

        const emailInput = wrapper.getComponent("[data-test=email]").get("input");
        const passwordInput = wrapper.getComponent("[data-test='password']").get("input");

        emailInput.setValue(formData.email);
        passwordInput.setValue(formData.password);

        const wrapperData = wrapper.vm as unknown as LoginViewData;

        expect(wrapperData.credentials).toEqual(formData);
    });

    it("displays an error message when login fails", async () => {
        const authStore = {
            logIn: vi.fn().mockResolvedValue(new Error("Login failed"))
        };

        (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(authStore);

        wrapper.setData({
            form: true,
            credentials: { email: "test@example.com", password: "password" }
        });

        await wrapper.find("form").trigger("submit.prevent");
        await new Promise((resolve) => setTimeout(resolve, 500)); // wait for the timeout

        const wrapperData = wrapper.vm as unknown as LoginViewData;

        expect(wrapperData.isLoginError).toEqual(true);
        expect(wrapper.find(".text-error").exists()).toBe(true);
    });

    it("calls the login method on form submit", async () => {
        const authStore = {
            logIn: vi.fn().mockResolvedValue({})
        };

        (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(authStore);

        wrapper.setData({
            form: true,
            credentials: { email: "test@example.com", password: "password" }
        });

        await wrapper.find("form").trigger("submit.prevent");

        expect(authStore.logIn).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password"
        });
    });

    it("email validation rule: is required", async () => {
        const email = wrapper.getComponent("[data-test='email']");

        await email.trigger("focus");
        await email.get("input").setValue("123");
        await email.get("input").setValue("");
        await email.trigger("blur");

        const emailErrorMsg = email.get(".v-messages__message");

        expect(emailErrorMsg.text()).toEqual("Required");
    });

    it("email validation rule: is proper formatted (contains '@')", async () => {
        const email = wrapper.getComponent("[data-test='email']");

        await email.trigger("focus");
        await email.get("input").setValue("error");
        await email.trigger("blur");

        const emailErrorMsg = email.get(".v-messages__message");

        expect(emailErrorMsg.text()).toEqual("Must contain an '@' symbol separating local part and domain name");
    });

    it("email validation rule: has domain", async () => {
        const email = wrapper.getComponent("[data-test='email']");

        await email.trigger("focus");
        await email.get("input").setValue("error@");
        await email.trigger("blur");

        const emailErrorMsg = email.get(".v-messages__message");

        expect(emailErrorMsg.text()).toEqual("Must contain a domain name (e.g., example.com)");
    });

    it("email validation rule: no leading or trailing whitespace", async () => {
        const email = wrapper.getComponent("[data-test='email']");

        await email.trigger("focus");
        await email.get("input").setValue("error@test.com ");
        await email.trigger("blur");

        const emailErrorMsg = email.get(".v-messages__message");

        expect(emailErrorMsg.text()).toEqual("Must not contain leading or trailing whitespace");
    });

    it("email validation rule: is properly formatted (e.g., user@example.com)", async () => {
        const email = wrapper.getComponent("[data-test='email']");

        await email.trigger("focus");
        await email.get("input").setValue("@snth.com");

        await new Promise((resolve) => setTimeout(resolve, 100)); // wait for the timeout

        await email.trigger("blur");

        const emailErrorMsg = email.get(".v-messages__message");

        expect(emailErrorMsg.text()).toEqual("Must be properly formatted (e.g., user@example.com)");
    });

    it("password validation rule: is required", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue("123");
        await password.get("input").setValue("");
        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Required");
    });

    it("password validation rule: min length 8 characters", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue("less");
        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Min 8 characters");
    });

    it("password validation rule: min 1 digit", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue("eightchr");
        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Must contain at least one digit from 1 to 9");
    });

    it("password validation rule: min 1 lowercase letter", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue("EIGHTCHR5");
        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Must contain at least one lowercase letter");
    });

    it("password validation rule: min 1 UPPERCASE letter", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue("eightchr5");

        await new Promise((resolve) => setTimeout(resolve, 100)); // wait for the timeout

        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Must contain at least one UPPERCASE letter");
    });

    it("password validation rule: min 1 special char", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue("eightchr5A");

        await new Promise((resolve) => setTimeout(resolve, 100)); // wait for the timeout

        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Must contain at least one special character");
    });

    it("password validation rule: no leading white space", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue(" eightchr5A>");

        await new Promise((resolve) => setTimeout(resolve, 100)); // wait for the timeout

        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Must not contain leading or trailing whitespace");
    });

    it("password validation rule: no trailing white space", async () => {
        const password = wrapper.getComponent("[data-test='password']");

        await password.trigger("focus");
        await password.get("input").setValue("eightchr5A> ");

        await new Promise((resolve) => setTimeout(resolve, 100)); // wait for the timeout

        await password.trigger("blur");

        const passwordErrorMsg = password.get(".v-messages__message");

        expect(passwordErrorMsg.text()).toEqual("Must not contain leading or trailing whitespace");
    });
});
