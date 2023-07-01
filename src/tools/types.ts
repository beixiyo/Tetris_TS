import { Game } from "../Game";
import { SquareGroup } from "../core/SquareGroup";

export interface IPoint {
    // 监控`Point`整体 被修改自动改变页面
    readonly x: number;
    readonly y: number;
}

export interface IViewer {
    show(): void;
    remove(): void | JQuery<HTMLElement>;
    restore(): void;
    setRoot(el: string): void;
}

// 监控`Shape`整体 被修改自动改变页面
export type IShape = ReadonlyArray<IPoint>;

export type TimerType = string | number | NodeJS.Timeout | undefined;

export enum GameStatus {
    INIT,
    PLAYING,
    PAUSE,
    GAME_OVER
}

export enum Direction {
    LEFT,
    RIGHT,
    DOWN
}

export interface ICb {
    (restart: boolean): void;
}
export interface IGameViewer {
    putOnPre(tetris: SquareGroup): void;
    putOnGame(tetris: SquareGroup): void;
    setScore(score: number): void;
    init(game: Game): void;
    gameOver(cb: ICb): void;
    createMask(cb: ICb): void;
    addEvent(mask: JQuery<HTMLElement>, cb: ICb): void;
}

export enum GameOrPre {
    GAME,
    PRE
}

export interface Keyboard {
    'ArrowDown': () => void;
    'ArrowLeft': () => void;
    'ArrowRight': () => void;
    'Space': () => void;
    'KeyP': () => void;
    'NumpadEnter': () => void;
    'Enter': () => void;
    'toBottom': () => void;
}

interface ILevel {
    [key: string]: number;
}

export interface IGameConfig {
    xStep: number,
    yStep: number,
    level: ILevel,
    gameEl: string,
    preEl: string,
    score: string,
    /**
     * 设置总共多少格  *游戏框宽度 / 每个方块宽度*
     */
    setConf: (x?: number, y?: number, el?: string) => void;
}