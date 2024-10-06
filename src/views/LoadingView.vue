<script setup lang="ts">
import { AssetPreloader } from '@/service/AssetPreloader.js';
import { LoadingState } from '@/service/LoadingState.js';
import { SoundManager } from '@/service/SoundManager.js';
import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';

const containerRef : Ref<HTMLElement> = ref(null);
const progress : Ref<string> = ref('0.0%');

onMounted(async() => {
    const gfxLoader = AssetPreloader.get().preload();
    const sfxLoader = SoundManager.get().preload();

    const combinedLoader = LoadingState.combine(gfxLoader, sfxLoader);

    combinedLoader.onProgress(() => {
        if (containerRef.value) {
            const shadow = (1 - combinedLoader.progress) * 300;
            containerRef.value.style.boxShadow = `inset 0 0 ${shadow}px #000, inset 0 0 ${shadow}px #000`;
            progress.value = (combinedLoader.progress * 100).toFixed(1) + '%';
        }
    });
});
</script>

<template>
    <div
        ref="containerRef"
        class="container"
    >
        <div class="loadingBlock">
            <h1 class="title">Loading</h1>
            <div>
                <p>loading assets {{ progress }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    flex: 1 0 100%;
    display: flex;
    width: 100%;
    height: 100%;

    justify-content: center;
    align-items: center;
}

.loadingBlock {
    display: inline-block;
    width: 200px;

    text-align: center;
    font-family: $fancy-font;
}

.title {
    display: block;
    margin-bottom: 10px;
    font-size: 40px;
    @include text-shadow-lg();
}
</style>
