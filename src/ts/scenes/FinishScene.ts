import Phaser from 'phaser';
import { SgpjImageEditor } from '../module/SgpjImageEditor';


interface ImageObjects {
    finish?: Phaser.GameObjects.Image;
}


export default class FinishScene extends Phaser.Scene {
    private readonly NEXT_SCENE_MOVE_TIME: number = 2000;
    private userPoint: number;
    private images: ImageObjects;
    
    
    constructor() {
        super({ key: 'FinishScene', active: false });
        this.userPoint = -1;
        this.images = {};
    }
    
    
    init(data: any) {
        this.userPoint = data['userPoint'];
    }
    
    
    preload(): void {
    }
    
    
    create(): void {
        this.images.finish = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'finish');
        const ime = new SgpjImageEditor();
        const sf = ime.getScaleFactorFromVmin(50, this.images.finish, this);
        this.images.finish.setDisplaySize(this.images.finish.width * sf, this.images.finish.height * sf);
        
        this.tweens.add({
            targets: this.images.finish,
            x: { from: this.sys.canvas.width * 0.3, to: this.sys.canvas.width * 0.5},
            ease: Phaser.Math.Easing.Back.Out,
            duration: 300,
            yoyo: false
        });
        
        this.tweens.add({
            targets: this.images.finish,
            scale: { from: 0.1, to: 1.0 },
            alpha: { from: 1.0, to: 0.0 },
            ease: Phaser.Math.Easing.Back.Out,
            duration: 500,
            delay: this.NEXT_SCENE_MOVE_TIME - 500,
            yoyo: false
        });
        
        this.time.delayedCall(this.NEXT_SCENE_MOVE_TIME, () => {
            this.scene.transition({
                target: 'ResultScene',
                data: {
                    userPoint: this.userPoint,
                },
                duration: 10,
                onUpdate: (_progress: number) => {
                },
            });
        });
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}
