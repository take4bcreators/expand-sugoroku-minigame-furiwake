


- create関数 の中にスプライトを作る命令を記述

```js
this.physics.add.sprite(x座標, y座標, タグ名);
```




x座標、y座標と、スプライトで利用する画像のタグ名を記述するだけです。
グローバル変数に"player"変数を用意しておき、そこにスプライトを格納しておきます。


```js
const D_WIDTH = 480;
const D_HEIGHT = 320;
let player;// プレイヤーのスプライトを格納する変数

// 省略

function create(){
    console.log("create!!");
    this.add.image(D_WIDTH/2, D_HEIGHT/2, "sky");// 画面の中心に表示します
    player = this.physics.add.sprite(240, 80, "tanuki");// プレイヤー
}

// 省略
```




ゲーム画面内にある物体は、簡単に分けると2種類存在します。

動く物体 (自由に動き回る物体)
動かない物体 (固定されている物体)
先ほどのプレイヤーは、"動く物体"になりますね。

今度は、"動かない物体"を用意し、落下していくプレイヤー(タヌキ)を受け止めてもらいます。
この時、動かない物体をまとめて管理する"staticGroup"を使うととても便利です。

```js
// 省略

function create(){
    console.log("create!!");
    this.add.image(D_WIDTH/2, D_HEIGHT/2, "sky");// 画面の中心に表示します
    player = this.physics.add.sprite(240, 80, "tanuki");// プレイヤー
    let staticGroup = this.physics.add.staticGroup();// 動かない物体をまとめる
    staticGroup.create(D_WIDTH/2, D_HEIGHT-32, "ground");// 地面
    this.physics.add.collider(player, staticGroup);// 衝突処理を設定する
}

// 省略
```



