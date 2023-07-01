import { SquareGroup } from "./SquareGroup";
import { IPoint } from "../tools/types";
import {  getColor, getRandom, getRandomPoint } from "../tools/utils";


/**
 * @param centerPoint 中心点
 * @returns 随机挑选一种形状、中心点、颜色 创建一个俄罗斯方块
 */
export function createTetris(centerPoint: IPoint = getRandomPoint()): SquareGroup {
    const Tetris = shapeArr[getRandom(0, shapeArr.length)];
    const color = getColor()

    return new Tetris(centerPoint, color);
}

/**
 * 部分形状一直旋转会改变位置 所以重写了部分形状旋转逻辑
 * 打开`rotate`注释 即可限制旋转
 */
export class TShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: -1 }
            ],
            _centerPoint,
            _color
        );
    }
}

export class LShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: -1, y: 0 },
                { x: -2, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: -1 }
            ],
            _centerPoint,
            _color
        );
    }

    // rotate(): void {
    //     super.rotate();
    //     this.isClockwise = !this.isClockwise;
    // }
}

export class LMirrorShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: -1 }
            ],
            _centerPoint,
            _color
        );
    }

    // rotate(): void {
    //     super.rotate();
    //     this.isClockwise = !this.isClockwise;
    // }
}

export class SShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: 1 },
                { x: 0, y: 0 }
            ],
            _centerPoint,
            _color
        );
    }

    // rotate(): void {
    //     super.rotate();
    //     this.isClockwise = !this.isClockwise;
    // }
}

export class SMirrorShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: 1 },
                { x: 0, y: 0 }
            ],
            _centerPoint,
            _color
        );
    }

    // rotate(): void {
    //     super.rotate();
    //     this.isClockwise = !this.isClockwise;
    // }
}

export class SquareShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 }
            ],
            _centerPoint,
            _color
        );
    }
    
    rotate(): void {
        return;
    }
}

export class LineShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 0 }
            ],
            _centerPoint,
            _color
        );
    }
}

export class verticalShape extends SquareGroup {
    constructor(
        _centerPoint: IPoint,
        _color: string
    ) {
        super(
            [
                { x: 0, y: 1 },
                { x: 0, y: 2 },
                { x: 0, y: -1 },
                { x: 0, y: 0 }
            ],
            _centerPoint,
            _color
        );
    }
}

export class UShape extends SquareGroup {

    constructor(
        _centerPoint: IPoint,
        _color: string) {
        super(
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: -1 },
                { x: 1, y: -1 }
            ],
            _centerPoint,
            _color
        );
    }

    // rotate(): void {
    //     super.rotate();
    //     this.isClockwise = !this.isClockwise;
    // }
}

export const shapeArr = [
    SquareShape,
    SMirrorShape,
    SShape,
    LMirrorShape,
    LShape,
    TShape,
    LineShape,
    verticalShape,
    UShape
];