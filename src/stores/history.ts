import type { GameRecord } from '@/model/GameRecord.js';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHistoryStore = defineStore('history', () => {
    const history = ref<GameRecord[]>([]);
    
    function pushEntry (entry : GameRecord)
    {
        history.value.push(entry);
    }
    
    return { history, pushEntry };
}, {
    persist: {
        storage: localStorage,
    },
});
