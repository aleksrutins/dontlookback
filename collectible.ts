import * as platinum from 'platinum';
import { Player } from "./player.ts";
import Component      = platinum.ecs.Component;
import RenderSystem2D = platinum.s2d.RenderSystem2D;
import CollisionBox2D = platinum.s2d.CollisionBox2D;

export class Collectible extends Component<RenderSystem2D> {
    constructor(private player: Player) {
        super();
    }
    canUse(system: platinum.ecs.System): system is platinum.s2d.RenderSystem2D {
        return system instanceof RenderSystem2D;
    }
    init(system: platinum.s2d.RenderSystem2D): void {
        
    }
    update(system: platinum.s2d.RenderSystem2D): void {
        if(!this.hasComponent(CollisionBox2D)) return;
        if(this.getComponent(CollisionBox2D)!.overlaps(this.player.getComponent(CollisionBox2D)!)) {
            this.player.speed += 0.2;
            console.log("[collectible]", this.player.speed);
            this.entity!.detachAll(CollisionBox2D);
        }
    }
}