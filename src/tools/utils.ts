import { GameConfig } from "../config/GameConfig";
import { IPoint, TimerType } from "./types";


/**
 * @returns 返回整数 不包含最大值
 */
export function getRandom(min: number, max: number) {
    return Math.floor(min + Math.random() * max - min);
}


/**
 * @returns 根据配置大小 返回随机中心点坐标
 */
export function getRandomPoint(): IPoint {
    return {
        x: getRandom(0, GameConfig.xStep + 1),
        y: getRandom(0, GameConfig.yStep + 1)
    };
}


export function getColor() {
    return `rgb(${getRandom(40, 200)}, ${getRandom(40, 200)}, ${getRandom(40, 200)})`
}


/**
 * 添加错误提示 typeof是为了保留参数类型提示
 */
export const addPrompt: typeof _addPrompt = throttle(_addPrompt);


export function debounce(fn: Function, duration: number = 500) {
    let timer: TimerType;

    return function <T>(this: T, ...args: unknown[]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            return fn.call(this, ...args);
        }, duration);
    };
}


export function throttle(fn: Function, duration: number = 1000) {
    let st = Date.now();

    return function (this: object) {
        const now = Date.now();
        if (now - st >= duration) {
            st = now;
            return fn.apply(this, arguments);
        }
    };
}


let p: HTMLElement, timer: TimerType;
function _addPrompt(word: string = '超出边界', duration: number = 3000) {
    if (!p) {
        p = document.createElement('p');
        p.className = 'prompt';
    }
    p.innerText = word;
    document.body.appendChild(p);

    !timer && (timer = setTimeout(() => {
        p.remove();
        clearTimeout(timer);
        timer = undefined;
    }, duration));
}
