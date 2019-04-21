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
   monHp_now: null,
   BattlePlay:null,
   AttackNum:null,
};
Array.prototype.remove = function(val) { 
   var index = this.indexOf(val); 
   if (index > -1) { 
   this.splice(index, 1); 
   } 
   };
   
cc.Class({
    extends: cc.Component,

    properties: {
        knighthp_label : cc.Label,
        knighthp_show:cc.Sprite,
        Musketeershp_label : cc.Label,
        Musketeers_show:cc.Sprite,
        Magicianhp_label : cc.Label,
        Magicianhp_show:cc.Sprite,
        Assassinhp_label : cc.Label,
        Assassinhp_show:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {  //技能先在上面注册。然后再playAnimation()中调用。
      var manager = cc.director.getCollisionManager();
      manager.enabled = true;

        this.hp_lowest=0;
        this.treat=false;
        cc.debug.setDisplayStats(false);
        this.knighthp_now=1920;
        this.Musketeershp_now=1280;
        this.Magicianhp_now=1100;
        this.Assassinhp_now=1050;
        this.knighthp_max=1920;
        this.Musketeershp_max=1280;
        this.Magicianhp_max=1100;
        this.Assassinhp_max=1050;
/*         this.knighthp();
        this.Musketeershp();
        this.Magicianhp();
        this.Assassinhp(); */
        this.sucking=cc.find("Canvas/skill/sucking");
        this.sucking.active=false;
        this.dust = cc.find("Canvas/skill/dust");
        this.dust.active=false;
        this.sideChop=cc.find("Canvas/skill/sideChop");
        this.sideChop.active=false;
        this.knife=cc.find("Canvas/skill/knife");
        this.knife.active=false;
        this.AttackNumArr=[0,1,2]
        this.Light=cc.find("Canvas/skill/Light");
        this.Light.active=false;
        this.aoeBlade=cc.find("Canvas/skill/aoeBlade");
        this.aoeBlade.active=false;
        this.starBurst=cc.find("Canvas/skill/starBurst");
        this.starBurst.active=false;
        this.Treatment=cc.find("Canvas/skill/Treatment");
        this.Treatment.active=false;
        this.Boom=cc.find("Canvas/skill/Boom");
        this.Boom.active=false;
        this.Canvas=cc.find("Canvas");

     },

    start () {
      this.TreatFlag=false;
    },


    Energy(path,speed,name,ProportionA,ProportionB,ProportionC,){ //Proportion代表释放该技能的概率
      this.Random=Math.floor(Math.random()*100)+1
        var energy=cc.find(path)
        var EnergySprite=energy.getComponent(cc.Sprite)
        EnergySprite.fillRange+=speed
        if(EnergySprite.fillRange>=1){
           EnergySprite.fillRange=0;
            if(name=="Assassin"){
               if(this.Random<=ProportionA){  //类比下面的就是50%的概率触发该技能。后期要可以调整百分比。先封装一下
                  this.AtkHp(this.sucking,"sucking",180)
               }else if(this.Random<=ProportionB&&this.Random>=ProportionA){
                  this.AtkHp(this.dust,"dust",100)
               }else if(this.Random<=ProportionC&&this.Random>=ProportionB){
                  this.AtkHp(this.sideChop,"sideChop",155)
               } 
            }else if(name=="knight"){
               if(this.Random<=ProportionA){  
                  this.AtkHp(this.knife,"knife",140)
               }else if(this.Random<=ProportionB&&this.Random>=ProportionA){
                  this.AtkHp(this.Light,"Light",100)
               }else if(this.Random<=ProportionC&&this.Random>=ProportionB){
                  this.AtkHp(this.aoeBlade,"aoeBlade",120)
               }
            }else if(name=="Magician"){
               if(this.Random<=ProportionA){  
                  this.AtkHp(this.starBurst,"starBurst",200)
               }else if(this.Random<=ProportionB&&this.Random>=ProportionA){
                  this.playAnimation(this.Treatment,"Treatment")
               }
            }else if(name=="Musketeers"){
               if(this.Random<=ProportionA){  
                  this.AtkHp(this.Boom,"Boom",170)
               }
            }
        }
        
       
    },
     AtkHp(skillname,AnimationName,atkHp){  //计算伤害算送到gnoll
      this.playAnimation(skillname,AnimationName);
      Global.monHp_now=atkHp;
      Global.BattlePlay=AnimationName;
     },

     update (dt) { //更新血量和行动值
       
        this.Energy("Canvas/hero/knightportrait/knightUI/knightEnergyBar/Energy",0.0051,"knight",30,50,100)
        this.Energy("Canvas/hero/Musketeersportrait/MusketeersUI/MusketeersEnergyBar/Energy",0.0045,"Musketeers",90,95,100)
        this.Energy("Canvas/hero/Magicianportrait/MagicianUI/MagicianEnergyBar/Energy",0.005,"Magician",50,80,100)
        this.Energy("Canvas/hero/Assassinportrait/AssassinUI/AssassinEnergyBar/Energy",0.007,"Assassin",25,50,100) //后面的始发百分比是对比前面的。75-50就是25概率触发
        this.hp_now("Canvas/hero/knightportrait/knightUI/hp",this.knighthp_now,this.knighthp_max)
        this.hp_now("Canvas/hero/Musketeersportrait/MusketeersUI/hp",this.Musketeershp_now,this.Musketeershp_max)
        this.hp_now("Canvas/hero/Magicianportrait/MagicianUI/hp",this.Magicianhp_now,this.Magicianhp_max)
        this.hp_now("Canvas/hero/Assassinportrait/AssassinUI/hp",this.Assassinhp_now,this.Assassinhp_max)
        console.log(Global.monAtkNum)
        this.beAttack();
/*         console.log( this.AttackNumArr) */
     },

     playAnimation(skillname,AnimationName,){ //播放动画

       this.skillname=skillname;
       this.skillname.active=true;



       if(Global.monNum<=2){

            Global.AttackNum=Math.floor(Math.random()*2)
            this.skillname.x=155-(330*Global.AttackNum);
              if(this.Canvas.getChildByName("gnoll0").opacity==0){
               Global.AttackNum=1;
                 this.skillname.x=155-(330*1)
              }else if(this.Canvas.getChildByName("gnoll1").opacity==0){
               Global.AttackNum=0;
               this.skillname.x=155-(330*0)
            }
      }else if(Global.monNum==3){ //三个怪的算法还能改进。。
         /* Global.AttackNum=Math.floor(Math.random()*3) */
         

            if(!this.Canvas.getChildByName("gnoll0").alive){
               this.AttackNumArr.remove(0)
               if(!this.Canvas.getChildByName("gnoll1").alive){
                  this.AttackNumArr.remove(1)
               }else if(!this.Canvas.getChildByName("gnoll2").alive){
                  this.AttackNumArr.remove(2)
               }
            }else if(!this.Canvas.getChildByName("gnoll1").alive){
               this.AttackNumArr.remove(1)
               if(!this.Canvas.getChildByName("gnoll0").alive){
                  this.AttackNumArr.remove(0)
               }else if(!this.Canvas.getChildByName("gnoll2").alive){
                  this.AttackNumArr.remove(2)
               }
            }else if(!this.Canvas.getChildByName("gnoll2").alive){
               this.AttackNumArr.remove(2)
               if(!this.Canvas.getChildByName("gnoll0").alive){
                  this.AttackNumArr.remove(0)
               }else if(!this.Canvas.getChildByName("gnoll1").alive){
                  this.AttackNumArr.remove(1)
               }
            }

            for(var i=0;i<=this.AttackNumArr.length-1;i++){
               Global.AttackNum=this.AttackNumArr[i];
               
         }
         this.skillname.x=200-(210*Global.AttackNum); 
      }
      if(skillname==this.Treatment){
         if(this.Assassinhp_now<this.Assassinhp_max/2){
            console.log("治疗")
            this.Treatment.x=300-(this.hp_lowest*200)
            this.TreatFlag=true;
            this.sort();
         }else{
            this.Treatment.x=5000 //血量太满不能用
         }

      }
       this. skillnameAnimation=this.skillname.getComponent(cc.Animation);
       this.skillnameAnimation.play(AnimationName)
       this.playingEnd(this.skillname,AnimationName);
       this.skillname.zIndex=10;
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
     },
/*      knighthp(){
        this.knighthp_now=1980;
        this.knighthp_max=1980;
        this.knighthp_label.string =this.knighthp_now + '/' + this.knighthp_max
     },
     Musketeershp(){
        this.Musketeershp_now=1280;
        this.Musketeershp_max=1280;
        this.Musketeershp_label.string = this.Musketeershp_now + '/' + this.Musketeershp_max;
     },
     Magicianhp(){
        this.Magicianhp_now=1100;
        this.Magicianhp_max=1100;
        this.Magicianhp_label.string = this.Magicianhp_now + '/' + this.Magicianhp_max;
     },
     Assassinhp(){
        this.Assassinhp_now=1050;
        this.Assassinhp_max=1050;
        this.Assassinhp_label.string = this.Assassinhp_now + '/' + this.Assassinhp_max;
     }, */
    hp_now(path,hpNow,hpMax){
     var hp_path=cc.find(path)
     var hp_now=hpNow;
     var hp_max=hpMax
     var hp_bili=hp_now/hp_max;
     var _this=hp_path.getChildByName("hp_label");
/*      _this.Label.string = hp_now + '/' + hp_max; */
     if(hpMax==1920){
      this.knighthp_label.string=hp_now + '/' + hp_max
      
     }else if(hp_max==1280){
        this.Musketeershp_label.string=hp_now + '/' + hp_max
     }else if(hp_max==1100){
      this.Magicianhp_label.string=hp_now + '/' + hp_max
     }else if(hp_max==1050){
      this.Assassinhp_label.string=hp_now + '/' + hp_max
     }
     var hp_nowSprite=hp_path.getChildByName("hp_now").getComponent(cc.Sprite)
     hp_nowSprite.fillRange=hp_bili;

    },
    sort(){   //按照血量的比例加血而不是通过当前血量
      if(this.TreatFlag==true){
         var minHPbili=[];
         var knightHpBili = this.knighthp_show.fillRange
         var MusketeersHpBili = this.Musketeers_show.fillRange
         var MagicianBili = this.Magicianhp_show.fillRange
         var AssassinBili = this.Assassinhp_show.fillRange
         minHPbili.push(knightHpBili,MusketeersHpBili,MagicianBili,AssassinBili)
         minHPbili.sort();
         var min =minHPbili.shift()
         if(min==this.knighthp_show.fillRange){
            this.hp_lowest=3
            this.knighthp_now+=140;

         }else if(min == this.Musketeers_show.fillRange){
            this.hp_lowest=2
            this.Musketeershp_now+=140;
         }else if(min == this.Magicianhp_show.fillRange){
            this.hp_lowest=1
            this.Magicianhp_now+=140;
         }else {
            this.hp_lowest=0;
            this.Assassinhp_now+=140;
         }
      }
    },
   beAttack(){
      if(Global.monAtkNum==0){
         this.Assassinhp_now-=1
      }else if(Global.monAtkNum==1){
         this.Magicianhp_now-=1
      }else if(Global.monAtkNum==2){
         this.Musketeershp_now-=1
      }else if(Global.monAtkNum==3){
         this.knighthp_now-=1
      }
   }


});
