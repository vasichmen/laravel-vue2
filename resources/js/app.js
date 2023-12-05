/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import App from './app.vue';
import router from './routes';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import Router from 'vue-router';
import store from './store';

import ApiClient from "./api/ApiClient.js";

/**
 * Next, we will create a fresh Vue application instance. You may then begin
 * registering components with the application instance so they are ready
 * to use in your application's views. An example is included for you.
 */


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// Object.entries(import.meta.glob('./**/*.vue', { eager: true })).forEach(([path, definition]) => {
//     app.component(path.split('/').pop().replace(/\.\w+$/, ''), definition.default);
// });

/**
 * Finally, we will attach the application instance to a HTML element with
 * an "id" attribute of "app". This element is included with the "auth"
 * scaffolding. Otherwise, you will need to add an element yourself.
 */


//регистрация метода обновления токена
ApiClient.registerRefreshTokenAction(() => {
    const refreshToken = VueCookies.get('refresh_token');
    return store.dispatch('auth/authRefresh', refreshToken);
});

//регистрация обработчика ошибки обновления токена
ApiClient.registerRefreshTokenErrorHandler(async () => {
    await store.dispatch('auth/authLogout');
});

// Делаем запрос на токен, всегда. Если токен не валидный, то руты, где прописан мидлвар на обязательную аунтификацию,
// сделает редирект на главную, и откроет модалку с авторизацией
//store.dispatch('auth/authCheckAuth');

(async () => {
    await store.dispatch('auth/authCheckAuth');
})();


export const vueApp = new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount('#app');
