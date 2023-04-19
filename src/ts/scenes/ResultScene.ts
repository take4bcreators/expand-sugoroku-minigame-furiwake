import Phaser from 'phaser';
import { RankInfo } from '../interface/RankInfo'
import { MyFonts } from '../interface/MyFonts'; 
import { SgpjImageEditor } from '../module/SgpjImageEditor';
import LoadingScene from './LoadingScene';


interface TextConfigs {
    result: Phaser.Types.GameObjects.Text.TextConfig;
    pointText1: Phaser.Types.GameObjects.Text.TextConfig;
    pointText2: Phaser.Types.GameObjects.Text.TextConfig;
    rankText1: Phaser.Types.GameObjects.Text.TextConfig;
    rankText2: Phaser.Types.GameObjects.Text.TextConfig;
    button1: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    result?: Phaser.GameObjects.Text;
    pointText1?: Phaser.GameObjects.Text;
    pointText2?: Phaser.GameObjects.Text;
    rankText1?: Phaser.GameObjects.Text;
    rankText2?: Phaser.GameObjects.Text;
    button1?: Phaser.GameObjects.Text;
}

interface ImageObjects {
    result?: Phaser.GameObjects.Image;
}

export default class ResultScene extends Phaser.Scene {
    
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    private userPoint: number;
    private userRank: string;
    private images: ImageObjects;
    
    constructor() {
        super({ key: 'ResultScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        this.userPoint = -1;
        this.userRank = '';
        this.images = {};
    }
    
    
    init(data: any) {
        this.userPoint = data['userPoint'];
    }
    
    
    preload(): void {
        this.textConfigs = {
            result: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 8,
                text: 'RESULT',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#ffffff',
                    align: 'center',
                },
            },
            pointText1: {
                x: (this.sys.canvas.width / 2) + (this.sys.canvas.width / 18),
                y: (this.sys.canvas.height / 2) - (this.sys.canvas.height / 10),
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.ShareTechMono,
                    fontSize: 20 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: '#ffffff',
                    align: 'center',
                },
            },
            pointText2: {
                x: (this.sys.canvas.width / 2) - (this.sys.canvas.width / 12),
                y: (this.sys.canvas.height / 2) - (this.sys.canvas.height / 10),
                text: 'Score',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.ShareTechMono,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: '#ffffff',
                    align: 'center',
                },
            },
            rankText1: {
                x: (this.sys.canvas.width / 2) + (this.sys.canvas.width / 18),
                y: (this.sys.canvas.height / 2) + (this.sys.canvas.height / 10),
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.ShareTechMono,
                    fontSize: 15 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: '#ffffff',
                    align: 'center',
                },
            },
            rankText2: {
                x: (this.sys.canvas.width / 2) - (this.sys.canvas.width / 12),
                y: (this.sys.canvas.height / 2) + (this.sys.canvas.height / 10),
                text: 'Rank',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.ShareTechMono,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '400',
                    color: '#ffffff',
                    align: 'center',
                },
            },
            button1: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height - (this.sys.canvas.height / 20 * 3),
                text: 'もう1回プレイする',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 5 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#ffffff',
                    align: 'center',
                },
            },
        }
        
        // jsonファイルの読込
        this.load.json('rankinfo', './config/rankinfo.json');
    }
    
    
    create(): void {
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is ' + this.textConfigs);
            return;
        }
        
        // 画像を配置する
        this.images.result = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 8, 'result');
        const ime = new SgpjImageEditor();
        let sf = ime.getScaleFactorFromVmin(10, this.images.result, this);
        if (window.innerWidth <= 767) {
            sf = ime.getScaleFactorFromVmin(50, this.images.result, this);
        } else if (window.innerWidth <= 1280) {
            sf = ime.getScaleFactorFromVmin(30, this.images.result, this);
        }
        this.images.result.setDisplaySize(this.images.result.width * sf, this.images.result.height * sf);
        
        // 背面画像操作・すごろくモード判定のためにローディングシーンを取得する
        const loadingScene = this.scene.get('LoadingScene') as LoadingScene;
        
        // 各方向のガイドを非表示にする
        loadingScene.hideDirGuide();
        
        // ランクを判定する
        const rankInfo: RankInfo = this.cache.json.get('rankinfo');
        if (this.userPoint >= rankInfo.s.point) {
            this.userRank = 'S';
        } else if (this.userPoint >= rankInfo.a.point) {
            this.userRank = 'A';
        } else if (this.userPoint >= rankInfo.b.point) {
            this.userRank = 'B';
        } else {
            this.userRank = 'C';
        }
        
        // テキストを配置する
        this.texts.pointText1 = this.make.text(this.textConfigs.pointText1).setText(this.userPoint.toString());
        this.texts.pointText2 = this.make.text(this.textConfigs.pointText2);
        this.texts.rankText1 = this.make.text(this.textConfigs.rankText1).setText(this.userRank);
        this.texts.rankText2 = this.make.text(this.textConfigs.rankText2);
        this.texts.button1 = this.make.text(this.textConfigs.button1);
        
        // すごろくモードの場合はランクを格納してボタンの文字列を変化させる
        if (loadingScene.sgcon.isSugorokuMode) {
            loadingScene.sgcon.setRankValue(this.userRank);
            this.texts.button1.setText('タップですごろくに戻る');
        }
        
        // ボタンクリック時はすごろくモードであるかに応じて挙動を変化
        this.texts.button1.setInteractive().on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            if (loadingScene.sgcon.isSugorokuMode) {
                loadingScene.sgcon.returnToSugoroku();
                return;
            }
            this.scene.transition({
                target: 'TitleScene',
                data: {},
                duration: 50,
                onUpdate: (_progress: number) => {},
            });
        });
        
        // 登場時のアニメーションを設定
        const startAnimeTargets = [this.texts.pointText1, this.texts.rankText1];
        for (const startAnimeTarget of startAnimeTargets) {
            this.tweens.add({
                targets: startAnimeTarget,
                alpha: { from: 0.0, to: 1.0 },
                scale: { from: 0.0, to: 1.0 },
                ease: Phaser.Math.Easing.Back.Out,
                duration: 300,
                yoyo: false
            });
        }
        
        // 定期的なアニメーションを設定
        const loopAnimeTargets = [this.texts.button1];
        for (const loopAnimeTarget of loopAnimeTargets) {
            this.tweens.add({
                targets: loopAnimeTarget,
                alpha: { from: 0.0, to: 1.0 },
                scale: { from: 0.0, to: 1.0 },
                ease: Phaser.Math.Easing.Back.Out,
                duration: 300,
                yoyo: false
            });
        }
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

