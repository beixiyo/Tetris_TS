import { IGameConfig } from "../tools/types";

export const SquareConfig = {
    width: 30,
    height: 30,
    color: [
        'red',
        '#fff',
        '#ab7919',
        'deeppink',
        'orange'
    ]
};

export const GameConfig: IGameConfig = {
    xStep: 10,
    yStep: 10,
    level: {
        '0': 1000,
        '50': 800,
        '100': 600,
        '150': 400,
        '200': 200,
        '250': 100,
        '300': 70
    },
    gameEl: '.game',    // 游戏主区域
    preEl: '.next',  // 下一个俄罗斯方块位置
    score: '.score',
    /**
     * 设置总共多少格  *游戏框宽度 / 每个方块宽度*
     */
    setConf(x?: number, y?: number, el?: string) {
        const root = this.gameEl,
            { width, height } = document.querySelector(root)!.getBoundingClientRect(),
            _x = width / SquareConfig.width,
            _y = height / SquareConfig.height;

        this.xStep = x ?? _x;
        this.yStep = y ?? _y;

        el && (this.gameEl = el);
    }
};
