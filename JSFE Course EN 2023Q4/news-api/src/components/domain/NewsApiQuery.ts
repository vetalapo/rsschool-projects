import { Category, Country, Language } from "./enums";

export interface NewsApiQuery {
    apiKey: string;
    category?: Category;
    language?: Language;
    country?: Country;
}
