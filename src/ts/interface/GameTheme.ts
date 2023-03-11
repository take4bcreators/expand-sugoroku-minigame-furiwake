
// gametheme.json 読み込み用型定義
export interface GameTheme {
    title: string;
    description: string;
    textsize: number;
    guide: {
        a: string;
        b: string;
        c: string;
        d: string;
    }
    content: {
        item: string;
        anser: string[];
    }[];
}
