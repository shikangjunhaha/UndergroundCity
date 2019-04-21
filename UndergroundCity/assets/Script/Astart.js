let Grid = cc.Class({
    ctor(){
        this.x = 0;
        this.y = 0;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parent = null;
        this.type = 0; // -1障碍物， 0正常， 1目标点， 2起点
    }
    
});

window.Global = {
    endNewX:null,
    endNewY:null,
 };

let AStar = cc.Class({
    extends: cc.Component,

    properties:{
        target:cc.Node,
        map: cc.Graphics,
    },

    update(){
        
        this._gridW = 50;   // 单元格子宽度
        this._gridH = 50;   // 单元格子高度
        this.targetX=Math.floor(this.target.x / (this._gridW + 2))  //当前play的位置
        this.targetY=Math.floor(this.target.y / (this._gridW + 2))
       console.log()

    },

    onLoad(){
        
        console.log(Global.nowpostion)
        if(Global.nowpostion){
            var mon1=cc.find("Canvas/Ghoul")
            mon1.active=false;
            this.target.x=Global.endNewX*50+25
            this.target.y=Global.endNewY*50+25
        }
        this._gridW = 50;   // 单元格子宽度
        this._gridH = 50;   // 单元格子高度
        this.mapH = 50;     // 纵向格子数量
        this.mapW = 50;     // 横向格子数量
        this.pathLength=0;
        this.mobilePath=[];
        this.targetX=Math.floor(this.target.x / (this._gridW + 2))  //当前play的位置
        this.targetY=Math.floor(this.target.y / (this._gridW + 2))
        this.is8dir = false; // 是否8方向寻路

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.gridsList = new Array(this.mapW + 1);
        for (let col=0;col<this.gridsList.length; col++){
            this.gridsList[col] = new Array(this.mapH + 1);
        }
        for (let col=0; col<= this.mapW; col++){
            for (let row=0; row<=this.mapH; row++){
                this.addGrid(col, row, 0);
            }
        }
        
        console.log(this.map)
    },

    onTouchMove(event){
        let pos = event.getLocation(); //返回鼠标在的位置
        this. x = Math.floor(pos.x / (this._gridW + 2)); //鼠标触摸在二维数组的位置
        this. y = Math.floor(pos.y / (this._gridH + 2));
        if (this.gridsList[this.x][this.y].type == 0){
            this.gridsList[this.x][this.y].type = -1;       
        }
        cc.log(this.x + "," + this.y);
        
        this.initMap();
    },
    
    onTouchEnd(){
        // 开始寻路
        this.findPath(cc.v2(this.targetX,this.targetY), cc.v2(this.x, this.y));
        console.log(this.pathLength)
        console.log(this.mobilePath)
        Global.endNewX=this.x;
        Global.endNewY=this.y
        console.log(Global.endNewX,Global.endNewY)

            var Xmove=0;
            this.schedule(function() {  //0.5秒走一步 
                this.target.x=this.mobilePath[Xmove*2]*50+25
                this.target.y=this.mobilePath[Xmove*2+1]*50+25
/*                 console.log()
                console.log(this.target.x,this.target.y) */
                Xmove++;
            }, 0.5, this.pathLength-2, 0);
            


    },

    initMap(){
        this.openList = [];
        this.closeList = [];
        this.path = [];
        // 初始化格子二维数组
        
        for (let col=0;col<this.gridsList.length; col++){
            this.gridsList[col] = new Array(this.mapH + 1);
        }

        this.map.clear();
        for (let col=0; col<= this.mapW; col++){
            for (let row=0; row<=this.mapH; row++){
                this.addGrid(col, row, 0);
            }
        }
         
        // 设置起点和终点
        if(Global.nowpostion==true){
            var startX =Global.endNewX
            var startY =Global.endNewY
        }else{
            var startX = this.targetX
            var startY = this.targetY
        }

       /*  console.log(startX,startY) */
        let endX = this.x;
        let endY = this.y;
        this.gridsList[endX][endY].type = 1;

        this.gridsList[startX][startY].type = 2;
    },

    addGrid(x, y, type){
        let grid = new Grid();
        grid.x = x;
        grid.y = y;
        grid.type = type;
        this.gridsList[x][y] = grid;
    },

    _sortFunc(x, y){
        return x.f - y.f;
    },

    generatePath(grid){
        this.mobilePath=[];
        this.path.push(grid);
        while (grid.parent){
            grid = grid.parent;
            this.path.push(grid);
        }
        this.pathLength=this.path.length  //记录长度
        cc.log("path.length: " + this.path.length);
        for (let i=0; i<this.path.length; i++){
            // 起点终点不覆盖，方便看效果
            if (i!=0 && i!= this.path.length){
                let grid = this.path[i];
                cc.log(grid.x,grid.y)
                this.mobilePath.push(grid.x,grid.y)  //记录每一步的路      
            }
        }
    },

    findPath(startPos,endPos ){
        let startGrid = this.gridsList[startPos.x][startPos.y];
        let endGrid = this.gridsList[endPos.x][endPos.y];

        this.openList.push(endGrid);
        console.log(this.openList[0])
        let curGrid = this.openList[0];
        while (this.openList.length > 0 && curGrid.type != 2){
            // 每次都取出f值最小的节点进行查找
            curGrid = this.openList[0];
            if (curGrid.type == 2){
                cc.log("find path success.");
                this.generatePath(curGrid);
                return;
            }

            for(let i=-1; i<=1; i++){
                for(let j=-1; j<=1; j++){
                    if (i !=0 || j != 0){
                        let col = curGrid.x + i;
                        let row = curGrid.y + j;
                        if (col >= 0 && row >= 0 && col <= this.mapW && row <= this.mapH
                            && this.gridsList[col][row].type != -1
                            && this.closeList.indexOf(this.gridsList[col][row]) < 0){
                                if (this.is8dir){
                                    // 8方向 斜向走动时要考虑相邻的是不是障碍物
                                    if (this.gridsList[col-i][row].type == -1 || this.gridsList[col][row-j].type == -1){
                                        continue;
                                    }
                                } else {
                                    // 四方形行走
                                    if (Math.abs(i) == Math.abs(j)){
                                        continue;
                                    }
                                }

                                // 计算g值
                                let g = curGrid.g + parseInt(Math.sqrt(Math.pow(i*10,2) + Math.pow(j*10,2)));
                                if (this.gridsList[col][row].g == 0 || this.gridsList[col][row].g > g){
                                    this.gridsList[col][row].g = g;
                                    // 更新父节点
                                    this.gridsList[col][row].parent = curGrid;
                                }
                                // 计算h值 manhattan估算法
                                this.gridsList[col][row].h = Math.abs(endPos.x - col) + Math.abs(endPos.y - row);
                                // 更新f值
                                this.gridsList[col][row].f = this.gridsList[col][row].g + this.gridsList[col][row].h;
                                // 如果不在开放列表里则添加到开放列表里
                                if (this.openList.indexOf(this.gridsList[col][row]) < 0){
                                    this.openList.push(this.gridsList[col][row]);
                                }
                                // 重新按照f值排序（升序排列)
                                this.openList.sort(this._sortFunc);
                        }
                    }
                }
            }
            // 遍历完四周节点后把当前节点加入关闭列表
            this.closeList.push(curGrid);
            // 从开发列表把当前节点移除
            this.openList.splice(this.openList.indexOf(curGrid), 1);
            if (this.openList.length <= 0){
                cc.log("find path failed.");
            }
        }
    },

    
});