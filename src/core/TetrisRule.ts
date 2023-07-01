import { SquareGroup } from "./SquareGroup";
import { Direction, IPoint, IShape } from "../tools/types";
import { GameConfig } from "../config/GameConfig";
import { Square } from "./Square";
import { addPrompt } from "../tools/utils";

/**
 * 
 * @param shape 形状
 * @param centerPoint 中心点
 * @param existArr 已存在方块数组
 * @returns 不能移动返回`false`
 */
export const canMove = (shape: IShape, centerPoint: IPoint, existArr: Square[]): boolean => {
    // 中心点 加上形状的坐标 得出每个格子坐标
    const tarPoint: IPoint[] = shape.map((s) => ({
        x: centerPoint.x + s.x,
        y: centerPoint.y + s.y
    }));

    let res = tarPoint.some((t) => (
        t.x >= GameConfig.xStep
        || t.y >= GameConfig.yStep
        || t.x < 0
        || t.y < 0
    ));

    if (!existArr) {
        return !res;
    }
    else {
        if (res) {
            return false;
        }

        res = tarPoint.some(t => existArr.some(e => {
            return e.point.x === t.x && e.point.y === t.y;
        }));
        return !res;
    }
};

function isPoint(tar: any): tar is IPoint {
    return typeof tar.x === 'number' && typeof tar.y === 'number';
}

/**
 * @returns 移动到目标坐标 触底返回`false`
 */
export function move(tetris: SquareGroup, targetPoint: IPoint | Direction, existArr: Square[]): boolean {
    if (isPoint(targetPoint)) {
        if (canMove(tetris.shape, targetPoint, existArr)) {
            tetris.centerPoint = targetPoint;
            return true;
        }
        return false;
    }
    else {
        const direction = targetPoint;
        const map = {
            [Direction.LEFT]: {
                x: tetris.centerPoint.x - 1,
                y: tetris.centerPoint.y
            },
            [Direction.RIGHT]: {
                x: tetris.centerPoint.x + 1,
                y: tetris.centerPoint.y
            },
            [Direction.DOWN]: {
                x: tetris.centerPoint.x,
                y: tetris.centerPoint.y + 1
            },
        };

        return move(tetris, map[direction], existArr);
    }
}


/**
 * 直接到边界 默认向下
 */
export function toFinal(tetris: SquareGroup, existArr: Square[], direction: Direction = Direction.DOWN) {
    while (move(tetris, direction, existArr)) { }
}


export function rotate(tetris: SquareGroup, existArr: Square[]): boolean {
    const newShape = tetris.afterShape();
    if (canMove(newShape, tetris.centerPoint, existArr)) {
        tetris.rotate();
        return true;
    }

    addPrompt();
    return false;
}


/**
 * @returns 删除能删除的行 并返回行数
 */
export function delBottom(existArr: Square[]) {
    const yArr = existArr.map((item) => item.point.y),
        min = Math.min(...yArr),
        max = Math.max(...yArr);

    let num = 0;
    // 当前需判断删除行的范围
    for (let y = min; y <= max; y++) {
        if (delLine(existArr, y)) num++;
    }
    return num;
}

function delLine(existArr: Square[], y: number): boolean {
    // 找出一行内 y坐标符合的点位
    const sqArr = existArr.filter((item) => item.point.y === y);
    if (sqArr.length >= GameConfig.xStep) {
        sqArr.forEach((sq) => {
            // 填满一行 并且有显示类时 则删除
            sq.viewer?.remove();
            existArr.splice(existArr.indexOf(sq), 1);
        });

        // 补缺空行
        existArr.filter(sq => sq.point.y < y).forEach((sq) => {
            sq.point = {
                x: sq.point.x,
                y: sq.point.y + 1
            };
        });
        return true;
    }
    return false;
}