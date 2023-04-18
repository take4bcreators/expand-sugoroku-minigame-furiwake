import Phaser from 'phaser';
// import WebFontLoader from 'phaser3-rex-plugins/plugins/webfontloader.js';   // WEBフォント使用のためのインポート
import { MyFonts } from '../interface/MyFonts'; 
import { SgpjImageEditor } from "../module/SgpjImageEditor";
import LoadingScene from './LoadingScene';


interface TextConfigs {
    pressStart: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    pressStart?: Phaser.GameObjects.Text;
}

interface ImageObjects {
    bg?: Phaser.GameObjects.Image;
    title?: Phaser.GameObjects.Image;
}


export default class TitleScene extends Phaser.Scene {
    
    // private readonly GAME_TITLE: string = 'フリフリフリック！';
    // private readonly NEXT_BUTTON_TEXT: string = 'クリックしてゲームスタート！';
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    private images: ImageObjects;
    // private bgVideoKey: string;
    
    
    constructor() {
        // super({ key: 'TitleScene', active: true });
        super({ key: 'TitleScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        this.images = {};
        // this.bgVideoKey = '';
    }
    
    
    preload(): void {
        // // 背景の読み込み
        // // this.load.image('bg01', './assets/images/bg/syutyu254.png');
        // // this.load.image('bg01', './assets/images/bg/grad001.png');
        // this.load.image('bg01', './assets/images/bg/big-dot_bg_A_01.jpg');
        
        // // 画像の読み込み
        // // this.load.image('num1', './assets/images/num/illustrain01-moji01.png');
        // // this.load.image('num2', './assets/images/num/illustrain01-moji02.png');
        // // this.load.image('num3', './assets/images/num/illustrain01-moji03.png');
        
        // // カウントダウン用数字画像
        // this.load.image('num1', './assets/images/text/count1.png');
        // this.load.image('num2', './assets/images/text/count2.png');
        // this.load.image('num3', './assets/images/text/count3.png');
        
        // // タイトル画像
        // this.load.image('title', './assets/images/text/gametitle.png');
        
        // // 背景動画
        // this.bgVideoKey = 'bg' + this.scene.key;
        // this.load.video(this.bgVideoKey, './assets/videos/bgvideo01.mp4', 'loadeddata', false, true);
        
        
        
        // // Googleフォントの読み込み
        // WebFontLoader.call(this.load, {google: {families: MyFonts.uselist.google}});
        
        // 文字スタイルの定義
        // let fontSizeVmin = 2.5;
        let fontSizeVmin = 3;
        const realCanvasWidth = this.sys.canvas.width / window.devicePixelRatio;
        if (realCanvasWidth < 800) {
            fontSizeVmin = 5;
        }
        this.textConfigs = {
            pressStart: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height * 0.85,
                text: 'PRESS START',
                origin: {x: 0.5, y: 0.5},
                style: {
                    // fontFamily: MyFonts.google.MPLUS1p,
                    fontFamily: MyFonts.google.Exo2,
                    fontSize: fontSizeVmin * window.devicePixelRatio + 'vmin',
                    // fontStyle: '700',
                    fontStyle: '300',
                    color: 'white',
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
        
        // 背景用の黒の図形を削除
        const loadingScene = this.scene.get('LoadingScene') as LoadingScene;
        loadingScene.hideBgGraphic();
        
        // タイトルの配置
        this.images.title = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'title');
        const ime = new SgpjImageEditor();
        const scaleFactor = ime.getScaleFactorFromVmin(50, this.images.title, this);
        this.images.title
        .setDisplaySize(this.images.title.width * scaleFactor, this.images.title.height * scaleFactor)
        // .setInteractive()
        // .on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
        //     this.scene.transition({
        //         target: 'DisplayThemeScene',
        //         data: {},
        //         duration: 50,
        //         onUpdate: (_progress: number) => {},
        //     });
        // })
        ;
        
        // クリック時の挙動
        this.input.on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            this.scene.transition({
                target: 'DisplayThemeScene',
                data: {},
                duration: 50,
                onUpdate: (_progress: number) => {},
            });
        });
        
        
        
        // タイトルの登場アニメーション
        this.tweens.add({
            targets: this.images.title,
            alpha: { from: 0.0, to: 1.0 },
            scale: { from: 0.0, to: scaleFactor },
            ease: Phaser.Math.Easing.Back.Out,
            duration: 300,
            yoyo: false
        });
        
        // // タイトルの定期的なアニメーション
        // this.tweens.add({
        //     targets: this.images.title,
        //     scale: { from: scaleFactor, to: scaleFactor * 1.1 },
        //     ease: 'Sine.InOut',
        //     duration: 100,
        //     repeat: -1,
        //     repeatDelay: 3000,
        //     delay: 3000,
        //     yoyo: true
        // });
        
        
        // 文字の配置
        const positionY = this.sys.canvas.height - (this.sys.canvas.height * 0.25 - this.images.title.displayHeight * 0.25);
        this.texts.pressStart = this.make.text(this.textConfigs.pressStart)
        .setAlpha(0.0)
        .setOrigin(0.5, 0.5)
        .setPosition(this.sys.canvas.width * 0.5, positionY)
        ;
        this.tweens.add({
            targets: this.texts.pressStart,
            alpha: { from: 0.0, to: 1.0 },
            x: { from: this.sys.canvas.width * 0.3, to: this.sys.canvas.width * 0.5},
            // y: { from: this.sys.canvas.height * 0.9, to: this.sys.canvas.height * 0.8},
            ease: Phaser.Math.Easing.Back.Out,
            duration: 500,
            delay: 500,
            yoyo: false
        });
        
        // タイトルの定期的なアニメーション
        this.tweens.add({
            targets: this.texts.pressStart,
            scale: { from: 1.0, to: 1.1 },
            ease: 'Sine.InOut',
            duration: 100,
            repeat: -1,
            repeatDelay: 3000,
            delay: 3000,
            yoyo: true
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
        
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

