/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
**/
import vuetify from "./vuetify";
import pinia from "@/store";
import router from "@/router";

import type { App } from "vue";

export function registerPlugins(app: App) {
    app
        .use(pinia)
        .use(router)
        .use(vuetify)
};
