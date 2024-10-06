import { AssetsRegistry } from '@/assets/assets-registry.js';
import { LoadingState } from '@/service/LoadingState.js';


export class AssetPreloader
{
    
    /*
     * Singleton
     */
    protected static _singleton : AssetPreloader = null;
    
    protected constructor ()
    {}
    
    public static get () : AssetPreloader
    {
        if (!AssetPreloader._singleton) {
            AssetPreloader._singleton = new AssetPreloader();
        }
        return AssetPreloader._singleton;
    }
    
    
    /*
     * Owned data
     */
    protected _loadingState : LoadingState;
    
    
    public preload () : LoadingState
    {
        if (this._loadingState) {
            return this._loadingState;
        }
        
        this._loadingState = new LoadingState();
        
        for (const path of Object.values(AssetsRegistry)) {
            this._loadingState.pushTask(
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = path;
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            );
        }
        
        return this._loadingState;
    }
    
}
