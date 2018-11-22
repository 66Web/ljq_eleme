<template>
  <div class="goods">
     <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" 
              :key="item.name" 
              class="menu-item" 
              :class="{'current': currentIndex===index}"
              @click="selectMenu(index, $event)">
            <span class="text" border-1px>
               <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
     </div>
     <div class="foods-wrapper" ref="foodsWrapper">
       <ul>
         <li v-for="item in goods" :key="item.name" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" 
                  :key="food.name" 
                  class="food-item border-1px"
                  @click="selectFood(food, $event)">
                 <div class="icon">
                    <img :src="food.icon">
                 </div>
                 <div class="content">
                     <span class="name">{{food.name}}</span>
                     <p class="desc">{{food.description}}</p>
                     <div class="extra">
                         <span>月售{{food.sellcount}}份</span>
                         <span>好评率{{food.rating}}%</span>
                     </div>
                     <div class="price">
                         <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                     </div>
                     <div class="cartcontrol-wrapper">
                         <v-cartcontrol :food="food" @increment="_drop"></v-cartcontrol>
                     </div>
                 </div>
              </li>
            </ul>
         </li>
       </ul>
     </div>
     <v-shopcart ref="shopcart"
                 :select-foods="selectFoods"
                 :delivery-price="seller.deliveryPrice" 
                 :min-price="seller.minPrice"></v-shopcart>
     <v-food :food="selectedFood" ref="food" @increment="_drop"></v-food>
  </div>
</template>

<script type="es6">
import BScroll from 'better-scroll';
import shopcart from '@/components/shopcart/shopcart'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import food from '@/components/food/food'

const ERR_OK = 0;

export default {
  components: {
     'v-shopcart': shopcart,
     'v-cartcontrol': cartcontrol,
     'v-food': food
  },
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods:[],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
     currentIndex() {
       for(let i=0; i<this.listHeight.length; i++){
         let height1 = this.listHeight[i];
         let height2 = this.listHeight[i+1];
         if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){
           return i;
         }
       }
       return 0;
     },
     selectFoods() {
       let foods = [];
       this.goods.forEach((good) => {
         good.foods.forEach((food) => {
           if(food.count){
             foods.push(food);
           }
         })
       });
       return foods;
     }
  },
  created () {
    this.classMap = ['decrease','descount','guarantee','invoice','special'],

    this.$http.get('/api/goods')          
          .then((res) => { 
             res = res.body;
             if (res.errno === ERR_OK) {
                  this.goods = res.data;
                  // console.log(this.goods)
                  this.$nextTick(()=>{
                    this._initScroll();
                    this._calculateHeight();
                  })
             }               
          }, (err) => { 

    })
  },
  methods: {
      _initScroll() {
          this.meunScroll=new BScroll(this.$refs.menuWrapper,{
            click: true //使better-scroll可点击，默认派发一个点击事件
          });
          this.foodsScroll=new BScroll(this.$refs.foodsWrapper,{
            click: true,
            probeType: 3 //监听了实时滚动的位置
          });

          this.foodsScroll.on('scroll', (pos) => {
            this.scrollY = Math.abs(Math.round(pos.y));
          })
      },
      _calculateHeight() {
          let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
          let height = 0;
          this.listHeight.push(height);
          for(let i=0; i<foodList.length; i++){
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
          }
      },
      selectMenu(index, event) {
          if(!event._constructed){//浏览器原生的点击事件
              return;
          }
          // console.log(index)
          let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
          let el = foodList[index];
          this.foodsScroll.scrollToElement(el, 300);
      },
      _drop(target) {
        //体验优化，异步执行下落动画
        this.$nextTick(() => {
             this.$refs.shopcart.dropMove(target);
        })    
      },
      selectFood(food, event) {
         if(!event._constructed){//浏览器原生的点击事件
              return;
         }
         this.selectedFood = food;
         this.$refs.food.show();
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "../../common/stylus/mixin"

    .goods
        display: flex
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
           flex: 0 0 80px
           width: 80px
           background: #f3f5f7
           .menu-item
              display: table
              height: 54px
              width: 56px
              line-height: 14px
              padding: 0 12px
              &.current
               position: relative
               z-index: 10
               margin-top: -1px
               background: #ffffff
               font-weight: 700
               .text
                 border-none()
              .icon
                 display: inline-block
                 vertical-align: top
                 width: 12px
                 height: 12px
                 margin-right: 2px
                 background-size: 12px 12px
                 background-repeat: no-repeat
                 &.decrease
                   bg-image('decrease_3')
                 &.descount
                   bg-image('discount_3')
                 &.guarantee
                   bg-image('guarantee_3')
                 &.invoice
                   bg-image('invoice_3')
                 &.special
                   bg-image('special_3')
              .text
                 display: table-cell
                 width: 56px
                 vertical-align: middle
                 border-1px(rgba(7, 17, 27, 0.1))
                 font-size: 12px  
        .foods-wrapper
           flex: 1
           .title
              padding left 14px
              height: 26px
              line-height: 26px
              border-left: 2px solid #d9ddel
              font-size: 12px
              color: rgb(147, 153, 159)
              background: #f3f5f7
           .food-item
              display: flex
              margin: 18px
              padding-bottom: 18px
              border-1px(rgba(7, 17, 27, 0.1))
              &:last-child
                 border-none()
                 margin-bottom: 0
              .icon
                 flex: 0 0 57px
                 margin-right: 10px
              .content
                 flex: 1
                 .name
                    margin: 2px 0 8px 0
                    height: 17px
                    line-height: 17px
                    font-size: 17px
                    color: rgb(7, 17, 27)
                 .desc, .extra     
                    font-size: 10px
                    color: rgb(147, 153, 159)
                 .desc
                    margin-bottom: 8px
                    line-height: 12px
                 .extra
                    line-height: 10px
                    .count   
                      margin-right: 12px
                 .price
                    font-weight: 700
                    line-height: 24px
                    .now
                      margin-right: 8px
                      font-size: 14px
                      color: rgb(240, 20, 20)
                    .old
                      text-decoration: line-through
                      font-size: 10px
                      color: rgb(147, 153, 159)
                 .cartcontrol-wrapper
                    position: absolute
                    right: 0
                    bottom: 12px
                      



               
</style>