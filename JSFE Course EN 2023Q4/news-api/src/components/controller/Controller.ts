import { NewsApiResponse } from "../domain/NewsApiResponse";
import { NewsSource } from "../domain/NewsSource";
import { AppLoader } from "./AppLoader";

export class AppController extends AppLoader {
    sourcesList?: NewsSource[];

    getSources(callback: (data: NewsApiResponse) => void): void {
        super.getResp({ endpoint: "sources" }, callback);
    }

    getNews(e: Event, callback: (data: NewsApiResponse) => void): void {
        let target: EventTarget | null = e.target;
        const newsContainer: EventTarget | null = e.currentTarget;

        const getResp = (list: string): void => {
            super.getResp({ endpoint: "everything", options: { sources: list } }, callback);
        };

        if (!(target instanceof HTMLElement && newsContainer instanceof HTMLElement)) {
            return;
        }

        while (target !== newsContainer) {
            if (target instanceof HTMLElement && target.classList.contains("source__item")) {
                const sourceId: string | null = target.getAttribute("data-source-id");

                if (sourceId && newsContainer.getAttribute("data-source") !== sourceId) {
                    newsContainer.setAttribute("data-source", sourceId);

                    if (sourceId === "all" && this.sourcesList) {
                        const list: string = this.getRandomElements<NewsSource>(this.sourcesList, 20)
                            .reduce((acc: string, item: NewsSource): string => {
                                return `${acc + item.id},`;
                            }, "")
                            .slice(0, -1);

                        getResp(list);
                    } else {
                        getResp(sourceId);
                    }
                }

                return;
            }

            if (target instanceof HTMLElement) {
                target = target.parentNode;
            }
        }
    }

    private getRandomElements<T>(array: T[], size: number): T[] {
        const result: T[] = [...array];
        while (result.length > size) {
            result.splice(Math.floor(Math.random() * result.length), 1);
        }
        return result;
    }
}
