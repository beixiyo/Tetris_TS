import { Square } from "../core/Square";
import { IViewer } from "../tools/types";
import $ from 'jquery';
import { SquareConfig } from "../config/GameConfig";

export class SquareViewer implements IViewer {
    private dom?: JQuery<HTMLElement>;
    private isRemove = false;

    constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) { }

    /**
     * 根据俄罗斯方块数据 刷新显示界面
     */
    show(): void {
        if (this.isRemove) return;
        const { width, height } = SquareConfig;

        if (!this.dom) {
            this.dom = $('<div>').css({
                width: width + 'px',
                height: height + 'px',
                position: 'absolute',
                // border + outline  解决中间边框过粗
                border: '1px solid #ccc',
                outline: '1px solid  #ccc',
                boxSizing: 'border-box',
            }).appendTo(this.container);
        }

        this.dom.css({
            left: this.square.point.x * width + 'px',
            top: this.square.point.y * height + 'px',
            backgroundColor: this.square.color
        });
    }

    remove() {
        this.isRemove = true;
        return this.dom?.remove();
    }

    restore() {
        this.isRemove = false;
    }

    setRoot(el: string) {
        this.remove();
        this.restore();
        this.dom?.appendTo($(el));
    }
}