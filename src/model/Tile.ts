export class Tile
{
    
    public id : number;
    public rarity : number = 0;
    public isInteractive : boolean = true;
    public isOpen : boolean = false;
    
    
    public constructor (props : Partial<Tile> = {})
    {
        Object.assign(this, props);
    }
    
}
