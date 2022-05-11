import * as platinum from "@platinum-ge/core";
import { CameraEntity2D, CollisionBox2D, CollisionType, level, RenderSystem2D, Sprite2D, Transform2D } from "@platinum-ge/2d";
import * as image from '@platinum-ge/image';
import { Collectible } from "./collectible";
import { Player } from "./player";
import { RedLine } from "./redline";
import tilemapURL from "./tilemap.png";

import KeyboardManager = platinum.input.keyboard.KeyboardManager;

(async () => {

let gameOver = false;

let generatedTo = 32;
let frames = 0;
const framesSpan  = document.querySelector('#timer'),
      yourSpeed   = document.querySelector('#yourspeed'),
      delSpeed    = document.querySelector('#delspeed'),
      delDistance = document.querySelector('#distance');

const game = new platinum.Game;
const renderSystem = new RenderSystem2D(document.querySelector('#game')!);
game.use(renderSystem);
const keyboard = game.useExt(KeyboardManager);

const scene = new platinum.Scene;

const camera = new CameraEntity2D("camera", 640, 480);

const _level: level.Level = {
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

const tilemap = await image.load(tilemapURL);
let tileBitmap = await createImageBitmap(tilemap, 0, 0, 32, 32);
let collectibleBitmap = await createImageBitmap(tilemap, 0, 32, 32, 32);
scene.addAll(await level.LevelLoader.load(_level, {
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
game.getSystem(RenderSystem2D)!.clearColor = 'black';
game.mainLoop(() => {
    // Procedural generation
    const distance = Math.round(((camera.getComponent(Transform2D)!.position[0] + 640) - (generatedTo + 32) + 64) / 32) * 32;
    if(distance > 0) {
        for(let i = 0; i < distance; i += 32) {
            for(let j = 0; j < 480; j += 32) {
                const randn = Math.random() * 100;
                if(randn < 4) {
                    const spr = new platinum.Entity(`generated_tile_${i}_${j}`);
                    spr.attach(new Sprite2D(tileBitmap));
                    spr.attach(new Transform2D(generatedTo + i, j));
                    spr.attach(new CollisionBox2D(CollisionType.DoNotAvoid, 32, 32));
                    scene.add(spr);
                } else if(randn < 6) {
                    const spr = new platinum.Entity(`generated_collectible_${i}_${j}`);
                    spr.attach(new Sprite2D(collectibleBitmap));
                    spr.attach(new Transform2D(generatedTo + i, j));
                    spr.attach(new CollisionBox2D(CollisionType.PassThrough, 32, 32));
                    spr.attach(new Collectible(game.get(Player, 'player')!));
                    scene.add(spr);
                }
            }
        }
        generatedTo += distance;
    }

    redLine.speed += 0.002;
    if(game.get(Player, 'player')) {
        frames++;
    }
    framesSpan!.textContent = frames.toString();
    delSpeed!.textContent = (Math.round(redLine.speed * 1000) / 1000).toString();
    yourSpeed!.textContent = (Math.round((game.get(Player, 'player')?.speed ?? 0) * 1000) / 1000).toString();
    delDistance!.textContent = (Math.round(((game.get(Player, 'player')?.getComponent(Transform2D)?.x ?? redLine.getComponent(Transform2D)!.x) - redLine.getComponent(Transform2D)!.x) * 5) / 5).toString();


    /* The game changes as time goes on. */
    if(frames == 1500) createImageBitmap(tilemap, 0, 64, 32, 32).then(bmp => tileBitmap = bmp);
    if(frames == 2100) createImageBitmap(tilemap, 0, 96, 32, 32).then(bmp => tileBitmap = bmp);
    if(frames == 2400) createImageBitmap(tilemap, 0, 128, 32, 32).then(bmp => collectibleBitmap = bmp);
    if(!game.get(Player, 'player') && !gameOver) {
        gameOver = true;
        postGame();
    }
    return (game.get(Player, 'player') != null);
});

async function postGame() {
    
}

})();