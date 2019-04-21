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
    mon1:true,
    mon2:true,
    nowpostion:false,
    monAtkNum:null,
 };

cc.Class({
    extends: cc.Component,

    properties: {
        gnollhp_label : cc.Label,
        gnollhp_show:cc.Sprite,
        loopPrefab:{
            default:null,
            type:cc.Prefab
         }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

         var manager = cc.director.getCollisionManager();
         manager.enabled = true;
        this.hp_now=2200;
        this.hp_max=2200;
        this.gnollhp_label.string =this.hp_now + '/' + this.hp_max
        this.hp_bili =this.hp_now / this.hp_max;
        this.gnollhp_show.fillRange=this.hp_bili
        this.Canvas=cc.find("Canvas");
        this.energyFlag=false;
        this.Chop=cc.find("Canvas/skill/Chop");
        this.Chop.active=false;
    },

    onCollisionEnter: function (other, self) {
        this._tag=this.bleeding(); //拥碰撞的方法识别目标
       
    },
     beAttackedHP(){
        this.hp_now -=Global.monHp_now 
        this.gnollhp_label.string =this.hp_now + '/' + this.hp_max
        this.hp_bili =this.hp_now / this.hp_max;
        this.gnollhp_show.fillRange=this.hp_bili

        if(Global.BattlePlay=="aoeBlade"){
            this.energyFlag=true;
            this.Dizziness();
        }
        
        if(this.hp_now<=0){
            if(Global.monNum==2){
                console.log(Global.AttackNum)
                if(Global.AttackNum==0){
                    this.Canvas.getChildByName("gnoll0").alive=false;
                    this.Canvas.getChildByName("gnoll0").opacity=0;
                }else if(Global.AttackNum==1){
                    this.Canvas.getChildByName("gnoll1").alive=false;
                    this.Canvas.getChildByName("gnoll1").opacity=0; 
                }
            }
             if(Global.monNum==3){
                if(Global.AttackNum==0){
                    this.Canvas.getChildByName("gnoll0").alive=false;
                    this.Canvas.getChildByName("gnoll0").opacity=0;
                }else if(Global.AttackNum==1){
                    this.Canvas.getChildByName("gnoll1").alive=false;
                    this.Canvas.getChildByName("gnoll1").opacity=0; 
                }else if(Global.AttackNum==2){
                    this.Canvas.getChildByName("gnoll2").alive=false;
                    this.Canvas.getChildByName("gnoll2").opacity=0; 
                }
            }

        }

    },

    bleeding(){
        if(Global.BattlePlay=="sucking"){
            this.beAttackedHP();
        }
         else if(Global.BattlePlay=="dust"){
            this.beAttackedHP();
        }else if(Global.BattlePlay=="sideChop"){
            this.beAttackedHP();
        }else if(Global.BattlePlay=="knife"){
            this.beAttackedHP();
        }else if(Global.BattlePlay=="Light"){
            this.beAttackedHP();
        }else if(Global.BattlePlay=="aoeBlade"){
            this.beAttackedHP();
        }else if(Global.BattlePlay=="starBurst"){
            this.beAttackedHP();
        }else if(Global.BattlePlay=="Boom"){
            this.beAttackedHP();
        }
    

    },
    start () {

    },

     update (dt) {
        /* console.log(Math.floor(Math.random()*2)+1)  */
         this.energy(0.009)
     },

     Dizziness(number){
        var energy=this.node.getChildByName("gnollUI").getChildByName("gnollEnergyBar").getChildByName("Energy")
        var EnergySprite=energy.getComponent(cc.Sprite)
        this.count = 0;
        this.callback = function () {
            if (this.count === 5) {
                // 在第六次执行回调时取消这个计时器
                this.energyFlag=false;
                EnergySprite.fillRange+=number
                this.unschedule(this.callback);
            }
            this.count++;
        }
        this.schedule(this.callback,0.3);
     
     },
      energy(number,numer1){  //number1用于减速

        var energy=this.node.getChildByName("gnollUI").getChildByName("gnollEnergyBar").getChildByName("Energy")
        var EnergySprite=energy.getComponent(cc.Sprite)
        if(this.energyFlag==false){   //this.energyFlag=true的话，晕眩1.5秒，丢失行动值。
            EnergySprite.fillRange+=number
        }else{
            EnergySprite.fillRange+=0

        }
        if(EnergySprite.fillRange>=1){
           EnergySprite.fillRange=0;
           this.AtkNum=Math.floor(Math.random()*4)
           this.playAnimation(this.Chop,"Chop")
           this.Chop.x=300-(this.AtkNum*200)
           Global.monAtkNum=this.AtkNum
        }
      },
      playAnimation(skillname,AnimationName,){ //播放动画

        this.skillname=skillname;
        this.skillname.active=true;
        this. skillnameAnimation=this.skillname.getComponent(cc.Animation);
        this.skillnameAnimation.play(AnimationName)
        this.playingEnd(this.skillname,AnimationName);
      },
      playingEnd(skillname,AnimationName){  //播放结束清除动画
        var animState = this.skillnameAnimation.getAnimationState(AnimationName);
        if (animState) {
          animState.on('finished', (event) => {
              // 处理停止播放时的逻辑
              this.skillname=skillname;
              this.skillname.active=false;
              Global.BattlePlay=null;
          }, this);
       }
       }
});
