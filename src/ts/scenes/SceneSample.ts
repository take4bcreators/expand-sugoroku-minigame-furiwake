import Phaser from 'phaser';

export default class SceneSample extends Phaser.Scene {
    
    constructor() {
        super({ key: 'SceneSample', active: false });
    }
    
    preload(): void {
        console.log('preload 実行');
        
    }
    
    create(): void {
        console.log('create 実行');
        
    }
    
    update(_time: number, _delta: number): void {
        // console.log('update 実行');
        
    }
    
}

