import Phaser from 'phaser';
// import { MyFonts } from '../interface/MyFonts';
import { SgpjImageEditor } from '../module/SgpjImageEditor';


// interface TextConfigs {
//     finish: Phaser.Types.GameObjects.Text.TextConfig;
// }

// interface TextObjects {
//     finish?: Phaser.GameObjects.Text;
// }

interface ImageObjects {
    finish?: Phaser.GameObjects.Image;
}


export default class FinishScene extends Phaser.Scene {
    
    private readonly NEXT_SCENE_MOVE_TIME: number = 2000;
    // private textConfigs: TextConfigs | undefined;
    // private texts: TextObjects;
    private userPoint: number;
    private images: ImageObjects;
    
    constructor() {
        super({ key: 'FinishScene', active: false });
        // this.textConfigs = undefined;
        // this.texts = {};
        this.userPoint = -1;
        this.images = {};
    }
    
    
    init(data: any) {
        this.userPoint = data['userPoint'];
    }
    
    
    preload(): void {
        // this.load.image('finish', './assets/images/text/finish.png');
        // this.textConfigs = {
        //     finish: {
        //         x: this.sys.canvas.width / 2,
        //         y: this.sys.canvas.height / 2,
        //         text: 'FINISH!!',
        //         origin: {x: 0.5, y: 0.5},
        //         style: {
        //             fontFamily: MyFonts.google.MPLUS1p,
        //             fontSize: 9 * window.devicePixelRatio + 'vmin',
        //             fontStyle: '700',
        //             color: '#92E4A7',
        //         },
        //     },
        // }
    }
    
    
    create(): void {
        // if (this.textConfigs === undefined) {
        //     console.error('this.textConfigs is ' + this.textConfigs);
        //     return;
        // }
        
        // 情報表示用文字
        // this.texts.finish = this.make.text(this.textConfigs.finish);
        
        this.images.finish = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'finish');
        const ime = new SgpjImageEditor();
        const scaleFactor = ime.getScaleFactorFromVmin(20, this.images.finish, this);
        this.images.finish
        .setDisplaySize(this.images.finish.width * scaleFactor, this.images.finish.height * scaleFactor)
        
        this.tweens.add({
            targets: this.images.finish,
            x: { from: this.sys.canvas.width * 0.3, to: this.sys.canvas.width * 0.5},
            ease: Phaser.Math.Easing.Back.Out,
            duration: 300,
            yoyo: false
        });
        
        this.tweens.add({
            targets: this.images.finish,
            // x: { from: this.sys.canvas.width * 0.5, to: this.sys.canvas.width * 1.0},
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
