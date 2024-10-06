<script setup lang="ts">
import type { GameService } from '@/service/GameService.js';
import { SoundManager } from '@/service/SoundManager.js';
import { inject, onMounted, onUnmounted, ref } from 'vue';

const gameService : GameService = inject('gameService');
const soundManager : SoundManager = SoundManager.get();

const elapsedTime = ref(0);

let _timeUpdateInterval : any;
onMounted(() => {
    _timeUpdateInterval = setInterval(() => {
        elapsedTime.value = gameService.elapsedTime;

        if (
            elapsedTime.value % 10 == 0
        ) {
            soundManager.get('clock')
                .fade(0.5, 0.1, 3000)
                .play()
            ;
        }
    }, 1000);
});
onUnmounted(() => {
    if (_timeUpdateInterval) {
        clearInterval(_timeUpdateInterval);
    }
});
</script>

<template>
    <div class="uiBar">
        <div>
            {{ $t('uiBar.score') }}: {{ gameService.score }}
        </div>
        <div>
            {{ $t('uiBar.time') }}: {{ elapsedTime }}
        </div>
        <div>
            {{ $t('uiBar.moves') }}: {{ gameService.moves }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.uiBar {
    flex: 0 0 50px;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    align-items: center;

    color: #ff780e;
    font-weight: bold;
    font-size: 2em;

    text-shadow: 0 0 5px #000, 0 0 5px #000;
}
</style>
