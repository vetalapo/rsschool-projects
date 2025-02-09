export class ValidationRules {
    static required = (value: string): string | boolean =>
        !!value || "Required";

    static minOneLowerCase = (value: string): string | boolean =>
        /(?=.*[a-z])/.test(value) || "Must contain at least one lowercase letter";

    static minOneUpperCase = (value: string): string | boolean =>
        /(?=.*[A-Z])/.test(value) || "Must contain at least one UPPERCASE letter";

    static minOneSpecialChar = (value: string): string | boolean =>
        /(?=.*\W)/.test(value) || "Must contain at least one special character";

    static minOneDigit = (value: string): string | boolean =>
        /(?=.*[0-9])/.test(value) || "Must contain at least one digit from 1 to 9";

    static noLeadingTrailingWhitespace = (value: string): string | boolean =>
        /^(?! ).*[^ ]$/.test(value) || "Must not contain leading or trailing whitespace";

    static noSpecialChar = (value: string) => /^[a-zA-Z\s]*$/.test(value) || "No special characters allowed";

    static minLength = (minLength: number, message: string) => (value: string) => value.length >= minLength || message;

    static isProperEmail = (value: string): string | boolean =>
        /@/.test(value) || "Must contain an '@' symbol separating local part and domain name";

    static isEmailProperlyFormatted = (value: string): string | boolean =>
        /[^\s@]+@[^\s@]+\.[^\s@]/.test(value) || "Must be properly formatted (e.g., user@example.com)";

    static isEmailWithDomain = (value: string): string | boolean =>
        /[^\s@]+\.[^\s@]/.test(value) || "Must contain a domain name (e.g., example.com)";

    static zipCodeContainsFiveDigits = (value: string) => /^\d{5}$/.test(value) || "Zip code must be 5 digits";

    static ageLimit = (value: string) => {
        if (!value) {
            return "Required";
        }

        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 13 || "You must be at least 13 years old.";
    };
}
