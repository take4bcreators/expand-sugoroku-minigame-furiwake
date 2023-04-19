
/**
 * すごろくツール連携用モジュール
 * パラメータ：?mode=sugoroku&key=hogehoge
*/
export class SugorokuConnection {
    /** モードを識別するためのパラメータキー */
    #PARAM_KEY_MODE = 'mode';
    /** すごろくツール連携キーを識別するためのパラメータキー */
    #PARAM_KEY_SG_KEY = 'key';
    /** すごろくモードを識別するためのパラメータ値 */
    #SUGOROKU_MODE_NAME = 'sugoroku';
    /** デバッグ用の戻しキー */
    #SUGOROKU_DEBUG_KEY_NAME = 'debug1234';
    /** すごろくツールへ戻る際に使用するパラメータのキーと値 */
    #RETURN_SUGOROKU_PARAMETERS = {
        /** 状態を表すパラメータキー */
        STATE_KEY: 'state',
        /** 状態を表すパラメータ値 */
        STATE_VALUE: 'minigame',
        /** 連携キーを表すパラメータキー */
        KEY_KEY: 'key',
        /** ランク表すパラメータキー */
        RANK_KEY: 'rank',
    }
    /** すごろくツールに戻る先のパス */
    DEFAULT_SUGOROKU_PAGE_PATH = '../../playing/';
    
    /** ランクを表す文字列 */
    rank: string;
    /** すごろくモードかどうか */
    isSugorokuMode: boolean;
    /** すごろくモードに戻る際に使用する連携キー */
    sugorokuKey: string;
    
    
    /** インスタンス変数の初期化をする */
    constructor() {
        this.rank = 'c';
        this.isSugorokuMode = false;
        this.sugorokuKey = '';
    }
    
    
    /** すごろくモードかどうかをチェックする */
    checkSugorokuMode() {
        // URLパラメータを取得
        const params = new URL(location.href).searchParams;
        const modeParam = params.get(this.#PARAM_KEY_MODE) ?? '';
        this.sugorokuKey = params.get(this.#PARAM_KEY_SG_KEY) ?? '';
        // すごろくモードで合った場合はパラメータなしのURLに変更
        if (modeParam === this.#SUGOROKU_MODE_NAME) {
            this.isSugorokuMode = true;
            history.replaceState(null, '', location.pathname);
            if (this.sugorokuKey === '') {
                console.warn('[SGPJ] [MINIGAME] sugoroku key not found');
                console.log('[SGPJ] [MINIGAME] use key for debugging');
                this.sugorokuKey = this.#SUGOROKU_DEBUG_KEY_NAME;
            }
        }
        return;
    }
    
    /** ランクを保存する */
    setRankValue(rank: string) {
        this.rank = rank;
        return;
    }
    
    /** すごろくツールの画面へ遷移する。isSugorokuMode が false の場合は何もしません */
    returnToSugoroku(path = this.DEFAULT_SUGOROKU_PAGE_PATH): void {
        if (!this.isSugorokuMode) {
            return;
        }
        const p = this.#RETURN_SUGOROKU_PARAMETERS;
        const sugorokuURL = `${path}?${p.STATE_KEY}=${p.STATE_VALUE}&${p.KEY_KEY}=${this.sugorokuKey}&${p.RANK_KEY}=${this.rank}`;
        location.assign(sugorokuURL);
        return;
    }
}
