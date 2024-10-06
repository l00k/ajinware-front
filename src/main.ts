import { loadI18nMessages } from '@/vue/i18n/index.js';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import * as VueI18n from 'vue-i18n';
import App from './App.vue';
import { router } from './views/router.js';

const app = createApp(App);

// setup pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);

// setup i18n
const i18n = VueI18n.createI18n({
    locale: navigator.language,
    fallbackLocale: 'en',
    messages: await loadI18nMessages([ 'pl', 'en' ]),
});

app.use(i18n);

// setup router
app.use(router);

// mount app
app.mount('#app');
