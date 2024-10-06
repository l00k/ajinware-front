import { GameLevel } from '@/model/GameOptions.js';
import type { GameOptions } from '@/model/GameOptions.js';
import { Tile } from '@/model/Tile.js';
import { SoundManager } from '@/service/SoundManager.js';
import { useHistoryStore } from '@/stores/history.js';
import { Exception } from '@/utils/index.js';
import { router } from '@/views/router.js';
import { shuffle } from 'lodash-es';


const soundManager : SoundManager = SoundManager.get();

type GameConfig = {
    pairsNumber : number,
}

enum TurnStage
{
    First = 'first',
    Second = 'second',
    Off = 'off',
}

export class GameService
{
    
    protected static readonly MAX_ID : number = 20;
    protected static readonly GAME_CONFIG_MAP : Record<GameLevel, GameConfig> = {
        [GameLevel.Easy]: {
            pairsNumber: 6,
        },
        [GameLevel.Normal]: {
            pairsNumber: 9,
        },
        [GameLevel.Hard]: {
            pairsNumber: 12,
        },
        [GameLevel.Nightmare]: {
            pairsNumber: 15,
        },
    };
    
    
    public gameLevel : GameLevel;
    public pairsNumber : number = 0;
    
    public score : number = 0;
    public moves : number = 0;
    public startTime : number = 0;
    
    public tiles : Tile[] = [];
    
    public turnStage : TurnStage = TurnStage.First;
    protected _selection : Tile[] = [];
    
    public isGameEnd : boolean = false;
    
    
    public get elapsedTime () : number
    {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }
    
    public get isTurnOn () : boolean
    {
        return this.turnStage !== TurnStage.Off;
    }
    
    
    public constructor (options : GameOptions)
    {
        this.startTime = Date.now();
        
        const gameConfig = GameService.GAME_CONFIG_MAP[options.gameLevel];
        if (!gameConfig) {
            throw new Exception('Unknown game level', 1728031248984);
        }
        
        this.gameLevel = options.gameLevel;
        this.pairsNumber = gameConfig.pairsNumber;
        
        const tiles = this._generateTiles(gameConfig.pairsNumber);
        this.tiles = shuffle(tiles);
    }
    
    protected _generateTiles (pairsNumber : number) : Tile[]
    {
        const tiles : Tile[] = [];
        
        for (let i = 0; i < pairsNumber; i++) {
            const tileData : Partial<Tile> = {
                id: 1 + i,
                rarity: i % 8,
            };
            
            tiles.push(new Tile(tileData));
            tiles.push(new Tile(tileData));
        }
        
        return tiles;
    }
    
    
    public toggleTile (tile : Tile)
    {
        if (
            !this.isTurnOn
            || !tile.isInteractive
        ) {
            return;
        }
        
        tile.isOpen = !tile.isOpen;
        tile.isInteractive = false;
        
        this._selection.push(tile);
        
        soundManager.play('tileOpen');
        
        // add some delay
        const currentStage = this.turnStage;
        
        this.turnStage = TurnStage.Off;
        setTimeout(() => {
            if (currentStage === TurnStage.First) {
                this.turnStage = TurnStage.Second;
            }
            else if (currentStage === TurnStage.Second) {
                this._checkSelection();
            }
        }, 50);
    }
    
    protected _checkSelection ()
    {
        const [ firstTile, secondTile ] = this._selection;
        
        if (firstTile.id === secondTile.id) {
            ++this.score;
            
            soundManager.play('match');
        }
        else {
            firstTile.isInteractive = true;
            firstTile.isOpen = false;
            secondTile.isInteractive = true;
            secondTile.isOpen = false;
        }
        
        this.moves++;
        this._selection = [];
        
        if (this.score === this.pairsNumber) {
            this.turnStage = TurnStage.Off;
            this.isGameEnd = true;
            
            const history = useHistoryStore();
            history.pushEntry({
                date: Date.now(),
                level: this.gameLevel,
                elapsedTime: this.elapsedTime,
                moves: this.moves,
            });
            
            setTimeout(() => {
                router.push({ name: 'menu' });
            }, 3000);
        }
        else {
            this.turnStage = TurnStage.First;
        }
    }
    
}
