import { Exception } from '@/utils/index.js';

enum EventId
{
    Error = 'Error',
    Progress = 'Progress',
    Loaded = 'Loaded',
}

type OnLoadCb = (state? : LoadingState) => void;

type Task<T = any> = Promise<T>;

export class LoadingState
{
    
    protected _listeners : Record<EventId, AnyFn[]> = {
        [EventId.Error]: [],
        [EventId.Progress]: [],
        [EventId.Loaded]: [],
    };
    
    protected _done : boolean = false;
    
    protected _tasks : Promise<any>[] = [];
    protected _loadedNum : number = 0;
    
    
    public get progress () : number
    {
        if (!this._tasks.length) {
            return 1;
        }
        
        return this._loadedNum / this._tasks.length;
    }
    
    
    public static combine (...states : LoadingState[])
    {
        const newState = new LoadingState();
        
        for (const child of states) {
            for (const task of child._tasks) {
                newState.pushTask(task);
            }
        }
        
        return newState;
    }
    
    
    
    public pushTask (task : Task)
    {
        if (this._done) {
            throw new Exception('Can\'t push further tasks. Loading done.', 1703981565871);
        }
        
        this._tasks.push(task);
        
        task.then(result => this._triggerLoaded(task, result));
        task.catch(result => this._triggerError(task, result));
    }
    
    public async waitAll ()
    {
        return Promise.all(this._tasks);
    }
    
    public async waitAllSettled ()
    {
        return Promise.allSettled(this._tasks);
    }
    
    public _triggerLoaded<T> (
        task : Task<T>,
        result : T,
    )
    {
        if (this._done) {
            return;
        }
        
        ++this._loadedNum;
        
        for (const listener of this._listeners[EventId.Progress]) {
            listener(task, result);
        }
        
        const isFullyLoaded = this._loadedNum == this._tasks.length;
        if (isFullyLoaded) {
            for (const listener of this._listeners[EventId.Loaded]) {
                listener(task, result);
            }
            
            this._done = true;
        }
    }
    
    public _triggerError (
        task : Task,
        result : any,
    )
    {
        this._done = true;
        
        for (const listener of this._listeners[EventId.Error]) {
            listener(task, result);
        }
    }
    
    
    public onError (cb : OnLoadCb)
    {
        this._listeners[EventId.Error].push(cb);
    }
    
    public onProgress (cb : OnLoadCb)
    {
        this._listeners[EventId.Progress].push(cb);
    }
    
    public onLoaded (cb : OnLoadCb)
    {
        this._listeners[EventId.Loaded].push(cb);
    }
    
}
