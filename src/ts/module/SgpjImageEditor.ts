
export class SgpjImageEditor {
    
    constructor() {
    }
    
    imageCoverScaler(image: Phaser.GameObjects.Image, scene: Phaser.Scene): number {
        const scaleX = scene.sys.canvas.width / image.width
        const scaleY = scene.sys.canvas.height / image.height
        const scale = Math.max(scaleX, scaleY)
        return scale;
    }
    
    getScaleFactorFromVmin(vmin: number, image: Phaser.GameObjects.Image, scene: Phaser.Scene, useDisplaySize: boolean = false): number {
        let imageWidth = image.width;
        // let imageHeight = image.height;
        if (useDisplaySize) {
            imageWidth = image.displayWidth;
            // imageHeight = image.displayHeight;
        }
        const vminNum = vmin * 0.01;
        let scaleFactor = 0;
        if (scene.sys.canvas.width < scene.sys.canvas.height) {
            scaleFactor = (scene.sys.canvas.width * vminNum) / imageWidth;
        } else {
            // scaleFactor = (scene.sys.canvas.height * vminNum) / imageHeight;
            scaleFactor = (scene.sys.canvas.height * vminNum) / imageWidth;
        }
        return scaleFactor;
    }
}
