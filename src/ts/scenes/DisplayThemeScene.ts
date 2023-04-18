import Phaser from 'phaser';
import { GameTheme } from '../interface/GameTheme'
import { MyFonts } from '../interface/MyFonts';
// import { SgpjImageEditor } from "../module/SgpjImageEditor";
import LoadingScene from './LoadingScene';
import WebFontLoader from 'phaser3-rex-plugins/plugins/webfontloader.js';   // WEBフォント使用のためのインポート


interface TextConfigs {
    title: Phaser.Types.GameObjects.Text.TextConfig;
    desc: Phaser.Types.GameObjects.Text.TextConfig;
    leftGuide: Phaser.Types.GameObjects.Text.TextConfig;
    upGuide: Phaser.Types.GameObjects.Text.TextConfig;
    rightGuide: Phaser.Types.GameObjects.Text.TextConfig;
    downGuide: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    title?: Phaser.GameObjects.Text;
    desc?: Phaser.GameObjects.Text;
    leftGuide?: Phaser.GameObjects.Text;
    upGuide?: Phaser.GameObjects.Text;
    rightGuide?: Phaser.GameObjects.Text;
    downGuide?: Phaser.GameObjects.Text;
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
        WebFontLoader.call(this.load, {google: {families: MyFonts.uselist.google}});
        
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
            leftGuide: {
                // x: this.sys.canvas.width / 8,
                // y: this.sys.canvas.height / 2,
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.TrainOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            upGuide: {
                // x: this.sys.canvas.width / 2,
                // y: this.sys.canvas.height / 8,
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.TrainOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            rightGuide: {
                // x: this.sys.canvas.width / 8 * 7,
                // y: this.sys.canvas.height / 2,
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.TrainOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            downGuide: {
                // x: this.sys.canvas.width / 2,
                // y: this.sys.canvas.height / 8 * 7,
                x: 0,
                y: 0,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.TrainOne,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: 'white',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
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
        .setInteractive()
        .on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            this.scene.transition({
                target: 'CountDownScene',
                data: {
                    gameThemeNo: this.gameThemeNo,
                },
                duration: 50,
                onUpdate: (_progress: number) => {},
            });
        });
        
        
        // const arrowLeft = this.add.graphics();
        // arrowLeft.fillStyle(0xffffff, 1).fillTriangle(0, -25, -30, 25, 30, 25);
        // arrowLeft.setRotation(Math.PI * -0.5);
        // arrowLeft.setScale(0.5);
        // const guideLeft = this.make.text(this.textConfigs.leftGuide).setText(themeGuide.a);
        // arrowLeft.setPosition(guideLeft.width * 1.5, 0);
        // const containerLeft = this.add.container(0, 0);
        // containerLeft.add(guideLeft);
        // containerLeft.add(arrowLeft);
        // containerLeft.setPosition(this.sys.canvas.width / 8, this.sys.canvas.height / 2);
        // containerLeft.setAlpha(0.3);
        
        // const arrowUp = this.add.graphics();
        // arrowUp.fillStyle(0xffffff, 1).fillTriangle(0, -25, -30, 25, 30, 25);
        // arrowUp.setRotation(Math.PI * 0);
        // arrowUp.setScale(0.5);
        // const guideUp = this.make.text(this.textConfigs.upGuide).setText(themeGuide.b);
        // arrowUp.setPosition(0, guideUp.height * 1);
        // const containerUp = this.add.container(0, 0);
        // containerUp.add(guideUp);
        // containerUp.add(arrowUp);
        // containerUp.setPosition(this.sys.canvas.width / 2, this.sys.canvas.height / 8);
        // containerUp.setAlpha(0.3);
        
        // const arrowRight = this.add.graphics();
        // arrowRight.fillStyle(0xffffff, 1).fillTriangle(0, -25, -30, 25, 30, 25);
        // arrowRight.setRotation(Math.PI * 0.5);
        // arrowRight.setScale(0.5);
        // const guideRight = this.make.text(this.textConfigs.rightGuide).setText(themeGuide.d);
        // arrowRight.setPosition(guideRight.width * -1.5, 0);
        // const containerRight = this.add.container(0, 0);
        // containerRight.add(guideRight);
        // containerRight.add(arrowRight);
        // containerRight.setPosition(this.sys.canvas.width / 8 * 7, this.sys.canvas.height / 2);
        // containerRight.setAlpha(0.3);
        
        // const arrowDown = this.add.graphics();
        // arrowDown.fillStyle(0xffffff, 1).fillTriangle(0, -25, -30, 25, 30, 25);
        // arrowDown.setRotation(Math.PI * 1);
        // arrowDown.setScale(0.5);
        // const guideDown = this.make.text(this.textConfigs.downGuide).setText(themeGuide.c);
        // arrowDown.setPosition(0, guideDown.height * -1);
        // const containerDown = this.add.container(0, 0);
        // containerDown.add(guideDown);
        // containerDown.add(arrowDown);
        // containerDown.setPosition(this.sys.canvas.width / 2, this.sys.canvas.height / 8 * 7);
        // containerDown.setAlpha(0.3);
        
        
        type dirsType = 'left' | 'up' | 'right' | 'down';
        const dirs: dirsType[]  = ['left', 'up', 'right', 'down'];
        
        const dirSetting = {
            left: {
                rotate: -0.5,
                textConfig: this.textConfigs.leftGuide,
                themeGuide: themeGuide.a,
                guidePosition: {
                    x: 1.5,
                    y: 0,
                },
                containerPosition: {
                    x: this.sys.canvas.width / 8,
                    y: this.sys.canvas.height / 2,
                },
            },
            up: {
                rotate: 0,
                textConfig: this.textConfigs.upGuide,
                themeGuide: themeGuide.b,
                guidePosition: {
                    x: 0,
                    y: 1,
                },
                containerPosition: {
                    x: this.sys.canvas.width / 2,
                    y: this.sys.canvas.height / 8,
                },
            },
            right: {
                rotate: 0.5,
                textConfig: this.textConfigs.rightGuide,
                themeGuide: themeGuide.d,
                guidePosition: {
                    x: -1.5,
                    y: 0,
                },
                containerPosition: {
                    x: this.sys.canvas.width / 8 * 7,
                    y: this.sys.canvas.height / 2,
                },
            },
            down: {
                rotate: 1,
                textConfig: this.textConfigs.downGuide,
                themeGuide: themeGuide.c,
                guidePosition: {
                    x: 0,
                    y: -1,
                },
                containerPosition: {
                    x: this.sys.canvas.width / 2,
                    y: this.sys.canvas.height / 8 * 7,
                },
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
            container.setAlpha(0.3);
        }
        
        
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

