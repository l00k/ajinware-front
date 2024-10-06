<script setup lang="ts">


</script>

<template>
    <div class="gameEndPopup">
        {{ $t('game.won') }}
    </div>
</template>

<style scoped lang="scss">
.gameEndPopup {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 10;

    display: flex;
    width: 60%;
    height: 60%;
    justify-content: center;
    align-items: center;

    transform: translate(-50%, -50%);

    color: #fff;
    font-weight: bold;
    font-size: 4em;
    text-shadow: 0 0 5px #000000, 0 0 5px #000000;

    background-color: rgba(0,0,0, 0.5);
    border-radius: 10px;
}
</style>
