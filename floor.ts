import { Camera2D } from "platinum/2d/Camera2D.ts";
import { RenderSystem2D } from "platinum/2d/RenderSystem2D.ts";
import { Transform2D } from "platinum/2d/Transform2D.ts";
import { Entity,Component } from "platinum/ecs.ts";

export class Floor extends Entity {
    constructor(position = 700) {
        super('floor');
        const transform = new Transform2D(0, position);
        this.attach(transform);
        this.attach(new class extends Component<RenderSystem2D> {
            canUse(system: RenderSystem2D): system is RenderSystem2D {
                return system instanceof RenderSystem2D;
            }
            update(system: RenderSystem2D) {
                system.ctx.beginPath();
                system.ctx.moveTo(transform.x, transform.actY);
                system.ctx.lineTo(640, transform.actY);
                system.ctx.strokeStyle = "red";
                system.ctx.stroke();
                console.log(system.game);
                for(let entity of (system.game?.getWhere(e => e.hasComponent(Transform2D)
                                                           && !e.hasComponent(Camera2D)
                                                           && (e.getComponent(Transform2D)!.y > transform.y)
                                                           ) ?? [])) {
                    system.game?.remove(entity);
                }
            }
            init(_system: RenderSystem2D) {

            }
        })
    }
}
export const fl = new Floor;