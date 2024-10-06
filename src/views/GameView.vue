<script setup lang="ts">
import Board from '@/components/Board.vue';
import GameEndPopup from '@/components/GameEndPopup.vue';
import UiBar from '@/components/UiBar.vue';
import { GameService } from '@/service/GameService.js';
import { provide, reactive } from 'vue';

const props = defineProps({
    gameLevel: { type: String, required: true },
});

const gameService = reactive(
    new GameService({ gameLevel: <any>props.gameLevel })
);

provide('gameService', gameService);
</script>

<template>
    <div class="game">
        <UiBar />
        <Board />

        <GameEndPopup
            v-if="gameService.isGameEnd"
        />
    </div>
</template>

<style scoped lang="scss">
.game {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;

    justify-content: stretch;
    align-items: stretch;
}
</style>
