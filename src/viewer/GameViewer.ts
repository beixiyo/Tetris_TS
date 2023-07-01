import { Game } from "../Game";
import { GameConfig } from "../config/GameConfig";
import { SquareGroup } from "../core/SquareGroup";
import { Direction, ICb, IGameViewer, Keyboard as IKeyboard } from "../tools/types";
import { SquareViewer } from "./SquareViewer";
import $ from 'jquery';

export class GameViewer implements IGameViewer {
    private keyboard: IKeyboard | undefined;
    private mask?: JQuery<HTMLElement>;
    private modal?: JQuery<HTMLElement>;

    init(game: Game): void {
        GameConfig.setConf();

        const { move } = game;
        this.keyboard = {
            'ArrowDown': move.bind(game, Direction.DOWN),
            'ArrowLeft': move.bind(game, Direction.LEFT),
            'ArrowRight': move.bind(game, Direction.RIGHT),
            'Space': game.rotate.bind(game),
            'KeyP': game.pause.bind(game),
            'NumpadEnter': game.start.bind(game),
            'Enter': game.start.bind(game),
            'toBottom': game.toBottom.bind(game)
        };
        this.bindEvent();
    }

    /**
     * 把俄罗斯方块放入预览框
     * @param tetris 
     */
    putOnPre(tetris: SquareGroup): void {
        tetris.squareArr.forEach((sq) => {
            sq.viewer = new SquareViewer(sq, $(GameConfig.preEl));
        });
    }

    /**
     * 把预览框的俄罗斯方块 放在游戏区域
     * @param tetris 
     */
    putOnGame(tetris: SquareGroup): void {
        tetris.squareArr.forEach((sq) => {
            sq.viewer?.remove();
            sq.viewer?.setRoot(GameConfig.gameEl);
        });
    }

    gameOver(cb: ICb) {
        this.createMask(cb);
        this.mask?.appendTo(document.body);
    }

    createMask(cb: ICb) {
        // jquery每次会解绑方法 所以每次都要绑定
        if (this.mask) {
            this.addEvent(this.mask, cb)
            return;
        }

        this.mask = $('<div>').addClass('game-over');
        this.modal = $('<div>').addClass('modal').text('游戏结束 点击重开').appendTo(this.mask);
        this.addEvent(this.mask, cb)
    }

    addEvent(mask: JQuery<HTMLElement>, cb: ICb) {
        mask.on('click', () => {
            cb(true);
            this.mask?.remove()
        })
    }

    setScore(score: number): void {
        $(GameConfig.score).text(score.toString());
    }

    bindEvent() {
        window.addEventListener('keydown', (e) => {
            // 阻止按键造成页面滚动
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', ({ code }) => {
            const event = this.keyboard?.[code as keyof typeof this.keyboard];
            event && event();
        });

        window.addEventListener('keydown', this.DoubleKeyDown());
    }

    DoubleKeyDown() {
        // let isDouble: TimerType;
        // return ((e: KeyboardEvent) => {
        //     if (e.code !== 'ArrowDown') return;

        //     if (isDouble) {
        //         keyboard.toBottom();
        //     }
        //     else {
        //         isDouble = setTimeout(() => {
        //             clearTimeout(isDouble);
        //             isDouble = undefined;
        //         }, 150);
        //     }
        // });

        let st = Date.now();
        return (e: KeyboardEvent) => {
            if (e.code !== 'ArrowDown') return;

            const now = Date.now();
            if (now - st <= 180) {
                this.keyboard?.toBottom();
            }
            st = now;
        };
    }
}