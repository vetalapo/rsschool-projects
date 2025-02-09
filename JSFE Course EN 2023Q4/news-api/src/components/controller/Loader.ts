import { NewsApiQuery } from "../domain/NewsApiQuery";
import { NewsApiResponse } from "../domain/NewsApiResponse";
import { RequestMethod, StatusCode } from "../domain/enums";

export class Loader {
    constructor(
        private baseLink: string,
        private options: Readonly<NewsApiQuery>
    ) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        { endpoint, options }: { endpoint: string; options?: object },
        callback: (data: NewsApiResponse) => void
    ): void {
        this.load(RequestMethod.GET, endpoint, callback, options);
    }

    errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === StatusCode.UNAUTHORIZED || res.status === StatusCode.NOT_FOUND) {
                console.error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            }

            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(options: object, endpoint: string): string {
        const urlOptions: { [key: string]: string } = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key): void => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    load(
        method: RequestMethod,
        endpoint: string,
        callback: (data: NewsApiResponse) => void,
        options: object = {}
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res: Response): Promise<NewsApiResponse> => res.json())
            .then((data): void => {
                if (callback) {
                    callback(data);
                } else {
                    console.error("No callback for GET response");
                }
            })
            .catch((err: Error): void => console.error(err));
    }
}
