import type { DateOfBirthFormat } from "@/types";

export function formatDateOfBirth(date: Date | null): DateOfBirthFormat {
    const result: DateOfBirthFormat = {
        serviceFormat: "",
        uiFormat: ""
    };

    if (!date) {
        return result;
    }

    const year = date.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    result.serviceFormat = `${year}-${month}-${day}`;
    result.uiFormat = `${year}/${month}/${day}`;

    return result;
}
