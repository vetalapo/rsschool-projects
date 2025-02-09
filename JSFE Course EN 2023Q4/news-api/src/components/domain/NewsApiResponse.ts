import { NewsArticle } from "./NewsArticle";
import { NewsSource } from "./NewsSource";

export type NewsApiResponse = { articles?: NewsArticle[]; sources?: NewsSource[] };
