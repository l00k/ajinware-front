<script setup lang="ts">
import { Tile } from '@/model/Tile.js';
import type { GameService } from '@/service/GameService.js';
import { SoundManager } from '@/service/SoundManager.js';
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';

const gameService : GameService = inject('gameService');
const soundManager : SoundManager = SoundManager.get();

const props = defineProps({
    tile: { type: Tile, required: true },
});

const canvasRef = ref<HTMLCanvasElement>(null);

// display params
const isOpen = ref(props.tile.isOpen);
const animation = ref('no');



let _animationEndTimeout : any;
watch(() => props.tile.isOpen, (newValue) => {
    clearTimeout(_animationEndTimeout);

    isOpen.value = newValue;

    animation.value = isOpen.value ? 'opening' : 'closing';

    _animationEndTimeout = setTimeout(() => {
        animation.value = 'no';
    }, 1000);
});


function onClick ()
{
    gameService.toggleTile(props.tile);
}


const rarityColors = {
    0: '#ffffff',
    1: '#4b69ff',
    2: '#8847ff',
    3: '#d32ce6',
    4: '#ff4b4b',
    5: '#ffd32c',
    6: '#ffd700',
    7: '#ff8c00',
};


const tileImage = new Image();

// paralax effect vars
const tilePos = { x: 0, y: 0 };
const cursorPos = { x: 0, y: 0 };


function drawTile ()
{
    if (!canvasRef.value) {
        return;
    }

    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) {
        return;
    }

    // fill with gradient
    const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 75);

    gradient.addColorStop(0, rarityColors[props.tile.rarity]);
    gradient.addColorStop(1, '#000000');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);

    // draw image with offset (paralax)
    const offsetX = (tilePos.x - cursorPos.x) / window.innerWidth * 20;
    const offsetY = (tilePos.y - cursorPos.y) / window.innerHeight * 20;

    const height = tileImage.height * 100 / tileImage.width;
    const x = -offsetX;
    const y = (100 - height) / 2 - offsetY;

    ctx.drawImage(tileImage, x, y, 100, height);
}

let _debounceTimeout : any;

function onMouseMove (event : MouseEvent)
{
    cursorPos.x = event.clientX;
    cursorPos.y = event.clientY;

    // debounced redraw
    clearTimeout(_debounceTimeout);
    _debounceTimeout = setTimeout(() => {
        drawTile();
    }, 5);
}

function onResize ()
{
    const boundaryRect = canvasRef.value.getBoundingClientRect();
    tilePos.x = boundaryRect.left + boundaryRect.width / 2;
    tilePos.y = boundaryRect.top + boundaryRect.height / 2;
}


onMounted(() => {
    tileImage.src = `/imgs/tiles/${props.tile.id}.png`;

    onResize();

    drawTile();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
});

onUnmounted(() => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
});
</script>

<template>
    <div
        class="tile"
        :class="{
            ['tile--open']: isOpen === true,
            ['tile--' + animation]: true,
            'tile--interactive': props.tile.isInteractive
        }"
        @click="onClick"
    >
        <div class="tile__face tile__face--front">
            <canvas
                ref="canvasRef"
                width="100"
                height="100"
            />
        </div>
        <div class="tile__face tile__face--back">
            <div class="tileBack" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@keyframes TileOpen {
    0% {
        transform: rotateY(-180deg) scale(1.0);
    }
    20% {
        transform: rotateY(-180deg) scale(1.25);
    }
    80% {
        transform: rotateY(0) scale(1.25);
    }
    100% {
        transform: rotateY(0) scale(1.0);
    }
}
@keyframes TileClose {
    0% {
        transform: rotateY(0) scale(1.0);
    }
    20% {
        transform: rotateY(0) scale(1.25);
    }
    80% {
        transform: rotateY(-180deg) scale(1.25);
    }
    100% {
        transform: rotateY(-180deg) scale(1.0);
    }
}

.tile {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;

    border-radius: 4px;

    transform-origin: center;
    transform-style: preserve-3d;
    transform: rotateY(-180deg) scale(1.0);

    transition: transform 1.0s;

    &--interactive {
        cursor: pointer;
    }

    &__face {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;

        backface-visibility: hidden;

        border: solid 1px rgba(0, 0, 0, 1.0);
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 1.0);

        &--front {
            background-color: #000000;
        }

        &--back {
            transform: rotateY(-180deg);
            background: url('@/assets/imgs/tile-back.png') no-repeat center center;
            background-size: cover;
        }
    }

    &:hover {
        &--open {
            transform: rotateY(0) scale(1.0);
        }
        &--close {
            transform: rotateY(-180deg) scale(1.0);
        }
    }

    &--open {
        transform: rotateY(0) scale(1.0);
    }

    &--opening {
        z-index: 1;
        animation: TileOpen 1s ease-in-out;
    }
    &--closing {
        z-index: 1;
        animation: TileClose 1s ease-in-out;
    }

    canvas {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>
