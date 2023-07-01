import { canMove, delBottom, move, rotate, toFinal } from "./core/TetrisRule";
import { createTetris } from "./core/Tetris";
import { GameConfig, SquareConfig } from "./config/GameConfig";
import { Direction, GameOrPre, GameStatus, TimerType } from "./tools/types";
import { SquareGroup } from "./core/SquareGroup";
import $ from 'jquery';
import { GameViewer } from "./viewer/GameViewer";
import { Square } from "./core/Square";


export class Game {
    private static game: Game;
    private _status: GameStatus = GameStatus.INIT;
    private _curTetris?: SquareGroup;
    private _nextTetris: SquareGroup;
    private _timer?: TimerType;
    private _duration: number = 1000;
    private _existArr: Square[] = [];
    private score = 0;

    private constructor(private _viewer: GameViewer) {
        this._viewer.init(this);
        // 防止TS报错 没有意义 因为TS检查不到函数内初始化
        this._nextTetris = createTetris();
        this.createNext();
    }

    static createGame() {
        if (!this.game) {
            this.game = new Game(new GameViewer());
        }
        return this.game;
    }

    start() {
        if (this._status === GameStatus.PLAYING) {
            return;
        }

        if (this._status === GameStatus.GAME_OVER) {
            this.init();
        }

        this._viewer.setScore(this.score);
        !this._curTetris && this.exchangeTetris();
        this._status = GameStatus.PLAYING;
        this.autoDrop();
    }

    private init() {
        this._curTetris?.squareArr.forEach((item) => item.viewer?.remove());
        this._curTetris = undefined;
        this.score = 0;
        this._duration = GameConfig.level[0]
        
        this.createNext();
        this.clearExistArr();
    }

    private createNext() {
        // 改变俄罗斯方块中心 并放入预览框
        this._nextTetris = createTetris();
        this.setPoint(this._nextTetris, GameOrPre.PRE);
        this._viewer.putOnPre(this._nextTetris);
    }

    private clearExistArr() {
        this._existArr.forEach((item) => item.viewer?.remove());
        this._existArr = [];
    }

    /**
     * 交换游戏框和预览框的 俄罗斯方块
     */
    private exchangeTetris() {
        this._curTetris = this._nextTetris;
        this._nextTetris = createTetris();

        this.setPoint(this._curTetris, GameOrPre.GAME);
        this._viewer.putOnGame(this._curTetris);
        this.setPoint(this._nextTetris, GameOrPre.PRE);
        this._viewer.putOnPre(this._nextTetris);

        // 切换俄罗斯方块 并加入界面后 再判断
        this.handleGameOver(this._curTetris);
    }

    /**
     * 因为TS检测不到是否有值 所以只能传递过来
     */
    private handleGameOver(tetris: SquareGroup) {
        if (!canMove(tetris.shape, tetris.centerPoint, this._existArr)) {
            this.clearTimer();
            this._status = GameStatus.GAME_OVER;

            this._viewer.gameOver(this.restart.bind(this));
        }
    }

    private clearTimer() {
        clearInterval(this._timer);
        this._timer = undefined;
    }

    private restart(flag: boolean) {
        flag && this.start();
    }

    private autoDrop() {
        if (this._timer || this._status !== GameStatus.PLAYING) {
            return;
        }

        this._timer = setInterval(() => {
            if (!this._curTetris) {
                this.pause();
                return;
            }

            // 不能移动 返回`false`
            const isHitBottom = !move(this._curTetris, Direction.DOWN, this._existArr);
            if (isHitBottom) {
                this.hitBottom();
            }
        }, this._duration);
    }

    /**
     * 把俄罗斯方块 放在预览框或者游戏框
     */
    private setPoint(tetris: SquareGroup, condition: GameOrPre) {
        let container: string;
        container = condition === GameOrPre.GAME
            ? GameConfig.gameEl
            : GameConfig.preEl;

        let { width, height } = $(container)[0].getBoundingClientRect(),
            point = {
                x: Math.floor(width / SquareConfig.width / 2),
                y: Math.floor(height / SquareConfig.height / 2),
            };

        // 放在游戏的中上方 预览的中间
        container === GameConfig.gameEl && (point.y = 2);
        move(tetris, point, []);
    }

    pause() {
        if (this._status === GameStatus.PLAYING) {
            this._status = GameStatus.PAUSE;
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    move(direction: Direction) {
        if (this._status === GameStatus.PLAYING && this._curTetris) {
            move(this._curTetris!, direction, this._existArr);
        }
    }

    toBottom() {
        this._curTetris
            && this._status === GameStatus.PLAYING
            && toFinal(this._curTetris, this._existArr);
    }

    rotate() {
        if (this._status === GameStatus.PLAYING && this._curTetris) {
            rotate(this._curTetris, this._existArr);
        }
    }

    private hitBottom() {
        this.addExistArr();
        this.exchangeTetris();
        this.setScore();

        let duration = this.changeLevel();
        if (this._duration !== duration) {
            console.log({ duration });
            this._duration = duration;
            this.clearTimer();
            this.autoDrop();
        }
    }

    private setScore() {
        this.score++;
        const score = delBottom(this._existArr);
        this.score += score ** 2 * 10;
        this._viewer.setScore(this.score);
    }

    /**
     * 返回配置表对应分数的定时器时间
     */
    private changeLevel(): number {
        const arr = [],
            { level } = GameConfig;

        for (const key in level) {
            if (!Object.hasOwnProperty.call(level, key)) continue;
            +key <= this.score && arr.push(+key);
        }
        const key = Math.max(...arr);
        return level[key];
    }

    private addExistArr() {
        this._existArr.push(...this._curTetris!.squareArr);
    }
}
