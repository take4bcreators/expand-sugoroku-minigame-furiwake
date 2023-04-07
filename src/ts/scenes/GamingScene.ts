import Phaser from 'phaser';
import { GameTheme } from '../interface/GameTheme'
import { MyFonts } from '../interface/MyFonts'; 
import { SgpjImageEditor } from '../module/SgpjImageEditor';
import { SgpjAnimAssist } from "../module/SgpjAnimAssist";
import SgpjNumberGenerator from '../module/SgpjNumberGenerator';
// スワイプ用プラグイン（要：yarn add phaser3-rex-plugins）https://rexrainbow.github.io/phaser3-rex-notes/docs/site/gesture-swipe/
import { Swipe } from 'phaser3-rex-plugins/plugins/gestures.js';


type GameState = 'GameStart' | 'Last3Count' | 'Finish' | undefined;
type SwipeDirection = 'left' | 'right' | 'up' | 'down' | undefined;
type SwipeExt = Swipe & {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
};

interface TextConfigs {
    center: Phaser.Types.GameObjects.Text.TextConfig;
    quiz: Phaser.Types.GameObjects.Text.TextConfig;
    timer: Phaser.Types.GameObjects.Text.TextConfig;
    correct: Phaser.Types.GameObjects.Text.TextConfig;
    incorrect: Phaser.Types.GameObjects.Text.TextConfig;
    userPoint: Phaser.Types.GameObjects.Text.TextConfig;
    guideA: Phaser.Types.GameObjects.Text.TextConfig;
    guideB: Phaser.Types.GameObjects.Text.TextConfig;
    guideC: Phaser.Types.GameObjects.Text.TextConfig;
    guideD: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    center?: Phaser.GameObjects.Text;
    quiz?: Phaser.GameObjects.Text;
    timer?: Phaser.GameObjects.Text;
    correct?: Phaser.GameObjects.Text;
    incorrect?: Phaser.GameObjects.Text;
    userPoint?: Phaser.GameObjects.Text;
    guideA?: Phaser.GameObjects.Text;
    guideB?: Phaser.GameObjects.Text;
    guideC?: Phaser.GameObjects.Text;
    guideD?: Phaser.GameObjects.Text;
}

// interface ImageObjects {
//     bg?: Phaser.GameObjects.Image;
// }


export default class GamingScene extends Phaser.Scene {
    
