// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

window.Global = {
   monNum: Number,


};
cc.Class({
    extends: cc.Component,

    properties: {
      loopPrefab:{
         default:null,
         type:cc.Prefab
      }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
      this.Canvas=cc.find("Canvas");
     },
 

    start () {  //添加才狼人2个或者3个
      this.gnollPool = new cc.NodePool();
      this.enemyNum=Math.floor(Math.random()*2)+2  //Math.floor(Math.random()*2)+2
      Global.monNum=this.enemyNum


      let initCount = this.enemyNum;
      for (let i=0;i<initCount; ++i){
          let gnoll = cc.instantiate(this.loopPrefab); //创建节点
          this.gnollPool.put(gnoll); //通过putInpool接口放入对象池
      }
      for (let i = 0; i<this.enemyNum; ++i){
         this.addLoop(i);
      }

    },

     update (dt) {
      if(Global.monNum==2){
         if(!this.Canvas.getChildByName("gnoll0").alive&&!this.Canvas.getChildByName("gnoll1").alive){
             cc.director.loadScene("map1")
             console.log("hai")
             Global.nowpostion=true
            }
     }else if(Global.monNum==3){
         if(this.Canvas.getChildByName("gnoll0").alive==false&&this.Canvas.getChildByName("gnoll1").alive==false&&this.Canvas.getChildByName("gnoll2").alive==false){
             cc.director.loadScene("map1")
             console.log("我们走")
             Global.nowpostion=true
            }
     }
     },
     addLoop(index){
      let gnoll=null;
      if (this.gnollPool.size()>0){ //通过size接口判断对象池中是否有空闲的对象；
         gnoll = this.gnollPool.get();
      }else {   //如果没有就用cc.instantiate重新创建
         gnoll = cc.instantiate(this.gnollPool);
      }
      this.node.addChild(gnoll);
      gnoll._tag=index;
      gnoll.alive=true;
      gnoll.name = "gnoll" +index;
      gnoll.zIndex=0;
      gnoll.y=-310;
      if(this.enemyNum==2){
         gnoll.x=index*-350;

      }else if(this.enemyNum==3){
         gnoll.x=index*-200;
      }
      

  }
});
