import "./news.css";
import ImgPlaceholder from "../../../assets/image-placeholder.png";
import { NewsArticle } from "../../domain/NewsArticle";

export class News {
    draw(data: NewsArticle[]): void {
        const news: NewsArticle[] = data.length >= 10 ? data.filter((_, idx: number): boolean => idx < 10) : data;
        const fragment: DocumentFragment = document.createDocumentFragment();

        const newsItemTemp: HTMLTemplateElement | null = document.querySelector("#newsItemTemp");
        if (!newsItemTemp) {
            throw new Error("Element #newsItemTemp is missing");
        }

        news.forEach((item: Required<NewsArticle>, idx: number): void => {
            const newsClone: HTMLTemplateElement = newsItemTemp.content.cloneNode(true) as HTMLTemplateElement;
            if (!newsClone) {
                return;
            }

            const setTextContent = (selector: string, textContent: string): void => {
                const element: HTMLTemplateElement | null = newsClone.querySelector(selector);
                if (!element) {
                    throw new Error(`Element ${selector} is missing`);
                }

                element.textContent = textContent;
            };

            if (idx % 2) {
                newsClone.querySelector(".news__item")?.classList.add("alt");
            }

            const metaPhoto: HTMLTemplateElement | null = newsClone.querySelector(".news__meta-photo");
            if (metaPhoto) {
                metaPhoto.style.backgroundImage = `url(${item.urlToImage || ImgPlaceholder})`;
            }

            setTextContent(".news__meta-author", item.author || item.source.name);
            setTextContent(".news__meta-date", item.publishedAt.slice(0, 10).split("-").reverse().join("-"));
            setTextContent(".news__description-title", item.title);
            setTextContent(".news__description-source", item.source.name);
            setTextContent(".news__description-content", item.description);

            const readMoreAnchor: HTMLTemplateElement | null = newsClone.querySelector(".news__read-more a");
            if (readMoreAnchor) {
                readMoreAnchor.setAttribute("href", item.url);
            }

            fragment.append(newsClone);
        });

        const newsElement: HTMLTemplateElement | null = document.querySelector(".news");
        if (newsElement) {
            newsElement.innerHTML = "";
            newsElement.appendChild(fragment);
            newsElement.scrollIntoView(true);
        }
    }
}
