

export class SgpjAnimAssist {
    
    constructor() {
    }
    
    simpleScale(textObject: Phaser.GameObjects.Text, mode: 'down' | 'up', changeScale: number): void;
    simpleScale(imageObject: Phaser.GameObjects.Image, mode: 'down' | 'up', changeScale: number): void;
    simpleScale(textObject: Phaser.GameObjects.Text, mode: 'down' | 'up', limitAndChangeScale: [number, number], ...moreLimitAndChangeScale: [number, number][]): void;
    simpleScale(imageObject: Phaser.GameObjects.Image, mode: 'down' | 'up', limitAndChangeScale: [number, number], ...moreLimitAndChangeScale: [number, number][]): void;
    simpleScale(arg1: Phaser.GameObjects.Text | Phaser.GameObjects.Image, arg2: 'down' | 'up', arg3: number | [number, number], ...arg4: [number, number][]): void {
        if (arguments.length === 3 && typeof arg3 === 'number') {
            const [gameObject, mode, changeScale] = [arg1, arg2, arg3];
            switch (mode) {
                case 'up':
                    gameObject.setScale(gameObject.scale + changeScale);
                    break;
                case 'down':
                    gameObject.setScale(gameObject.scale - changeScale);
                    break;
                default:
                    break;
            }
        } else if (typeof arg3 === 'object') {
            const [gameObject, mode, limitAndChangeScale, moreLimitAndChangeScale] = [arg1, arg2, arg3, arg4];
            let concatList: [number, number][] = [];
            concatList.push(limitAndChangeScale);
            if (moreLimitAndChangeScale !== undefined) {
                for (const laca of moreLimitAndChangeScale) {
                    concatList.push(laca);
                }
            }
            loop:
            for (const cl of concatList) {
                const limitScale: number = cl[0];
                const changeScale: number = cl[1];
                switch (mode) {
                    case 'up':
                        if (gameObject.scale < limitScale) {
                            gameObject.setScale(gameObject.scale + changeScale);
                            break loop;
                        }
                        break;
                    case 'down':
                        if (gameObject.scale > limitScale) {
                            gameObject.setScale(gameObject.scale - changeScale);
                            break loop;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return;
    }
    
    simpleFade(textObject: Phaser.GameObjects.Text, mode: 'out' | 'in', changeAlpha: number): void;
    simpleFade(imageObject: Phaser.GameObjects.Image, mode: 'out' | 'in', changeAlpha: number): void;
    simpleFade(textObject: Phaser.GameObjects.Text, mode: 'out' | 'in', limitAndChangeAlpha: [number, number], ...moreLimitAndChangeAlpha: [number, number][]): void;
    simpleFade(imageObject: Phaser.GameObjects.Image, mode: 'out' | 'in', limitAndChangeAlpha: [number, number], ...moreLimitAndChangeAlpha: [number, number][]): void;
    simpleFade(arg1: Phaser.GameObjects.Text | Phaser.GameObjects.Image, arg2: 'out' | 'in', arg3: number | [number, number], ...arg4: [number, number][]): void {
        if (arguments.length === 3 && typeof arg3 === 'number') {
            const [gameObject, mode, changeAlpha] = [arg1, arg2, arg3];
            switch (mode) {
                case 'in':
                    gameObject.setAlpha(gameObject.alpha + changeAlpha);
                    break;
                case 'out':
                    gameObject.setAlpha(gameObject.alpha - changeAlpha);
                    break;
                default:
                    break;
            }
        } else if (typeof arg3 === 'object') {
            const [gameObject, mode, limitAndChangeAlpha, moreLimitAndChangeAlpha] = [arg1, arg2, arg3, arg4];
            let concatList: [number, number][] = [];
            concatList.push(limitAndChangeAlpha);
            if (moreLimitAndChangeAlpha !== undefined) {
                for (const laca of moreLimitAndChangeAlpha) {
                    concatList.push(laca);
                }
            }
            loop:
            for (const cl of concatList) {
                const limitAlpha: number = cl[0];
                const changeAlpha: number = cl[1];
                switch (mode) {
                    case 'in':
                        if (gameObject.alpha < limitAlpha) {
                            gameObject.setAlpha(gameObject.alpha + changeAlpha);
                            break loop;
                        }
                        break;
                    case 'out':
                        if (gameObject.alpha > limitAlpha) {
                            gameObject.setAlpha(gameObject.alpha - changeAlpha);
                            break loop;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return;
    }
    
}

