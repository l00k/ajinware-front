<script setup lang="ts">
import { GameLevel } from '@/model/GameOptions.js';
import { useHistoryStore } from '@/stores/history.js';
import { router } from '@/views/router.js';


const historyStore = useHistoryStore();

function entryDate (gameEntry : any)
{
    return new Date(gameEntry.date).toLocaleString();
}

function startGame (options : any)
{
    router.push({
        name: 'game',
        query: options,
    });
}
</script>

<template>
    <div class="menu">
        <div class="menu__pane">
            <div class="menu__label">{{ $t('menu.startGame.title') }}</div>

            <div class="btns">
                <button
                    v-for="(gameLevel, idx) in Object.values(GameLevel)"
                    :key="idx"
                    class="btn"
                    @click="() => startGame({ gameLevel })"
                >{{ $t('menu.gameLevel.' + gameLevel) }}
                </button>
            </div>
        </div>
        <div class="menu__pane">
            <div class="menu__label">{{ $t('menu.history.title') }}</div>
            <div class="menu__history">
                <div
                    v-for="(entry, idx) in historyStore.history"
                    :key="idx"
                    class="historyEntry"
                >
                    <div class="historyEntry__date">{{ entryDate(entry) }}</div>
                    <div class="historyEntry__details">
                        <div>{{ $t('menu.gameLevel.' + entry.level) }}</div>
                        <div>{{ $t('menu.history.moves') }}: {{ entry.moves }}</div>
                        <div>{{ $t('menu.history.elapsedTime') }}: {{ entry.elapsedTime }}</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.menu {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;

    justify-content: stretch;
    align-items: stretch;

    &__label {
        display: block;
        margin-bottom: 10px;

        font-size: 1.5em;
        font-weight: bold;
        color: #181818;
    }

    &__pane {
        display: flex;
        width: 50%;
        padding: 10px;

        flex-direction: column;
    }
}

.btns {
    display: flex;
    flex-direction: row;
}
.btn {
    display: block;
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #000000;
    border-radius: 4px;
    background-color: #ffffff;
    color: #000000;

    cursor: pointer;
}


.historyEntry {
    display: block;
    padding: 6px 0;
    border-bottom: solid 1px rgba(255, 255, 255, 0.5);

    &:last-child {
        border-bottom: none;
    }

    &__details {
        display: flex;
        flex-direction: row;

        & > div {
            margin-right: 20px;
        }
    }
}
</style>
