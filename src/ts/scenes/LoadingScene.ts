import Phaser from 'phaser';
import WebFontLoader from 'phaser3-rex-plugins/plugins/webfontloader.js';   // WEBフォント使用のためのインポート
import { MyFonts } from '../interface/MyFonts'; 
import { SgpjImageEditor } from "../module/SgpjImageEditor";
import { SugorokuConnection } from '../module/SugorokuConnection';

interface TextConfigs {
    center: Phaser.Types.GameObjects.Text.TextConfig;
    left: Phaser.Types.GameObjects.Text.TextConfig;
    up: Phaser.Types.GameObjects.Text.TextConfig;
    right: Phaser.Types.GameObjects.Text.TextConfig;
    down: Phaser.Types.GameObjects.Text.TextConfig;
}

// interface TextObjects {
//     center?: Phaser.GameObjects.Text;
// }

interface ContainerObjects {
    left?: Phaser.GameObjects.Container;
    up?: Phaser.GameObjects.Container;
    right?: Phaser.GameObjects.Container;
    down?: Phaser.GameObjects.Container;
}

interface ImageObjects {
    logo?: Phaser.GameObjects.Image;
}

type themeGuideType = {
    a: string;
    b: string;
    c: string;
    d: string;
}


export default class LoadingScene extends Phaser.Scene {
    private textConfigs: TextConfigs | undefined;
    private bgGraphic: Phaser.GameObjects.Graphics | undefined;
    private images: ImageObjects;
    private containers: ContainerObjects;
    private bgVideoKey: string;
    sgcon: SugorokuConnection;
    
    
    constructor() {
        super({ key: 'LoadingScene', active: true });
        this.textConfigs = undefined;
        this.bgGraphic = undefined;
        this.images = {};
        this.containers = {};
        this.bgVideoKey = '';
        this.sgcon = new SugorokuConnection();
    }
    
    
    preload(): void {
        // Googleフォントを読み込む
        WebFontLoader.call(this.load, {google: {families: MyFonts.uselist.google}});
        
        // 背景動画を読み込む
        this.bgVideoKey = 'bg' + this.scene.key;
        this.load.video(this.bgVideoKey, './assets/videos/bgvideo01.mp4', 'loadeddata', false, true);
        
        // 画像を読み込む（他のシーンの画像もここで一括で読み込む）
        this.load.image('title', './assets/images/text/gametitle.png');
        this.load.image('num1', './assets/images/text/count1.png');
        this.load.image('num2', './assets/images/text/count2.png');
        this.load.image('num3', './assets/images/text/count3.png');
        this.load.image('go', './assets/images/text/go.png');
        this.load.image('ok', './assets/images/text/ok.png');
        this.load.image('ng', './assets/images/text/ng.png');
        this.load.image('finish', './assets/images/text/finish.png');
        this.load.image('result', './assets/images/text/result.png');
        
        // 文字スタイルを定義する
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
            left: {
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.RampartOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            up: {
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.RampartOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            right: {
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.RampartOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            down: {
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.RampartOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
        }
        
        // すごろくモードであるかを判定する
        this.sgcon.checkSugorokuMode();
    }
    
    
    create(): void {
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is ' + this.textConfigs);
            return;
        }
        
        // 背景動画の配置と再生をする
        const bgVideo = this.add.video(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.bgVideoKey);
        const ime = new SgpjImageEditor();
        bgVideo.setScale(ime.imageCoverScaler(bgVideo, this));
        bgVideo.play(true);
        
        // 背景用の黒の図形を配置する（特定のシーン移動時に表示する）
        this.bgGraphic = this.add.graphics();
        this.bgGraphic.fillStyle(0x000000, 0.5).fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);
        this.bgGraphic.setAlpha(0);
        
        // ゲーム中の表示ロゴを配置する（特定のシーン移動時に表示する）
        this.images.logo = this.add.image(this.sys.canvas.width / 8, this.sys.canvas.height / 8 * 7, 'title');
        this.images.logo.setScale(0.1);
        this.images.logo.setVisible(false);
        
        // タイトルシーンに移動する
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
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
    /** 背景用の黒の図形を表示する */
    visibleBgGraphic() {
        if (typeof this.bgGraphic === 'undefined') {
            console.error('this.bgGraphic is undefined');
            return;
        }
        this.bgGraphic.setAlpha(1);
    }
    
    /** 背景用の黒の図形を非表示にする */
    hideBgGraphic() {
        if (typeof this.bgGraphic === 'undefined') {
            console.error('this.bgGraphic is undefined');
            return;
        }
        this.bgGraphic.setAlpha(0);
    }
    
    /** ロゴアイコンを表示する */
    visibleLogoIcon() {
        if (typeof this.images.logo === 'undefined') {
            console.error('this.images.logo is undefined');
            return;
        }
        this.images.logo.setVisible(true);
        this.tweens.add({
            targets: this.images.logo,
            alpha: { from: 0.0, to: 1.0 },
            x: { from: 0, to: this.sys.canvas.width / 8},
            ease: Phaser.Math.Easing.Back.Out,
            duration: 500,
            yoyo: false
        });
    }
    
    /** ロゴアイコンを非表示にする */
    hideLogoIcon() {
        if (typeof this.images.logo === 'undefined') {
            console.error('this.images.logo is undefined');
            return;
        }
        this.images.logo.setVisible(false);
    }
    
    /** 各方向のガイドを表示する */
    visibleDirGuide(themeGuide: themeGuideType) {
        if (typeof this.textConfigs === 'undefined') {
            console.error('this.textConfigs is undefined');
            return;
        }
        type dirsType = 'left' | 'up' | 'right' | 'down';
        const dirs: dirsType[]  = ['left', 'up', 'right', 'down'];
        const dirSetting = {
            left: {
                rotate: -0.5,
                textConfig: this.textConfigs.left,
                themeGuide: themeGuide.a,
                guidePosition: {x: 1.5, y: 0},
                containerPosition: {x: this.sys.canvas.width / 8, y: this.sys.canvas.height / 2},
            },
            up: {
                rotate: 0,
                textConfig: this.textConfigs.up,
                themeGuide: themeGuide.b,
                guidePosition: {x: 0, y: 1},
                containerPosition: {x: this.sys.canvas.width / 2, y: this.sys.canvas.height / 8},
            },
            right: {
                rotate: 0.5,
                textConfig: this.textConfigs.right,
                themeGuide: themeGuide.c,
                guidePosition: {x: -1.5, y: 0},
                containerPosition: {x: this.sys.canvas.width / 8 * 7, y: this.sys.canvas.height / 2},
            },
            down: {
                rotate: 1,
                textConfig: this.textConfigs.down,
                themeGuide: themeGuide.d,
                guidePosition: {x: 0, y: -1},
                containerPosition: {x: this.sys.canvas.width / 2, y: this.sys.canvas.height / 8 * 7},
            }
        }
        
        for (const dir of dirs) {
            const arrow = this.add.graphics();
            arrow.fillStyle(0xffffff, 1).fillTriangle(0, -25, -30, 25, 30, 25);
            arrow.setRotation(Math.PI * dirSetting[dir].rotate);
            arrow.setScale(0.5);
            const guide = this.make.text(dirSetting[dir].textConfig).setText(dirSetting[dir].themeGuide);
            arrow.setPosition(guide.width * dirSetting[dir].guidePosition.x, guide.height * dirSetting[dir].guidePosition.y);
            
            const container = this.add.container(0, 0);
            container.add(guide);
            container.add(arrow);
            container.setPosition(dirSetting[dir].containerPosition.x, dirSetting[dir].containerPosition.y);
            container.setAlpha(0.4);
            container.setVisible(true);
            this.containers[dir] = container;
            
            this.tweens.add({
                targets: this.containers[dir],
                alpha: { from: 0.0, to: 0.4 },
                scale: { from: 0.0, to: 1.0 },
                ease: Phaser.Math.Easing.Back.Out,
                duration: 300,
                yoyo: false,
            });
            
            // // 定期的なアニメーション
            // this.tweens.add({
            //     targets: this.containers[dir],
            //     scale: { from: 1.0, to: 1.2 },
            //     ease: 'Sine.InOut',
            //     duration: 100,
            //     repeat: -1,
            //     repeatDelay: 3000,
            //     delay: 3000,
            //     yoyo: true
            // });
            
            // フォント反映のために指定時間で表示を更新させる
            const callTimeList = [1000, 2000, 4000, 8000];
            for (const callTime of callTimeList) {
                this.time.delayedCall(callTime, () => {
                    guide.updateText();
                });
            }
        }
    }
    
    /** 各方向のガイドを非表示にする */
    hideDirGuide() {
        this.containers.left?.setVisible(false);
        this.containers.up?.setVisible(false);
        this.containers.right?.setVisible(false);
        this.containers.down?.setVisible(false);
        this.containers.left = undefined;
        this.containers.up = undefined;
        this.containers.right = undefined;
        this.containers.down = undefined;
    }
    
}

