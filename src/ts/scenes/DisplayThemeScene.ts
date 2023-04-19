import Phaser from 'phaser';
import { GameTheme } from '../interface/GameTheme'
import { MyFonts } from '../interface/MyFonts';
import LoadingScene from './LoadingScene';


interface TextConfigs {
    title: Phaser.Types.GameObjects.Text.TextConfig;
    desc: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    title?: Phaser.GameObjects.Text;
    desc?: Phaser.GameObjects.Text;
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
        }
        this.load.json('gametheme', './assets/json/gametheme.json');
    }
    
    
    create(): void {
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is ' + this.textConfigs);
            return;
        }
        
        // ゲームテーマをランダムに決定する
        const gameThemes: GameTheme[] = this.cache.json.get('gametheme');
        const gameThemeCount = gameThemes.length;
        this.gameThemeNo = Phaser.Math.Between(0, gameThemeCount - 1);
        
        // テーマ情報を取得する
        const themeTitle = gameThemes[this.gameThemeNo].title;
        const themeGuide = gameThemes[this.gameThemeNo].guide;
        
        // 文字を配置する
        const displayText = themeTitle;
        this.texts.title = this.make.text(this.textConfigs.title).setText(displayText);
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
        
        // ロード画面を取得して背景画像類を表示する
        const loadingScene = this.scene.get('LoadingScene') as LoadingScene;
        loadingScene.visibleBgGraphic();
        loadingScene.visibleLogoIcon();
        loadingScene.visibleDirGuide(themeGuide);
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

