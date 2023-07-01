import { IPoint, IViewer } from "../tools/types"


/**
 * 每个方块的数据类 提供了视图类后 改变属性会自动刷新页面
 */
export class Square {
    private _viewer?: IViewer;
    private _point: IPoint;
    private _color: string;

    constructor(
        p: IPoint = { x: 0, y: 0 },
        c: string = ''
    ) {
        this._point = p;
        this._color = c;
    }

    get point() {
        return this._point;
    }

    set point(point) {
        this._point = point;
        this.show()
    }

    get color() {
        return this._color;
    }

    set color(c) {
        this._color = c;
        this.show()
    }

    get viewer() {
        return this._viewer;
    }

    set viewer(view) {
        this._viewer = view;
        this.show()
    }

    /**
     * 调用显示类 刷新页面
     */
    show() {
        if (this._viewer) {
            this._viewer.show()
        }
    }
}


