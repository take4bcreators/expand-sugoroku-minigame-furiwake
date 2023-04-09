import Phaser from 'phaser';
import { GameTheme } from '../interface/GameTheme'
import { MyFonts } from '../interface/MyFonts';
// import { SgpjImageEditor } from "../module/SgpjImageEditor";


interface TextConfigs {
    center: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    center?: Phaser.GameObjects.Text;
}

// interface ImageObjects {
//     bg?: Phaser.GameObjects.Image;
// }


export default class DisplayThemeScene extends Phaser.Scene {
    
    private gameThemeNo: number;
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    // private images: ImageObjects;
    // private bgVideoKey: string;
    
    constructor() {
        super({ key: 'DisplayThemeScene', active: false });
        this.gameThemeNo = -1;
        this.textConfigs = undefined;
        this.texts = {};
        // this.images = {};
        // this.bgVideoKey = '';
    }
    
    
    init (): void {
        // this.events.on(Phaser.Scenes.Events.TRANSITION_INIT, () => {
        //   this.cameras.main.setAlpha(0);
        // });
        // this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
        //   this.cameras.main.setAlpha(1);
        //   this.cameras.main.fadeIn(1000, 0, 0, 0);
        // });
    }
    
    
    preload(): void {
        this.textConfigs = {
            center: {
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
        
        // 背景動画
        // this.bgVideoKey = 'bg' + this.scene.key;
        // this.load.video(this.bgVideoKey, './assets/videos/bgvideo01.mp4', 'loadeddata', false, true);
        
        // jsonファイルの読込
        this.load.json('gametheme', './assets/json/gametheme.json');
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
        // const bgVideo = this.add.video(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.bgVideoKey);
        // const ime = new SgpjImageEditor();
        // bgVideo.setScale(ime.imageCoverScaler(bgVideo, this));
        // bgVideo.play(true);
        
        
        // ゲームテーマの決定
        const gameThemes: GameTheme[] = this.cache.json.get('gametheme');
        const gameThemeCount = gameThemes.length;
        this.gameThemeNo = Phaser.Math.Between(0, gameThemeCount - 1);
        
        // テーマ情報取得
        const themeTitle: string = gameThemes[this.gameThemeNo].title;
        const themeDesc: string = gameThemes[this.gameThemeNo].description;
        const themeGuide = gameThemes[this.gameThemeNo].guide;
        
        // 中央に表示する文字
        const displayText = `今回のテーマ … 「${themeTitle}」`
                            + `\n\n`
                            + `\n${themeDesc}`
                            + `\n\n`
                            + `\n←：${themeGuide.a} ↑：${themeGuide.b} ↓：${themeGuide.d} →：${themeGuide.c}`
                            + `\n\n`
                            + `\nクリックしてゲームスタート！`
        ;
        this.texts.center = this.make.text(this.textConfigs.center)
        .setText(displayText)
        .setInteractive()
        .on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            // this.cameras.main.fadeOut(200, 0, 0, 0);
            this.scene.transition({
                target: 'CountDownScene',
                data: {
                    gameThemeNo: this.gameThemeNo,
                },
                // duration: 200,
                duration: 50,
                onUpdate: (_progress: number) => {},
            });
        });
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

