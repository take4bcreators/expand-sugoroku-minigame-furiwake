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
    private numberImageBaseScale: number;
    
    
    constructor() {
        super({ key: 'CountDownScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        this.images = {};
        this.timeCounter = 0;
        this.gameThemeNo = -1;
        this.numberImageBaseScale = 1.0;
    }
    
    
    init(data: any) {
        // 前シーンからゲームテーマ情報を受け取る
        this.gameThemeNo = data['gameThemeNo'];
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
    }
    
    
    create(): void {
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is' + this.textConfigs);
            return;
        }
        
        
        // ローディング表示用テキストの配置
        this.texts.loading = this.make.text(this.textConfigs.loading);
        
        // 数字の配置
        this.images.number = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'num1');
        const ime = new SgpjImageEditor();
        this.numberImageBaseScale = ime.getScaleFactorFromVmin(30, this.images.number, this);
        this.images.number.setScale(this.numberImageBaseScale).setVisible(false);
        
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
                    .setScale(this.numberImageBaseScale * 0.1)
                    ;
                }
                this.timeCounter--;
            },
        });
    }
    
    
    update(_time: number, _delta: number): void {
        if (this.images.number !== undefined) {
            const nowScale = this.images.number.scale;
            if (nowScale <= (this.numberImageBaseScale * 0.6)) {
                this.images.number.setScale(nowScale + 0.08);
            } else {
                this.images.number.setScale(nowScale + 0.01);
            }
        }
    }
    
}

