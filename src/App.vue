<script setup lang="ts">
import { AssetPreloader } from '@/service/AssetPreloader.js';
import { LoadingState } from '@/service/LoadingState.js';
import { SoundManager } from '@/service/SoundManager.js';
import LoadingView from '@/views/LoadingView.vue';
import { onMounted, onUnmounted, ref } from 'vue';

let paralaxBgEl : HTMLElement = null;
const paralaxFgRef = ref<HTMLElement>(null);

const isLoaded = ref(false);

// preload assets
const gfxLoader = AssetPreloader.get().preload();
const sfxLoader = SoundManager.get().preload();

// mouse move paralax effect
const cursorPos = { x: 0, y: 0 };

let _debounceTimeout : any;

function onMouseMove (event : MouseEvent)
{
    cursorPos.x = event.clientX;
    cursorPos.y = event.clientY;

    // debounced redraw
    clearTimeout(_debounceTimeout);
    _debounceTimeout = setTimeout(() => {
        applyParalaxEffect();
    }, 5);
}

function applyParalaxEffect ()
{
    if (!paralaxBgEl || !paralaxFgRef.value) {
        return;
    }

    const offsetX = (cursorPos.x / window.innerWidth - 0.5);
    const offsetY = (cursorPos.y / window.innerHeight - 0.5);

    // background
    {
        const translateX = offsetX * 10;
        const translateY = offsetY * 10;

        paralaxBgEl.style.backgroundPosition = `${translateX}px ${translateY}px`;
    }

    // foreground
    {
        const translateX = offsetX * 30;
        const translateY = offsetY * 30;

        paralaxFgRef.value.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
}


onMounted(() => {
    const combinedLoader = LoadingState.combine(gfxLoader, sfxLoader);
    combinedLoader.onLoaded(() => {
        isLoaded.value = true;
    });

    paralaxBgEl = document.getElementById('paralaxBg');

    window.addEventListener('mousemove', onMouseMove);
});

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove);
});
</script>

<template>
    <div id="viewport">
        <div
            ref="paralaxFgRef"
            id="paralaxFg"
        />

        <LoadingView v-if="!isLoaded" />
        <RouterView v-else />
    </div>
</template>

<style lang="scss">
@import '@/assets/scss/globals';
</style>
<style scoped lang="scss">
#paralaxFg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;

    display: block;
    width: 100%;
    height: 100%;

    background-image: url('@/assets/imgs/fg.jpeg');
    background-size: auto 125%;
    background-position: center;
    background-repeat: no-repeat;

    opacity: 0.5;
    border-radius: 10px;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}
</style>
