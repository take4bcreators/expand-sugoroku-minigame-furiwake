import Phaser from 'phaser';
import { MyFonts } from '../interface/MyFonts';
import { SgpjImageEditor } from '../module/SgpjImageEditor';


interface TextConfigs {
    finish: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    finish?: Phaser.GameObjects.Text;
}

// interface ImageObjects {
//     bg?: Phaser.GameObjects.Image;
// }


export default class FinishScene extends Phaser.Scene {
    
    private readonly NEXT_SCENE_MOVE_TIME: number = 2000;
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    // private images: ImageObjects;
    private userPoint: number;
    private bgVideoKey: string;
    
    constructor() {
        super({ key: 'FinishScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        // this.images = {};
        this.userPoint = -1;
        this.bgVideoKey = '';
    }
    
    
    init(data: any) {
        this.userPoint = data['userPoint'];
    }
    
    
    preload(): void {
        this.textConfigs = {
            finish: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 2,
                text: 'FINISH!!',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 9 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#92E4A7',
                },
            },
        }
        // 背景動画
        this.bgVideoKey = 'bg' + this.scene.key;
        this.load.video(this.bgVideoKey, './assets/videos/bgvideo01.mp4', 'loadeddata', false, true);
    }
    
    
    create(): void {
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is ' + this.textConfigs);
            return;
        }
        
        // // 背景の配置
        // this.images.bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'bg01');
        // const ime = new SgpjImageEditor();
        // this.images.bg.setScale(ime.imageCoverScaler(this.images.bg, this));
        
        // 背景動画の配置と再生
        const bgVideo = this.add.video(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.bgVideoKey);
        const ime = new SgpjImageEditor();
        bgVideo.setScale(ime.imageCoverScaler(bgVideo, this));
        bgVideo.play(true);
        
        
        // 情報表示用文字
        this.texts.finish = this.make.text(this.textConfigs.finish);
        
        this.time.delayedCall(this.NEXT_SCENE_MOVE_TIME, () => {
            this.cameras.main.fadeOut(20, 0, 0, 0);
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
