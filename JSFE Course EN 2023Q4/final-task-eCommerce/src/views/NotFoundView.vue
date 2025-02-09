<template>
    <v-layout class="not-found-container d-flex justify-center align-center">
        <v-card class="text-center not-found-card pa-10 rounded-lg">
            <h1 class="font-weight-light">404</h1>
            <h2>Page not found</h2>
            <div class="pa-2 ma-2">
                <p>We searched high and low but</p>
                <p>couldn’t find what you’re looking for.</p>
                <p>Let’s find a better place for you to go.</p>
            </div>
            <v-btn
                to="/"
                size="large"
                color="teal-darken-1 text-white text-decoration-none"
                class="pa-2 ma-10"
                elevated
            >
                Go to Home page
            </v-btn>
        </v-card>
    </v-layout>
</template>

<style scoped>
    .not-found-container {
        background: url("../assets/img/notFound.png");
        min-width: 100vw;
        min-height: 100vh;
        background-size: cover;
    }

    .not-found-card {
        background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
    }

    h1 {
        color: var(--border);
        font-size: 12em;
    }
</style>
