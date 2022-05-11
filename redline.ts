import { Camera2D, RenderSystem2D, Transform2D } from "@platinum-ge/2d";
import { Entity, Component, System } from "@platinum-ge/core";
import { Player } from "./player";

export class RedLine extends Entity {
    constructor(private startX = -100, public speed = 1) {
        super("redline");
        const transform = new Transform2D(startX, -100);
        transform.delta[0] = speed;
        this.attach(transform);
        this.attach(new class extends Component<RenderSystem2D> {
            canUse(system: RenderSystem2D): system is RenderSystem2D {
                return system instanceof RenderSystem2D;
            }
            update(system: RenderSystem2D) {
                system.ctx.beginPath();
                system.ctx.moveTo(transform.actX, transform.y);
                system.ctx.lineTo(transform.actX, 580);
                system.ctx.strokeStyle = "orange";
                system.ctx.stroke();

                for(let entity of (system.game?.getWhere(e => e.hasComponent(Transform2D)
                                                           && !e.hasComponent(Camera2D)
                                                           && !(e instanceof Player)
                                                           && (e.getComponent(Transform2D)!.x < transform.x)
                                                           ) ?? [])) {
                    system.game?.remove(entity);
                }
            }
            init(_system: RenderSystem2D) {

            }
        })
    }
    override update(systems: System[]) {
        super.update(systems);
        this.getComponent(Transform2D)!.delta[0] = this.speed;
    }
}