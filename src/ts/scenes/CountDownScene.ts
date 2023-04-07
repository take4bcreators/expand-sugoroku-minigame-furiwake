import Phaser from 'phaser';
import { MyFonts } from '../interface/MyFonts'; 
import { SgpjImageEditor } from '../module/SgpjImageEditor';


interface TextConfigs {
    loading: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    loading?: Phaser.GameObjects.Text;
}

interface ImageObjects {
    bg?: Phaser.GameObjects.Image;
    number?: Phaser.GameObjects.Image;
}


export default class CountDownScene extends Phaser.Scene {
    
    private readonly COUNT_START_TIME: number = 3;
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    private images: ImageObjects;
    private timeCounter: number;
    private gameThemeNo: number;
    private bgVideoKey: string;
    
    
    constructor() {
        super({ key: 'CountDownScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        this.images = {};
        this.timeCounter = 0;
        this.gameThemeNo = -1;
        this.bgVideoKey = '';
    }
    
    
    init(data: any) {
        // 前シーンからゲームテーマ情報を受け取る
        this.gameThemeNo = data['gameThemeNo'];
        this.events.on(Phaser.Scenes.Events.TRANSITION_INIT, () => {
          this.cameras.main.setAlpha(0);
        });
        this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
          this.cameras.main.setAlpha(1);
          this.cameras.main.fadeIn(100, 0, 0, 0);
        });
    }
    
    
    preload(): void {
        // 文字スタイルの定義
        this.textConfigs = {
            loading: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 2,
                text: 'Loading...',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 4 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#79B0D2',
                },
            },
        }
        
        // 背景動画
        this.bgVideoKey = 'bg' + this.scene.key;
        this.load.video(this.bgVideoKey, './assets/videos/bgvideo01.mp4', 'loadeddata', false, true);
    }
    
    
    create(): void {
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is' + this.textConfigs);
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
        
        
        // ローディング表示用テキストの配置
        this.texts.loading = this.make.text(this.textConfigs.loading);
        
        // 数字の配置
        this.images.number = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'num1')
        .setDisplaySize(300, 300)
        .setVisible(false)
        ;
        
        // カウントを初期化して実行
        this.timeCounter = this.COUNT_START_TIME;
        this.time.addEvent({
            delay: 1000,
            repeat: 3, // 指定した数値+1回分が実行される
            callback: () => {
                if (this.texts.loading === undefined) {
                    console.error('this.texts.loading is ' + this.texts.loading);
                    return;
                }
                if (this.images.number === undefined) {
                    console.error('this.images.number is ' + this.images.number);
                    return;
                }
                
                if (this.timeCounter === 0) {
                    this.images.number.setVisible(false);
                    // this.cameras.main.fadeOut(20, 0, 0, 0);
                    this.scene.transition({
                        target: 'GamingScene',
                        data: {
                            gameThemeNo: this.gameThemeNo,
                        },
                        duration: 50,
                        onUpdate: (_progress: number) => {},
                    });
                } else {
                    // カウントダウンしている間は対応する数字画像を表示する
                    this.texts.loading.setText('');
                    this.images.number.setTexture('num' + this.timeCounter)
                    .setVisible(true)
                    .setScale(0.1)
                    ;
                }
                this.timeCounter--;
            },
        });
    }
    
    
    update(_time: number, _delta: number): void {
        if (this.images.number !== undefined) {
            const nowScale = this.images.number.scale;
            if (nowScale <= 0.5) {
                this.images.number.setScale(nowScale + 0.08);
            } else {
                this.images.number.setScale(nowScale + 0.01);
            }
        }
    }
    
}

