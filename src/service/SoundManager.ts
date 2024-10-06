import { Exception } from '@/utils/index.js';
import { LoadingState } from '@/service/LoadingState.js';
import { Howl } from 'howler';


const Sounds = {
    // blink: [ '/sounds/blink.mp3' ],
    // click: [ '/sounds/click.mp3' ],
    match: [ '/sounds/match.mp3' ],
    tileOpen: [ '/sounds/tile-open.mp3' ],
    clock: [ '/sounds/clock.mp3' ],
};

export type SoundKey = keyof typeof Sounds;


export class SoundManager
{
    
    /*
     * Singleton
     */
    protected static _singleton : SoundManager = null;
    
    protected constructor ()
    {}
    
    public static get () : SoundManager
    {
        if (!SoundManager._singleton) {
            SoundManager._singleton = new SoundManager();
        }
        return SoundManager._singleton;
    }
    
    
    /*
     * Owned data
     */
    protected _sounds : PartRecord<SoundKey, Howl> = {};
    
    protected _loadingState : LoadingState;
    
    
    public preload () : LoadingState
    {
        if (this._loadingState) {
            return this._loadingState;
        }
        
        this._loadingState = new LoadingState();
        
        for (const [ key, paths ] of Object.entries(Sounds)) {
            this._loadingState.pushTask(
                new Promise<void>((resolve, reject) => {
                    const sound = new Howl({
                        src: paths
                    });
                    
                    sound.once('load', () => {
                        this._sounds[key] = sound;
                        resolve();
                    });
                    sound.once('loaderror', reject);
                })
            );
        }
        
        return this._loadingState;
    }
    
    
    public get (soundKey : SoundKey) : Howl
    {
        if (!this._sounds[soundKey]) {
            throw new Exception(`Sound ${soundKey} not loaded`, 1703975681892);
        }
        
        return this._sounds[soundKey];
    }
    
    public play (
        soundKey : SoundKey,
        idx? : number
    ) : number
    {
        return this.get(soundKey).play(idx);
    }
    
}
