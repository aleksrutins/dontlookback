import { Entity, System } from "@platinum-ge/core";
import * as platinum from "@platinum-ge/core";
import * as image from '@platinum-ge/image';
import { RenderSystem2D, CameraEntity2D, Transform2D, PlatformerPhysics2D, CollisionBox2D, CollisionType, Sprite2D } from '@platinum-ge/2d'
import KeyboardManager = platinum.input.keyboard.KeyboardManager;
import playerURL from "./player.png";


export class Player extends Entity {
    speed = 4;
    constructor(private camera: CameraEntity2D, private keyboard: KeyboardManager, transform: Transform2D) {
        super("player");
        this.attach(new PlatformerPhysics2D());
        this.attach(transform);
        this.attach(new CollisionBox2D(CollisionType.DoNotAvoid, 24, 24));
        image.loadBitmap(playerURL).then(bmp => {
            this.attach(new Sprite2D(bmp, 0.75));
        });
    }

    update(systems: System[]) {
        const transform = this.getComponent(Transform2D)!;
        const collision = this.getComponent(CollisionBox2D)!;
        const platformer = this.getComponent(PlatformerPhysics2D)!;
        if((this.keyboard.isDown('ArrowUp') || this.keyboard.isDown(' ') || this.keyboard.isDown('w') || this.keyboard.isDown('W')) && collision.hasCollision()) {
            platformer.jump();
        }
        if(this.keyboard.isDown('ArrowLeft') || this.keyboard.isDown('a') || this.keyboard.isDown('A')) {
            transform.translate([-this.speed, 0]);
        } else if(this.keyboard.isDown('ArrowRight') || this.keyboard.isDown('d') || this.keyboard.isDown('D')) {
            transform.translate([this.speed, 0]);
        }
        try {
            this.camera.follow(transform, 0.01 * this.speed);
        } catch {/**/}
        if(transform.y > 700) ((<RenderSystem2D>systems.find(s => s instanceof RenderSystem2D)).game?.remove(this), this.update = () => {});
        super.update(systems);
    }
}
