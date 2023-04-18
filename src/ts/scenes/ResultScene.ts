import Phaser from 'phaser';
import { RankInfo } from '../interface/RankInfo'
import { MyFonts } from '../interface/MyFonts'; 
// import { SgpjImageEditor } from '../module/SgpjImageEditor';


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


export default class ResultScene extends Phaser.Scene {
    
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    private userPoint: number;
    private userRank: string;
    
    
    constructor() {
        super({ key: 'ResultScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        this.userPoint = -1;
        this.userRank = '';
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
                    color: '#92E4A7',
                    align: 'center',
                },
            },
            pointText1: {
                x: this.sys.canvas.width / 2,
                y: (this.sys.canvas.height / 2) - (this.sys.canvas.height / 5),
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 20 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#92E4A7',
                    align: 'center',
                },
            },
            pointText2: {
                x: this.sys.canvas.width / 2,
                y: (this.sys.canvas.height / 2) - (this.sys.canvas.height / 20),
                text: 'ポイント',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 8 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#92E4A7',
                    align: 'center',
                },
            },
            rankText1: {
                x: this.sys.canvas.width / 2,
                y: (this.sys.canvas.height / 2) + (this.sys.canvas.height / 40 * 9),
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 15 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#92E4A7',
                    align: 'center',
                },
            },
            rankText2: {
                x: this.sys.canvas.width / 2,
                y: (this.sys.canvas.height / 2) + (this.sys.canvas.height / 10),
                text: 'ランク',
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 6 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#92E4A7',
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
                    color: '#92E4A7',
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
        
        // ランクの判定
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
        
        // テキストの配置
        this.texts.pointText1 = this.make.text(this.textConfigs.pointText1).setText(this.userPoint.toString());
        this.texts.pointText2 = this.make.text(this.textConfigs.pointText2);
        this.texts.result = this.make.text(this.textConfigs.result);
        this.texts.rankText1 = this.make.text(this.textConfigs.rankText1).setText(this.userRank);
        this.texts.rankText2 = this.make.text(this.textConfigs.rankText2);
        this.texts.button1 = this.make.text(this.textConfigs.button1)
        .setInteractive()
        .on('pointerdown', (_pointer: Phaser.Input.Pointer) => {
            this.scene.transition({
                target: 'TitleScene',
                data: {},
                duration: 50,
                onUpdate: (_progress: number) => {},
            });
        });
        
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

