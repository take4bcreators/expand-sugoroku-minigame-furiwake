import Phaser from 'phaser';
import { MyFonts } from '../interface/MyFonts'; 
import { SgpjImageEditor } from "../module/SgpjImageEditor";


interface TextConfigs {
    center: Phaser.Types.GameObjects.Text.TextConfig;
}

interface TextObjects {
    center?: Phaser.GameObjects.Text;
}

interface ImageObjects {
    bg?: Phaser.GameObjects.Image;
}


export default class SceneTemplate extends Phaser.Scene {
    
    private textConfigs: TextConfigs | undefined;
    private texts: TextObjects;
    private images: ImageObjects;
    
    
    constructor() {
        super({ key: 'SceneTemplate', active: false });
        this.textConfigs = undefined;
        this.texts = {};
        this.images = {};
    }
    
    
    preload(): void {
        console.log('preload 実行');
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
                    color: 'black',
                    align: 'center',
                },
            },
        }
    }
    
    
    create(): void {
        console.log('create 実行');
        if (this.textConfigs === undefined) {
            console.error('this.textConfigs is ' + this.textConfigs);
            return;
        }
        
        this.images.bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'bg01');
        const ime = new SgpjImageEditor();
        this.images.bg.setScale(ime.imageCoverScaler(this.images.bg, this));
        
        this.texts.center = this.make.text(this.textConfigs.center);
    }
    
    
    update(_time: number, _delta: number): void {
    }
    
}

