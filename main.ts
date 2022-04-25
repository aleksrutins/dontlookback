import * as platinum from "platinum/mod.ts";
import { Collectible } from "./collectible.ts";
import { Player } from "./player.ts";
import { RedLine } from "./redline.ts";
import KeyboardManager = platinum.input.keyboard.KeyboardManager;
import CameraEntity2D  = platinum.s2d.CameraEntity2D;
import Transform2D     = platinum.s2d.Transform2D;
import Camera2D        = platinum.s2d.Camera2D;

let generatedTo = 32;
let frames = 0;
const framesSpan  = document.querySelector('#timer'),
      yourSpeed   = document.querySelector('#yourspeed'),
      delSpeed    = document.querySelector('#delspeed'),
      delDistance = document.querySelector('#distance');

const game = new platinum.Game;
const renderSystem = new platinum.s2d.RenderSystem2D(document.querySelector('#game')!);
game.use(renderSystem);
const keyboard = game.useExt(KeyboardManager);

const scene = new platinum.Scene;

const camera = new CameraEntity2D("camera", 640, 480);

const level: platinum.s2d.level.Level = {
    name: 'main',
    tiles: [
        {
            index: 0,
            x: 0,
            y: 50,
            collisionType: 'DoNotAvoid'
        }
    ],
    entities: [
        {
            name: 'player',
            x: 0,
            y: 0
        }
    ]
};

const tilemap = await platinum.image.load('tilemap.png');
const tileBitmap = await createImageBitmap(tilemap, 0, 0, 32, 32);
const collectibleBitmap = await createImageBitmap(tilemap, 0, 32, 32, 32);
scene.addAll(await platinum.s2d.level.LevelLoader.load(level, {
    image: tilemap,
    tileHeight: 32,
    tileWidth: 32,
    rows: 1,
    cols: 1
}, (name, pos) => {
    if(name == 'player') {
        return new Player(camera, keyboard, pos);
    }
}));
const redLine = new RedLine;
scene.add(redLine);
scene.add(camera);
game.switchScene(scene);
game.getSystem(platinum.s2d.RenderSystem2D)!.clearColor = 'black';
game.mainLoop(() => {
    // Procedural generation
    const distance = Math.round(((camera.getComponent(Transform2D)!.position[0] + 640) - (generatedTo + 32) + 64) / 32) * 32;
    if(distance > 0) {
        for(let i = 0; i < distance; i += 32) {
            for(let j = 0; j < 480; j += 32) {
                const randn = Math.random() * 100;
                if(randn < 4) {
                    const spr = new platinum.ecs.Entity(`generated_tile_${i}_${j}`);
                    spr.attach(new platinum.s2d.Sprite2D(tileBitmap));
                    spr.attach(new Transform2D(generatedTo + i, j));
                    spr.attach(new platinum.s2d.CollisionBox2D(platinum.s2d.CollisionType.DoNotAvoid, 32, 32));
                    scene.add(spr);
                } else if(randn < 6) {
                    const spr = new platinum.ecs.Entity(`generated_collectible_${i}_${j}`);
                    spr.attach(new platinum.s2d.Sprite2D(collectibleBitmap));
                    spr.attach(new Transform2D(generatedTo + i, j));
                    spr.attach(new platinum.s2d.CollisionBox2D(platinum.s2d.CollisionType.PassThrough, 32, 32));
                    spr.attach(new Collectible(game.get(Player, 'player')!));
                    scene.add(spr);
                }
            }
        }
        generatedTo += distance;
    }

    redLine.speed += 0.002;
    if(game.get(Player, 'player') != null) {
        frames++;
    }
    framesSpan!.textContent = frames.toString();
    delSpeed!.textContent = (Math.round(redLine.speed * 1000) / 1000).toString();
    yourSpeed!.textContent = (Math.round((game.get(Player, 'player')?.speed ?? 0) * 1000) / 1000).toString();
    delDistance!.textContent = (Math.round(((game.get(Player, 'player')?.getComponent(Transform2D)?.x ?? redLine.getComponent(Transform2D)!.x) - redLine.getComponent(Transform2D)!.x) * 5) / 5).toString();
    return true;
});