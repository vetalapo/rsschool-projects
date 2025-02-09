import { Category, Country, Language } from "./enums";

export interface NewsSource {
    id: string;
    name: string;
    description?: string;
    url?: string;
    category?: Category;
    language?: Language;
    country?: Country;
}
