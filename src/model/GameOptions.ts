export enum GameLevel
{
    Easy = 'easy',
    Normal = 'normal',
    Hard = 'hard',
    Nightmare = 'nightmare',
}

export type GameOptions = {
    gameLevel : GameLevel;
}
