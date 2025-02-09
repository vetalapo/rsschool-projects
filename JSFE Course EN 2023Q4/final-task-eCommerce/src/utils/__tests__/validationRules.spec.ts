import { describe, it, expect } from "vitest";
import { ValidationRules } from "../validationRules";

describe("Utils: 'required' validationRules", () => {
    it("empty input returns required", () => {
        const funcResult = ValidationRules.required("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Required");
    });

    it("non-empty input returns true", () => {
        const funcResult = ValidationRules.required("a");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'minOneLowerCase' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.minOneLowerCase("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one lowercase letter");
    });

    it("non-empty UPPER CASE input returns validation error", () => {
        const funcResult = ValidationRules.minOneLowerCase("HELLO123");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one lowercase letter");
    });

    it("non-empty mixed case input returns validation success", () => {
        const funcResult = ValidationRules.minOneLowerCase("HELLO123w");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'minOneUpperCase' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.minOneUpperCase("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one UPPERCASE letter");
    });

    it("non-empty lower case input returns validation error", () => {
        const funcResult = ValidationRules.minOneUpperCase("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one UPPERCASE letter");
    });

    it("non-empty mixed case input returns validation success", () => {
        const funcResult = ValidationRules.minOneUpperCase("heLlo");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'minOneSpecialChar' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.minOneSpecialChar("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one special character");
    });

    it("non-empty no special chars input returns validation error", () => {
        const funcResult = ValidationRules.minOneSpecialChar("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one special character");
    });

    it("non-empty mixed case input returns validation success", () => {
        const funcResult = ValidationRules.minOneSpecialChar("heLl*");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'minOneDigit' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.minOneDigit("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one digit from 1 to 9");
    });

    it("non-empty no symbol input returns validation error", () => {
        const funcResult = ValidationRules.minOneDigit("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain at least one digit from 1 to 9");
    });

    it("non-empty mixed case input returns validation success", () => {
        const funcResult = ValidationRules.minOneDigit("1heLl*");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'noLeadingTrailingWhitespace' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.noLeadingTrailingWhitespace("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must not contain leading or trailing whitespace");
    });

    it("non-empty leading white space input returns validation error", () => {
        const funcResult = ValidationRules.noLeadingTrailingWhitespace(" hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must not contain leading or trailing whitespace");
    });

    it("non-empty trailing white space input returns validation error", () => {
        const funcResult = ValidationRules.noLeadingTrailingWhitespace("hello_world ");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must not contain leading or trailing whitespace");
    });

    it("non-empty mixed case input returns validation success", () => {
        const funcResult = ValidationRules.noLeadingTrailingWhitespace("1heLl*");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });

    it("non-empty white space in mix input returns validation success", () => {
        const funcResult = ValidationRules.noLeadingTrailingWhitespace("1h eLl*");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'noSpecialChar' validationRules", () => {
    it("empty input returns validation success", () => {
        const funcResult = ValidationRules.noSpecialChar("");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });

    it("mix input returns validation success", () => {
        const funcResult = ValidationRules.noSpecialChar("aoeuAOEU");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });

    it("non-empty one special char input returns validation error", () => {
        const funcResult = ValidationRules.noSpecialChar("hello$world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("No special characters allowed");
    });

    it("non-empty one number char input returns validation error", () => {
        const funcResult = ValidationRules.noSpecialChar("hello$wor1d");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("No special characters allowed");
    });
});

describe("Utils: 'minLength' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.minLength(1, "error")("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("error");
    });

    it("non-empty input returns validation error for length", () => {
        const funcResult = ValidationRules.minLength(6, "error")("input");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("error");
    });

    it("non-empty input returns validation success for the same length", () => {
        const funcResult = ValidationRules.minLength(5, "error")("input");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });

    it("non-empty input returns validation success for the same length", () => {
        const funcResult = ValidationRules.minLength(4, "error")("input");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });

    it("empty input returns validation success for zero length", () => {
        const funcResult = ValidationRules.minLength(0, "error")("");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'isProperEmail' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.isProperEmail("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain an '@' symbol separating local part and domain name");
    });

    it("non-empty no symbol input returns validation error", () => {
        const funcResult = ValidationRules.isProperEmail("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain an '@' symbol separating local part and domain name");
    });

    it("non-empty mixed case input returns validation success", () => {
        const funcResult = ValidationRules.isProperEmail("1he@Ll*");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'isEmailProperlyFormatted' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.isEmailProperlyFormatted("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must be properly formatted (e.g., user@example.com)");
    });

    it("non-empty input returns validation error", () => {
        const funcResult = ValidationRules.isEmailProperlyFormatted("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must be properly formatted (e.g., user@example.com)");
    });

    it("non-empty input with single @ returns validation error", () => {
        const funcResult = ValidationRules.isEmailProperlyFormatted("hello@world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must be properly formatted (e.g., user@example.com)");
    });

    it("non-empty input with single . returns validation error", () => {
        const funcResult = ValidationRules.isEmailProperlyFormatted("hello.world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must be properly formatted (e.g., user@example.com)");
    });

    it("non-empty mixed case, proper input returns validation success", () => {
        const funcResult = ValidationRules.isEmailProperlyFormatted("example@testx.com");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'isEmailWithDomain' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.isEmailWithDomain("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain a domain name (e.g., example.com)");
    });

    it("non-empty input returns validation error", () => {
        const funcResult = ValidationRules.isEmailWithDomain("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain a domain name (e.g., example.com)");
    });

    it("non-empty input with single @ returns validation error", () => {
        const funcResult = ValidationRules.isEmailWithDomain("hello@world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Must contain a domain name (e.g., example.com)");
    });

    it("non-empty input with single . returns validation error", () => {
        const funcResult = ValidationRules.isEmailWithDomain("hello.world");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });

    it("non-empty mixed case, proper input returns validation success", () => {
        const funcResult = ValidationRules.isEmailWithDomain("example@testx.com");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'zipCodeContainsFiveDigits' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.zipCodeContainsFiveDigits("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Zip code must be 5 digits");
    });

    it("non-empty no symbol input returns validation error", () => {
        const funcResult = ValidationRules.zipCodeContainsFiveDigits("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Zip code must be 5 digits");
    });

    it("non-empty one digit input returns validation error", () => {
        const funcResult = ValidationRules.zipCodeContainsFiveDigits("1");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Zip code must be 5 digits");
    });

    it("non-empty five digits mixed with letters input returns validation error", () => {
        const funcResult = ValidationRules.zipCodeContainsFiveDigits("12345ab");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Zip code must be 5 digits");
    });

    it("non-empty mixed case input returns validation success", () => {
        const funcResult = ValidationRules.zipCodeContainsFiveDigits("12345");

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});

describe("Utils: 'ageLimit' validationRules", () => {
    it("empty input returns validation error", () => {
        const funcResult = ValidationRules.ageLimit("");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("Required");
    });

    it("non-empty no symbol input returns validation error", () => {
        const funcResult = ValidationRules.ageLimit("hello_world");

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("You must be at least 13 years old.");
    });

    it("date input less than 13 years returns validation error", () => {
        const now = new Date();
        const queryDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());

        const funcResult = ValidationRules.ageLimit(queryDate.toISOString());

        expect(funcResult).toBeTypeOf("string");
        expect(funcResult).toEqual("You must be at least 13 years old.");
    });

    it("date input 13 years returns validation success", () => {
        const now = new Date();
        const queryDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());

        const funcResult = ValidationRules.ageLimit(queryDate.toISOString());

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });

    it("date input more than 13 years returns validation success", () => {
        const now = new Date();
        const queryDate = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate());

        const funcResult = ValidationRules.ageLimit(queryDate.toISOString());

        expect(funcResult).toBeTypeOf("boolean");
        expect(funcResult).toEqual(true);
    });
});
