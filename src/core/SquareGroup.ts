import { Square } from "./Square";
import { IPoint, IShape } from "../tools/types";

/**
 * 一组方块 根据形状和中心点创建
 */
export class SquareGroup {
    private _squareArr: ReadonlyArray<Square> = [];
    // 顺时针
    protected isClockwise = true;

    constructor(
        private _shape: IShape,
        private _centerPoint: IPoint,
        private _color: string
    ) {
        const arr: Square[] = [];
        // 中心点 加上形状的坐标 得出每个格子坐标
        this._shape.forEach((p) => {
            const sq = new Square({
                x: p.x + this._centerPoint.x,
                y: p.y + this._centerPoint.y,
            }, this._color);
            arr.push(sq);
        });

        this._squareArr = arr;
        this.setPoint();
    }

    /**
     * 根据形状 改变每个方块数据
     */
    private setPoint() {
        this._shape.forEach((shape, i) => {
            // 根据形状描述数组 改变每个格子坐标
            this._squareArr[i].point = {
                // 中心点加上形状坐标
                x: shape.x + this._centerPoint.x,
                y: shape.y + this._centerPoint.y
            };
        });
    }

    /**
     * 旋转后的形状
     */
    afterShape() {
        return this._shape.map((s) => {
            const { x, y } = s;
            if (this.isClockwise) {
                return {
                    x: -y === -0 ? 0 : -y,
                    y: x,
                };
            }
            else {
                return {
                    x: y,
                    y: -x === -0 ? 0 : -x,
                };
            }
        });
    }

    rotate() {
        const newShape = this.afterShape();
        this.shape = newShape;
    }

    /**
     * 中心改变 自动更新每个方块位置
     */
    set centerPoint(p: IPoint) {
        this._centerPoint = p;
        this.setPoint();
    }

    get centerPoint() {
        return this._centerPoint;
    }

    get squareArr() {
        return this._squareArr;
    }

    get shape() {
        return this._shape;
    }

    set shape(s: IShape) {
        this._shape = s;
        this.setPoint();
    }
}