// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    //编辑器属性定义
    properties: {
        zIndex: {
            type: cc.Integer,
            default: 0,
            //使用notify函数监听属性变化
            notify(oldValue) {
                //减少无效赋值
                if (oldValue === this.zIndex) {
                    return;
                }
                this.node.zIndex = this.zIndex;
            }
        }
    },
    onLoad () {
        this.node.zIndex = this.zIndex;
    }
});