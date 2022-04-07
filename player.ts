import { CameraEntity2D } from "platinum/2d/Camera2D.ts";
import { CollisionBox2D, CollisionType } from "platinum/2d/CollisionBox2D.ts";
import { PlatformerPhysics2D } from "platinum/2d/PlatformerPhysics2D.ts";
import { Transform2D } from "platinum/2d/Transform2D.ts";
import { KeyboardManager } from "platinum/input/keyboard.ts";
import * as platinum from "platinum";
import { Entity, System } from "platinum/ecs.ts"
import { RenderSystem2D } from "platinum/2d/RenderSystem2D.ts";

export class Player extends Entity {
    speed = 4;
    constructor(private camera: CameraEntity2D, private keyboard: KeyboardManager, transform: Transform2D) {
        super("player");
        this.attach(new PlatformerPhysics2D());
        this.attach(transform);
        this.attach(new CollisionBox2D(CollisionType.DoNotAvoid, 24, 24));
        platinum.image.loadBitmap('player.png').then(bmp => {
            this.attach(new platinum.s2d.Sprite2D(bmp, 0.75));
        });
    }

    update(systems: System[]) {
        const transform = this.getComponent(Transform2D)!;
        const collision = this.getComponent(CollisionBox2D)!;
        const platformer = this.getComponent(PlatformerPhysics2D)!;
        if(this.keyboard.isDown('ArrowUp') && collision.hasCollision()) {
            platformer.jump();
        }
        if(this.keyboard.isDown('ArrowLeft')) {
            transform.translate([-this.speed, 0]);
        } else if(this.keyboard.isDown('ArrowRight')) {
            transform.translate([this.speed, 0]);
        }
        try {
            this.camera.follow(transform);
        } catch {}
        console.log(this.speed);
        if(transform.y > 700) (<RenderSystem2D>systems.find(s => s instanceof RenderSystem2D)).game?.remove(this);
        super.update(systems);
    }
}
