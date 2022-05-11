import { CollisionBox2D, RenderSystem2D } from "@platinum-ge/2d";
import { Component, System } from "@platinum-ge/core";
import { Player } from "./player";

export class Collectible extends Component<RenderSystem2D> {
    constructor(private player: Player) {
        super();
    }
    canUse(system: System): system is RenderSystem2D {
        return system instanceof RenderSystem2D;
    }
    init(system: RenderSystem2D): void {
        
    }
    update(system: RenderSystem2D): void {
        if(!this.hasComponent(CollisionBox2D)) return;
        if(this.getComponent(CollisionBox2D)!.overlaps(this.player.getComponent(CollisionBox2D)!)) {
            this.player.speed += 0.2;
            console.log("[collectible]", this.player.speed);
            this.entity!.detachAll(CollisionBox2D);
            system.game?.remove(this.entity!);
        }
    }
}