import Phaser from 'phaser';
import WebFontLoader from 'phaser3-rex-plugins/plugins/webfontloader.js';   // WEBフォント使用のためのインポート
import { MyFonts } from '../interface/MyFonts'; 
import { SgpjImageEditor } from "../module/SgpjImageEditor";


interface TextConfigs {
    center: Phaser.Types.GameObjects.Text.TextConfig;
}

// interface TextObjects {
//     center?: Phaser.GameObjects.Text;
// }

// interface ImageObjects {
//     bg?: Phaser.GameObjects.Image;
//     title?: Phaser.GameObjects.Image;
// }


export default class LoadingScene extends Phaser.Scene {
    
    private textConfigs: TextConfigs | undefined;
    private bgGraphic: Phaser.GameObjects.Graphics | undefined;
    // private images: ImageObjects;
    private bgVideoKey: string;
    
    
    constructor() {
        super({ key: 'LoadingScene', active: true });
        this.textConfigs = undefined;
        this.bgGraphic = undefined;
        // this.texts = {};
        // this.images = {};
        this.bgVideoKey = '';
    }
    
    
    preload(): void {
        // 背景の読み込み
        this.load.image('bg01', './assets/images/bg/big-dot_bg_A_01.jpg');
        
        // カウントダウン用数字画像
        this.load.image('num1', './assets/images/text/count1.png');
        this.load.image('num2', './assets/images/text/count2.png');
        this.load.image('num3', './assets/images/text/count3.png');
        
        // タイトル画像
        this.load.image('title', './assets/images/text/gametitle.png');
        
        // 背景動画
        this.bgVideoKey = 'bg' + this.scene.key;
        this.load.video(this.bgVideoKey, './assets/videos/bgvideo01.mp4', 'loadeddata', false, true);
        
        // Googleフォントの読み込み
        WebFontLoader.call(this.load, {google: {families: MyFonts.uselist.google}});
        
        // 文字スタイルの定義
        this.textConfigs = {
            center: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 2,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 4.5 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#79B0D2',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
        }
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
        
        
        // 背景用の黒の図形を配置
        this.bgGraphic = this.add.graphics();
        this.bgGraphic.fillStyle(0x000000, 0.5).fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);
        this.bgGraphic.setAlpha(0);
        
        
        this.time.delayedCall(300, () => {
            this.scene.launch('TitleScene');
        });
        
        
        
        
        // ----------------- DEBUG ---------------------
        // this.time.delayedCall(100, () => {
        //     this.scene.transition({
        //         target: 'ResultScene',
        //         data: {
        //             userPoint: 5,
        //         },
        //         duration: 10,
        //         onUpdate: (_progress: number) => {
        //         },
        //     });
        // });
        // ---------------------------------------------
        
        
        // const num = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'num1');
        // const baseSizeScale = ime.getScaleFactorFromVmin(30, num, this, true);
        // num.setDisplaySize(num.displayWidth * baseSizeScale, num.displayHeight * baseSizeScale);
        // const sf = 1.0;
        // num.setScale(baseSizeScale * sf);
        
        
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
    visibleBgGraphic() {
        // 背景用の黒の図形を配置
        // this.bgGraphic = this.add.graphics();
        // this.bgGraphic.fillStyle(0x000000, 0.5).fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);
        if (typeof this.bgGraphic === 'undefined') {
            console.error('this.bgGraphic is undefined');
            return;
        }
        this.bgGraphic.setAlpha(1);
    }
    
    hideBgGraphic() {
        // 背景用の黒の図形を配置
        if (typeof this.bgGraphic === 'undefined') {
            console.error('this.bgGraphic is undefined');
            return;
        }
        this.bgGraphic.setAlpha(0);
    }
    
}