    private readonly COUNT_START_TIME: number = 15;
    private readonly START_TEXT: string = 'START!!';
    private readonly CORRECT_TEXT: string = '正解';
    private readonly INCORRECT_TEXT: string = '不正解';
    private readonly NEXT_SHOW_INTERVAL_MSEC: number = 500;
    private readonly TEXT_MOVE_SPEED: number = 80;
    
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    // private images: ImageObjects;
    private swipeInput: Swipe | undefined;
    private gameThemes: GameTheme[] | undefined;
    private gameState: GameState;
    private swipeDirection: SwipeDirection;
    private anim: SgpjAnimAssist;
    private timeCounter: number;
    private gameThemeNo: number;
    private nowContentIndex: number;
    private nowUserPoint: number;
    private numgen: SgpjNumberGenerator;
    private bgVideoKey: string;
    
    
    constructor() {
        super({ key: 'GamingScene', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        // this.images = {};
        this.swipeInput = undefined;
        this.swipeDirection = undefined;
        this.timeCounter = 0;
        this.gameState = undefined;
        this.gameThemeNo = -1;
        this.nowContentIndex = -1;
        this.gameThemes = undefined;
        this.nowUserPoint = 0;
        this.anim = new SgpjAnimAssist();
        this.numgen = new SgpjNumberGenerator();
        this.bgVideoKey = '';
    }
    
    init(data: any) {
        this.gameThemeNo = data['gameThemeNo'];
    }
    
    preload(): void {
        this.textConfigs = {
            center: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 2,
                text: this.START_TEXT,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 20 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#92E4A7',
                },
            },
            quiz: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 2,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: undefined,
                    fontStyle: '700',
                    color: '#79B0D2',
                    align: 'center',
                    wordWrap: { width: this.sys.canvas.width * 0.7, useAdvancedWrap: true },
                },
            },
            timer: {
                x: this.sys.canvas.width / 8,
                y: this.sys.canvas.height / 8 * 7,
                text: this.COUNT_START_TIME.toString(),
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.Hind,
                    fontSize: 22 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: '#79B0D2',
                },
            },
            correct: {
                x: this.sys.canvas.width / 2,
                y: (this.sys.canvas.height / 2) + (this.sys.canvas.height / 4),
                text: this.CORRECT_TEXT,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 9 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'blue',
                },
            },
            incorrect: {
                x: this.sys.canvas.width / 2,
                y: (this.sys.canvas.height / 2) + (this.sys.canvas.height / 4),
                text: this.INCORRECT_TEXT,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 9 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'red',
                },
            },
            userPoint: {
                x: 100,
                y: 100,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 7 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'gray',
                },
            },
            guideA: {
                x: this.sys.canvas.width / 10,
                y: this.sys.canvas.height / 2,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 4 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'gray',
                },
            },
            guideB: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 10,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 4 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'gray',
                },
            },
            guideC: {
                x: this.sys.canvas.width / 10 * 9,
                y: this.sys.canvas.height / 2,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 4 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'gray',
                },
            },
            guideD: {
                x: this.sys.canvas.width / 2,
                y: this.sys.canvas.height / 10 * 9,
                text: undefined,
                origin: {x: 0.5, y: 0.5},
                style: {
                    fontFamily: MyFonts.google.MPLUS1p,
                    fontSize: 4 * window.devicePixelRatio + 'vmin',
                    fontStyle: '700',
                    color: 'gray',
                },
            },
        }
        // 背景動画
        this.bgVideoKey = 'bg' + this.scene.key;
        this.load.video(this.bgVideoKey, './assets/videos/bgvideo01.mp4', 'loadeddata', false, true);
    }
    
    
    create(): void {
        console.log('GamingScene create 実行');
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is ' + this.textConfigs);
            return;
        }
        
        // 背景の配置
        // this.images.bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'bg01');
        // const ime = new SgpjImageEditor();
        // this.images.bg.setScale(ime.imageCoverScaler(this.images.bg, this));
        
        // 背景動画の配置と再生
        const bgVideo = this.add.video(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.bgVideoKey);
        const ime = new SgpjImageEditor();
        bgVideo.setScale(ime.imageCoverScaler(bgVideo, this));
        bgVideo.play(true);
        
        
        // ポイントリセット・状態のセット
        this.nowUserPoint = 0;
        this.numgen.clear();
        this.gameState = 'GameStart';
        
        // ゲームテーマ情報読み込み
        this.gameThemes = this.cache.json.get('gametheme');
        if (this.gameThemes === undefined) {
            console.error('this.gameThemes is ' + this.gameThemes);
            return;
        }
        const themeContent = this.gameThemes[this.gameThemeNo].content;
        this.numgen.generate(themeContent.length);
        this.nowContentIndex = this.numgen.getNextNumber(true);
        
        // クイズテキストの生成
        this.texts.quiz = this.make.text(this.textConfigs.quiz)
        .setText(this.getContentsItem())
        .setStyle({fontSize: this.gameThemes[this.gameThemeNo].textsize * window.devicePixelRatio + 'vmin'})
        .setScale(0.1)
        ;
        
        // 中央の情報表示テキストの生成
        this.texts.center = this.make.text(this.textConfigs.center)
        .setScale(0.1)
        .setAlpha(1.0)
        ;
        
        // 正解表示用テキストの生成
        this.texts.correct = this.make.text(this.textConfigs.correct)
        .setScale(0.1)
        .setAlpha(0.5)
        .setVisible(false)
        ;
        
        // 不正解表示用テキストの生成
        this.texts.incorrect = this.make.text(this.textConfigs.incorrect)
        .setScale(0.1)
        .setAlpha(0.5)
        .setVisible(false)
        ;
        
        // タイムカウント表示の生成
        this.texts.timer = this.make.text(this.textConfigs.timer);
        
        // ポイント表示用テキストの生成
        this.texts.userPoint = this.make.text(this.textConfigs.userPoint)
        .setText(this.nowUserPoint.toString())
        ;
        
        // 上下左右のガイドテキストの生成
        this.texts.guideA = this.make.text(this.textConfigs.guideA)
        .setText(this.gameThemes[this.gameThemeNo].guide.a)
        ;
        this.texts.guideB = this.make.text(this.textConfigs.guideB)
        .setText(this.gameThemes[this.gameThemeNo].guide.b)
        ;
        this.texts.guideC = this.make.text(this.textConfigs.guideC)
        .setText(this.gameThemes[this.gameThemeNo].guide.c)
        ;
        this.texts.guideD = this.make.text(this.textConfigs.guideD)
        .setText(this.gameThemes[this.gameThemeNo].guide.d)
        ;
        
        // スワイプを判定
        // 参照：https://rexrainbow.github.io/phaser3-rex-notes/docs/site/gesture-swipe/
        this.swipeInput = new Swipe(this, {
            enable: true,
            bounds: undefined,
            threshold: 10,
            velocityThreshold: 100,
            dir: '4dir',
        });
        
        // スワイプ時のリスナー設定
        this.swipeInput.on('swipe', (swipe: SwipeExt, _gameObject: Phaser.GameObjects.GameObject, _lastPointer: Phaser.Input.Pointer) => {
            if (this.swipeDirection !== undefined) {
                return;
            }
            
            // スワイプ情報取得
            this.swipeDirection = this.dumpSwipeDirection(swipe);
            
            // 正誤判定処理
            const directionID = this.converteSwipeDirectionToID(this.swipeDirection);
            const answerIDs = this.getContentsAnsers();
            let isCorrect: boolean = false;
            for (const answerId of answerIDs) {
                if (answerId === directionID) {
                    isCorrect = true;
                }
            }
            if (isCorrect) {
                this.nowUserPoint++;
                if (this.texts.correct !== undefined) {
                    this.texts.correct
                    .setVisible(true)
                    .setScale(0.1)
                    ;
                }
            } else {
                if (this.texts.incorrect !== undefined) {
                    this.texts.incorrect
                    .setVisible(true)
                    .setScale(0.1)
                    ;
                }
            }
            if (this.texts.userPoint !== undefined) {
                this.texts.userPoint.setText(this.nowUserPoint.toString());
            }
            
            // スワイプ後のリセット処理
            this.time.delayedCall(this.NEXT_SHOW_INTERVAL_MSEC, () => {
                this.swipeDirection = undefined;
                if (this.texts.quiz !== undefined) {
                    switch (this.gameState) {
                        case 'GameStart':
                        case 'Last3Count':
                            this.nowContentIndex = this.numgen.getNextNumber(true);
                            this.texts.quiz
                            .setPosition(this.sys.canvas.width / 2, this.sys.canvas.height / 2)
                            .setText(this.getContentsItem())
                            .setScale(0.1)
                            ;
                            break;
                        case 'Finish':
                            break;
                        default:
                            break;
                    }
                }
                if (this.texts.correct !== undefined) {
                    this.texts.correct.setVisible(false);
                }
                if (this.texts.incorrect !== undefined) {
                    this.texts.incorrect.setVisible(false);
                }
            });
        }, this);
        
        // カウントを初期化して実行
        this.timeCounter = this.COUNT_START_TIME;
        this.time.addEvent({
            delay: 1000,                            // 単位：msec
            repeat: this.COUNT_START_TIME - 1,      // 指定した数値+1回分を実行
            callback: () => {
                if (this.texts.timer === undefined) {
                    console.error('this.texts.timer is ' + this.texts.timer);
                    return;
                }
                if (this.texts.center === undefined) {
                    console.error('this.texts.center is ' + this.texts.center);
                    return;
                }
                
                // タイマーカウントダウン
                this.timeCounter--;
                
                // 現在のタイムに応じて表示を変化させる
                if (this.timeCounter > 3) {
                    this.texts.timer.setText(this.timeCounter.toString());
                } else if (this.timeCounter > 0) {
                    this.texts.timer.setText('');
                    this.texts.center
                    .setText(this.timeCounter.toString())
                    .setStyle({
                        fontFamily: MyFonts.google.MPLUS1p,
                        fontSize: 50 * window.devicePixelRatio + 'vmin',
                        fontStyle: '700',
                        color: '#ff4530',
                    })
                    .setAlpha(0.5)
                    .setScale(0.1)
                    ;
                    this.gameState = 'Last3Count';
                } else {
                    this.texts.timer.setText('');
                    this.swipeDirection = undefined;
                    this.gameState = 'Finish';
                    this.cameras.main.fadeOut(20, 0, 0, 0);
                    this.scene.transition({
                        target: 'FinishScene',
                        data: {
                            userPoint: this.nowUserPoint,
                        },
                        duration: 10,
                        onUpdate: (_progress: number) => {
                        },
                    });
                }
            },
        });
    }
    
    
    update(_time: number, _delta: number): void {
        // メインテキストの拡大アニメーション
        if (this.texts.quiz !== undefined) {
            this.anim.simpleScale(this.texts.quiz, 'up', [0.5, 0.2], [1.0, 0.01]);
        }
        
        // スワイプ時の文字移動アニメーション
        if (this.texts.quiz !== undefined && this.swipeDirection !== undefined) {
            const nowX = this.texts.quiz.x;
            const nowY = this.texts.quiz.y;
            switch (this.swipeDirection) {
                case 'left':
                    this.texts.quiz.setPosition(nowX - this.TEXT_MOVE_SPEED, nowY);
                    break;
                case 'right':
                    this.texts.quiz.setPosition(nowX + this.TEXT_MOVE_SPEED, nowY);
                    break;
                case 'up':
                    this.texts.quiz.setPosition(nowX, nowY - this.TEXT_MOVE_SPEED);
                    break;
                case 'down':
                    this.texts.quiz.setPosition(nowX, nowY + this.TEXT_MOVE_SPEED);
                    break;
                default:
                    break;
            }
        }
        
        // 情報文字の拡大アニメーション
        if (this.texts.center !== undefined) {
            switch (this.gameState) {
                case 'GameStart':
                    this.anim.simpleScale(this.texts.center, 'up', [0.5, 0.2], [1.0, 0.01]);
                    this.anim.simpleFade(this.texts.center, 'out', [0.5, 0.02], [0.0, 0.1]);
                    break;
                case 'Last3Count':
                    this.anim.simpleScale(this.texts.center, 'up', [0.8, 0.2], [1.0, 0.01]);
                    this.anim.simpleFade(this.texts.center, 'out', 0.01);
                    break;
                case 'Finish':
                    break;
                default:
                    break;
            }
        }
        
        if (this.texts.correct !== undefined && this.texts.correct.visible) {
            this.anim.simpleScale(this.texts.correct, 'up', [0.5, 0.2], [1.0, 0.1]);
        }
        if (this.texts.incorrect !== undefined && this.texts.incorrect.visible) {
            this.anim.simpleScale(this.texts.incorrect, 'up', [0.5, 0.2], [1.0, 0.1]);
        }
        
    }
    
    
    // スワイプ方向取得用メソッド
    private dumpSwipeDirection(swipe: SwipeExt): SwipeDirection {
        if (swipe === undefined) {
            console.error('swipe is ' + swipe);
            return;
        }
        
        const directions: SwipeDirection[] = ['left', 'right', 'up', 'down'];
        let returnDirection: SwipeDirection = undefined;
        for (let i = 0; i < directions.length; i++) {
            const direction: SwipeDirection = directions[i];
            if (direction === undefined) {
                console.warn('direction is ' + direction);
                continue;
            }
            if (swipe[direction]) {
                if (returnDirection === undefined) {
                    returnDirection = direction;
                }
            }
        }
        return returnDirection;
    }
    
    
    private getContentsItem(): string {
        if (this.gameThemes === undefined) {
            console.error('this.gameThemes is ' + this.gameThemes);
            return '';
        }
        return this.gameThemes[this.gameThemeNo].content[this.nowContentIndex].item;
    }
    
    
    private getContentsAnsers(): string[] {
        if (this.gameThemes === undefined) {
            console.error('this.gameThemes is ' + this.gameThemes);
            return [];
        }
        return this.gameThemes[this.gameThemeNo].content[this.nowContentIndex].anser;
    }
    
    
    private converteSwipeDirectionToID(swipeDirection: SwipeDirection): string {
        const convertTable: Map<SwipeDirection, string> = new Map([
            ['left', 'a'],
            ['up', 'b'],
            ['right', 'c'],
            ['down', 'd'],
        ]);
        const convertedText = convertTable.get(swipeDirection);
        if (convertedText === undefined) {
            console.error('convertedText is ' + convertedText);
            return '';
        }
        return convertedText;
    }
    
}

