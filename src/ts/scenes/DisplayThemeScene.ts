import Phaser from 'phaser';
import { GameTheme } from '../interface/GameTheme'
import { MyFonts } from '../interface/MyFonts';
// import { SgpjImageEditor } from "../module/SgpjImageEditor";
import LoadingScene from './LoadingScene';
// import WebFontLoader from 'phaser3-rex-plugins/plugins/webfontloader.js';   // WEBフォント使用のためのインポート


interface TextConfigs {
    title: Phaser.Types.GameObjects.Text.TextConfig;
    desc: Phaser.Types.GameObjects.Text.TextConfig;
    // leftGuide: Phaser.Types.GameObjects.Text.TextConfig;
    // upGuide: Phaser.Types.GameObjects.Text.TextConfig;
    // rightGuide: Phaser.Types.GameObjects.Text.TextConfig;
    // downGuide: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    title?: Phaser.GameObjects.Text;
    desc?: Phaser.GameObjects.Text;
    // leftGuide?: Phaser.GameObjects.Text;
    // upGuide?: Phaser.GameObjects.Text;
    // rightGuide?: Phaser.GameObjects.Text;
    // downGuide?: Phaser.GameObjects.Text;
}


export default class DisplayThemeScene extends Phaser.Scene {
    
    private gameThemeNo: number;
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    
    constructor() {
        super({ key: 'DisplayThemeScene', active: false });
        this.gameThemeNo = -1;
        this.textConfigs = undefined;
        this.texts = {};
    }
    
    preload(): void {
        // WebFontLoader.call(this.load, {google: {families: MyFonts.uselist.google}});
        
        this.textConfigs = {
            title: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 2,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 7 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            desc: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 2,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 4 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#79B0D2',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            // leftGuide: {
            //     // x: this.sys.canvas.width / 8,
            //     // y: this.sys.canvas.height / 2,
            //     x: 0,
            //     y: 0,
            //     text: undefined,
            //     origin: {x: 0.5, y: 0.5},
            //     style: {
            //         fontFamily: MyFonts.google.TrainOne,
            //         fontSize: 6 * window.devicePixelRatio + 'vmin',
            //         fontStyle: '400',
            //         color: 'white',
            //         align: 'center',
            //         wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
            //     },
            // },
            // upGuide: {
            //     // x: this.sys.canvas.width / 2,
            //     // y: this.sys.canvas.height / 8,
            //     x: 0,
            //     y: 0,
            //     text: undefined,
            //     origin: {x: 0.5, y: 0.5},
            //     style: {
            //         fontFamily: MyFonts.google.TrainOne,
            //         fontSize: 6 * window.devicePixelRatio + 'vmin',
            //         fontStyle: '400',
            //         color: 'white',
            //         align: 'center',
            //         wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
            //     },
            // },
            // rightGuide: {
            //     // x: this.sys.canvas.width / 8 * 7,
            //     // y: this.sys.canvas.height / 2,
            //     x: 0,
            //     y: 0,
            //     text: undefined,
            //     origin: {x: 0.5, y: 0.5},
            //     style: {
            //         fontFamily: MyFonts.google.TrainOne,
            //         fontSize: 6 * window.devicePixelRatio + 'vmin',
            //         fontStyle: '400',
            //         color: 'white',
            //         align: 'center',
            //         wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
            //     },
            // },
            // downGuide: {
            //     // x: this.sys.canvas.width / 2,
            //     // y: this.sys.canvas.height / 8 * 7,
            //     x: 0,
            //     y: 0,
            //     text: undefined,
            //     origin: {x: 0.5, y: 0.5},
            //     style: {
            //         fontFamily: MyFonts.google.TrainOne,
            //         fontSize: 6 * window.devicePixelRatio + 'vmin',
            //         fontStyle: '400',
            //         color: 'white',
            //         align: 'center',
            //         wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
            //     },
            // },
        }
        
        
        // jsonファイルの読込
        this.load.json('gametheme', './assets/json/gametheme.json');
    }
    
    
    create(): void {
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is ' + this.textConfigs);
            return;
        }
        
        // 背景用の黒の図形を配置
        const loadingScene = this.scene.get('LoadingScene') as LoadingScene;
        loadingScene.visibleBgGraphic();
        loadingScene.visibleLogoIcon();
        
        // ゲームテーマの決定
        const gameThemes: GameTheme[] = this.cache.json.get('gametheme');
        const gameThemeCount = gameThemes.length;
        this.gameThemeNo = Phaser.Math.Between(0, gameThemeCount - 1);
        
        // テーマ情報取得
        const themeTitle: string = gameThemes[this.gameThemeNo].title;
        // const themeDesc: string = gameThemes[this.gameThemeNo].description;
        const themeGuide = gameThemes[this.gameThemeNo].guide;
        
        // 中央に表示する文字
        // const displayText = `今回のテーマ … 「${themeTitle}」`
        //                     + `\n\n`
        //                     + `\n${themeDesc}`
        //                     + `\n\n`
        //                     + `\n←：${themeGuide.a} ↑：${themeGuide.b} ↓：${themeGuide.d} →：${themeGuide.c}`
        //                     + `\n\n`
        //                     + `\nクリックしてゲームスタート！`
        // ;
        const displayText = themeTitle;
        this.texts.title = this.make.text(this.textConfigs.title)
        .setText(displayText)
        // .setInteractive()
        // .on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
        //     this.scene.transition({
        //         target: 'CountDownScene',
        //         data: {
        //             gameThemeNo: this.gameThemeNo,
        //         },
        //         duration: 50,
        //         onUpdate: (_progress: number) => {},
        //     });
        // })
        ;
        
        this.tweens.add({
            targets: this.texts.title,
            alpha: { from: 0.0, to: 1.0 },
            scale: { from: 0.0, to: 1.0 },
            ease: Phaser.Math.Easing.Back.Out,
            duration: 300,
            yoyo: false
        });
        
        // クリックしたら次の画面へ遷移する
        this.input.on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            this.scene.transition({
                target: 'CountDownScene',
                data: {
                    gameThemeNo: this.gameThemeNo,
                },
                duration: 50,
                onUpdate: (_progress: number) => {},
            });
        });
        
        // 各方向のガイドを表示
        loadingScene.visibleDirGuide(themeGuide);
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

