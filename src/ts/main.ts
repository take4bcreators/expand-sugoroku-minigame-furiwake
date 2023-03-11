import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene';
import DisplayThemeScene from './scenes/DisplayThemeScene';
import CountDownScene from './scenes/CountDownScene';
import GamingScene from './scenes/GamingScene';
import FinishScene from './scenes/FinishScene';
import ResultScene from './scenes/ResultScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'canvas',
    width: window.innerWidth * window.devicePixelRatio, // iPhone 対策
    height: window.innerHeight * window.devicePixelRatio, // iPhone 対策
    zoom: 1 / window.devicePixelRatio, // iPhone 対策
    scale: {
        mode: Phaser.Scale.FIT, // レスポンシブ表示用
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY // PC用左右中央揃え
    },
    scene: [
        TitleScene,
        DisplayThemeScene,
        CountDownScene,
        GamingScene,
        FinishScene,
        ResultScene,
    ],
    fps: {
        target: 24, // 1秒間に24回update
        forceSetTimeOut: true,
    },
    physics: {
        default: 'arcade',  // Arcarde・Matter・Impact
        arcade: {
            debug: true,
            gravity: { y: 300 } // 重力の強さ
        },
    },
};

new Phaser.Game(config);
