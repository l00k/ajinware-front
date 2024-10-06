import GameView from '@/views/GameView.vue';
import MenuView from '@/views/MenuView.vue';
import { createMemoryHistory, createRouter } from 'vue-router';

const routes = [
    {
        name: 'menu',
        path: '/',
        component: MenuView
    },
    {
        name: 'game',
        path: '/game',
        component: GameView,
        props: (route) => route.query
    },
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
});
