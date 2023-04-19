import Phaser from 'phaser';
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
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    private images: ImageObjects;
    
    
    constructor() {
        super({ key: 'TitleScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        this.images = {};
    }
    
    
    preload(): void {
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
                    fontFamily: MyFonts.google.Exo2,
                    fontSize: fontSizeVmin * window.devicePixelRatio + 'vmin',
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
        
        // 背景用の黒の図形を削除する（リトライ用）
        const loadingScene = this.scene.get('LoadingScene') as LoadingScene;
        loadingScene.hideBgGraphic();
        loadingScene.hideLogoIcon();
        
        // タイトル画像を配置する
        this.images.title = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'title');
        const ime = new SgpjImageEditor();
        const sf = ime.getScaleFactorFromVmin(50, this.images.title, this);
        this.images.title.setDisplaySize(this.images.title.width * sf, this.images.title.height * sf);
        // タイトル画像の登場時のアニメーションを設定する
        this.tweens.add({
            targets: this.images.title,
            alpha: { from: 0.0, to: 1.0 },
            scale: { from: 0.0, to: sf },
            ease: Phaser.Math.Easing.Back.Out,
            duration: 300,
            yoyo: false
        });
        
        // 文字を配置する
        const positionY = this.sys.canvas.height - (this.sys.canvas.height * 0.25 - this.images.title.displayHeight * 0.25);
        this.texts.pressStart = this.make.text(this.textConfigs.pressStart)
        .setAlpha(0.0)
        .setOrigin(0.5, 0.5)
        .setPosition(this.sys.canvas.width * 0.5, positionY)
        ;
        // 文字の登場時アニメーションを設定する
        this.tweens.add({
            targets: this.texts.pressStart,
            alpha: { from: 0.0, to: 1.0 },
            x: { from: this.sys.canvas.width * 0.3, to: this.sys.canvas.width * 0.5},
            ease: Phaser.Math.Easing.Back.Out,
            duration: 500,
            delay: 500,
            yoyo: false
        });
        // 文字の定期的なアニメーションを設定する
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
        
        // 画面クリックで次のシーンへ移動
        this.input.on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            this.scene.transition({
                target: 'DisplayThemeScene',
                data: {},
                duration: 50,
                onUpdate: (_progress: number) => {},
            });
        });
        
        // ----------------- DEBUG ---------------------
        // this.time.delayedCall(100, () => {
        //     this.scene.transition({
        //         target: 'ResultScene',
        //         data: {
        //             userPoint: 12,
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

