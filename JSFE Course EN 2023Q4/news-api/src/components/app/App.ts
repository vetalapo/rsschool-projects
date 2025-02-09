import { AppController } from "../controller/Controller";
import { NewsApiResponse } from "../domain/NewsApiResponse";
import { AppView } from "../view/AppView";

export class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start(): void {
        const sourcesElement: Element | null = document.querySelector(".sources");

        if (sourcesElement) {
            sourcesElement.addEventListener("click", (e: Event): void => {
                this.controller.getNews(e, (data: NewsApiResponse): void => this.view.drawNews(data));
            });
        }

        this.controller.getSources((data: NewsApiResponse): void => {
            this.controller.sourcesList = data.sources;
            this.view.drawSources(data);
        });
    }
}
