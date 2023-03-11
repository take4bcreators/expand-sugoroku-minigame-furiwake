
export class SgpjImageEditor {
    
    constructor() {
    }
    
    imageCoverScaler(image: Phaser.GameObjects.Image, scene: Phaser.Scene): number {
        const scaleX = scene.sys.canvas.width / image.width
        const scaleY = scene.sys.canvas.height / image.height
        const scale = Math.max(scaleX, scaleY)
        return scale;
    }
    
}
