import { NewsSource } from "../../domain/NewsSource";
import "./sources.css";

export class Sources {
    draw(data: NewsSource[]): void {
        const fragment: DocumentFragment = document.createDocumentFragment();

        const sourceItemTemp: Template = document.querySelector("#sourceItemTemp");
        if (!sourceItemTemp) {
            throw new Error("Element #sourceItemTemp is missing");
        }

        this.createSourceItem(fragment, sourceItemTemp, { id: "all", name: "All" });

        data.forEach((item: NewsSource): void => {
            this.createSourceItem(fragment, sourceItemTemp, item);
        });

        const sources: Template = document.querySelector(".sources");
        if (sources) {
            sources.append(fragment);
        }
    }

    private createSourceItem(
        parent: DocumentFragment,
        template: HTMLTemplateElement,
        item: Pick<NewsSource, "id" | "name">
    ): void {
        const clone: Template = template.content.cloneNode(true) as HTMLTemplateElement;

        if (!clone) {
            return;
        }

        const nameElement: Template = clone.querySelector(".source__item-name");
        if (nameElement) {
            nameElement.textContent = item.name;
        }

        const itemElement: Template = clone.querySelector(".source__item");
        if (itemElement) {
            itemElement.setAttribute("data-source-id", item.id);
        }

        parent.append(clone);
    }
}

type Template = HTMLTemplateElement | null;
