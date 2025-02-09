import { describe, it, expect } from "vitest";
import { formatDateOfBirth } from "../formatDateOfBirth";

describe("Utils: formatDateOfBirth", () => {
    it("returns defined on date input", () => {
        const funcResult = formatDateOfBirth(new Date());

        expect(funcResult).toBeDefined();
    });

    it("returns defined on date input", () => {
        const funcResult = formatDateOfBirth(null);

        expect(funcResult).toBeDefined();
    });

    it("of string results on date input", () => {
        const funcResult = formatDateOfBirth(new Date());

        expect(funcResult.serviceFormat).toBeTypeOf("string");
        expect(funcResult.uiFormat).toBeTypeOf("string");
    });

    it("of string results on null input", () => {
        const funcResult = formatDateOfBirth(null);

        expect(funcResult.serviceFormat).toBeTypeOf("string");
        expect(funcResult.uiFormat).toBeTypeOf("string");
    });

    it("returns empty string on null input", () => {
        const funcResult = formatDateOfBirth(null);

        expect(funcResult.serviceFormat).toHaveLength(0);
        expect(funcResult.uiFormat).toHaveLength(0);
    });

    it("returns non empty string on date input", () => {
        const funcResult = formatDateOfBirth(new Date());

        expect(funcResult.serviceFormat).toHaveLength(10);
        expect(funcResult.uiFormat).toHaveLength(10);
    });

    it("returns correct format for the year and month beginning", () => {
        const testDate = new Date(2024, 4, 4);
        const funcResult = formatDateOfBirth(testDate);

        expect(funcResult.serviceFormat).toEqual("2024-05-04");
        expect(funcResult.uiFormat).toEqual("2024/05/04");
    });

    it("returns correct format for the year and month end", () => {
        const testDate = new Date(2024, 11, 30);
        const funcResult = formatDateOfBirth(testDate);

        expect(funcResult.serviceFormat).toEqual("2024-12-30");
        expect(funcResult.uiFormat).toEqual("2024/12/30");
    });

    it("returns correct format for the year beginning and month end", () => {
        const testDate = new Date(2024, 0, 30);
        const funcResult = formatDateOfBirth(testDate);

        expect(funcResult.serviceFormat).toEqual("2024-01-30");
        expect(funcResult.uiFormat).toEqual("2024/01/30");
    });

    it("returns correct format for the year end and month start", () => {
        const testDate = new Date(2024, 10, 1);
        const funcResult = formatDateOfBirth(testDate);

        expect(funcResult.serviceFormat).toEqual("2024-11-01");
        expect(funcResult.uiFormat).toEqual("2024/11/01");
    });

    it("returns correct format for the ambiguous input", () => {
        const testDate = new Date(2024, 4, 6);
        const funcResult = formatDateOfBirth(testDate);

        expect(funcResult.serviceFormat).toEqual("2024-05-06");
        expect(funcResult.uiFormat).toEqual("2024/05/06");
    });
});
