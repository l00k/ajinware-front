<script setup lang="ts">
import Tile from '@/components/Tile.vue';
import type { GameService } from '@/service/GameService.js';
import { onMounted , ref , computed , inject } from 'vue';

const gameService : GameService = inject('gameService');
</script>

<template>
    <div class="board">
        <div class="slots">
            <div
                v-for="(tile, idx) in gameService.tiles"
                :key="idx"
                class="slot"
            >
                <Tile :tile="tile" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.board {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

.slots {
    flex: 1 0 auto;
    display: grid;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    grid-gap: 10px;
    grid-template-columns: repeat(6, 100px);
}

.slot {
    position: relative;
    display: flex;
    width: 100px;
    height: 100px;
}

@media (max-width: 768px) or (max-height: 768px) {
    .slots {
        grid-gap: 5px;
        grid-template-columns: repeat(6, 75px);
    }

    .slot {
        margin: 3px;
        width: 75px;
        height: 75px;
    }
}
@media (max-width: 480px) or (max-height: 480px) {
    .slots {
        grid-gap: 5px;
        grid-template-columns: repeat(4, 75px);
    }

    .slot {
        margin: 3px;
        width: 75px;
        height: 75px;
    }
}
</style>
