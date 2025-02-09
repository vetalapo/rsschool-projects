import { NewsApiResponse } from "../domain/NewsApiResponse";
import { NewsArticle } from "../domain/NewsArticle";
import { NewsSource } from "../domain/NewsSource";
import { News } from "./news/News";
import { Sources } from "./sources/Sources";

export class AppView {
    news: News;
    sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: NewsApiResponse): void {
        const values: NewsArticle[] = data.articles ?? [];
        this.news.draw(values);
    }

    drawSources(data: NewsApiResponse): void {
        const values: NewsSource[] = data.sources ?? [];
        this.sources.draw(values);
    }
}
