import type { GameLevel } from '@/model/GameOptions.js';

export type GameRecord = {
    level : GameLevel,
    moves : number,
    elapsedTime : number,
    date : number,
}
