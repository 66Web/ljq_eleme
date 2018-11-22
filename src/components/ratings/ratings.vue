<template>
  <div class="ratings" ref="ratings">
    <div>
       <div class="ratings-content">
           <div class="overview">
              <div class="overview-left">
                 <h1 class="score">{{seller.score}}</h1>
                 <div class="title">综合评分</div>
                 <div class="rank">高于周边商家{{seller.rankRate}}%</div>
              </div>
              <div class="overview-right">
                 <div class="score-wrapper">
                     <span class="title">服务态度</span>
                     <v-star :size="36" :score="seller.serviceScore" class="star"></v-star>
                     <span class="score">{{seller.serviceScore}}</span>
                 </div>
                 <div class="score-wrapper">
                     <span class="title">商品评分</span>
                     <v-star :size="36" :score="seller.foodScore" class="star"></v-star>
                     <span class="score">{{seller.foodScore}}</span>
                 </div>
                 <div class="delivery-wrapper">
                     <span class="title">送达时间</span>
                     <span class="delivery">{{seller.deliveryTime}}分钟</span>
                 </div>
              </div>
           </div>
       </div>
       <v-split></v-split>
       <v-ratingselect :select-type="selectType" :only-content="onlyContent"
                       :ratings="ratings" @increment="incrementTotal"></v-ratingselect>
       <div class="rating-wrapper">
           <ul>
             <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating, index) in ratings" :key="index" class="rating-item border-1px">
               <div class="avatar">
                  <img :src="rating.avatar" width="28" height="28">
               </div>
               <div class="content">
                  <h1 class="name">{{rating.username}}</h1>
                  <div class="star-wrapper">
                      <v-star :size="24" :score="rating.score"></v-star>
                      <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                  </div>
                  <p class="text">{{rating.text}}</p>
                  <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                     <span class="icon-thumb_up"></span>
                     <span v-for="(item, index) in rating.recommend" :key="index" class="item">{{item}}</span>
                  </div>
                  <div class="time">
                    {{rating.rateTime | formatDate}}
                  </div>
               </div>
             </li>
           </ul>
       </div>  
     </div>                
  </div>
</template>

<script type="es6">
import star from '@/components/star/star'
import BScroll from 'better-scroll';
import split from '@/components/split/split'
import ratingselect from '@/components/ratingselect/ratingselect'
import {formatDate} from '@/common/js/date'
// import data from '../../../data.json';

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

const ERR_OK = 0;

export default {
  components: {
     'v-star': star,
     'v-split': split,
     'v-ratingselect': ratingselect
  },
  props: {
      seller: {
        type: Object
      }
  },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true
    }
  },
  created () {
    this.$http.get('/api/ratings')          
          .then((res) => { 
             res = res.body;
             if (res.errno === ERR_OK) {
                  this.ratings = res.data;
                  // console.log(this.ratings)
                  this.$nextTick(() => {
                     this.scroll = new BScroll(this.$refs.ratings, {
                         click: true
                     })
                  });
             }               
          }
    )
    //  this.ratings = data.ratings;
    //  this.$nextTick(() => {
    //     console.log(this.$el);
    //     this.scroll = new BScroll(this.$el, {click: true});
    //   });
  },
  filters: {
       formatDate(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        } 
  },
  methods: {
    needShow(type, text) {
        if(this.onlyContent && !text){
            return false
        }
        if(this.selectType === ALL){
            return true
        }else{
            return type === this.selectType;
        }    
    },
    incrementTotal(type, data) {
        this[type] = data;
        this.$nextTick(() => {
             this.scroll.refresh();
        });
     }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/mixin"

    .ratings
        position: absolute
        top: 174px
        bottom: 0
        left: 0
        width: 100%
        overflow: hidden
        .overview
              display: flex
              padding: 18px 0
              .overview-left
                  flex: 0 0 137px
                  width 137px // 防止出现兼容性问题
                  padding: 12px 0
                  border-right: 1px solid rgba(7, 17, 27, 0.1)
                  text-align: center
                  @media only screen and (max-width 320px)
                      flex: 0 0 110px
                      width: 110px
                  .score 
                      margin-bottom: 6px
                      line-height: 28px
                      font-size: 24px
                      color: rgb(255, 153, 0)
                  .title
                      margin-bottom: 8px
                      line-height: 12px
                      font-size: 12px
                      color: rgb(7, 17, 27)
                  .rank
                      line-height: 10px
                      font-size: 10px
                      color: rgb(147, 153, 159)
              .overview-right
                  flex: 1
                  padding:  6px 0 6px 24px
                  @media only screen and (max-width 320px)
                      padding-left: 6px
                  .score-wrapper
                      margin-top: 8px
                      line-height: 18px
                      font-size: 0
                      .title
                          display: inline-block
                          vertical-align: top
                          line-height: 18px
                          font-size: 12px
                          color: rgb(7, 17, 27)     
                      .star
                          display: inline-block
                          margin: 0 12px
                          vertical-align: top
                      .score
                          display: inline-block
                          vertical-align: top
                          line-height: 18px
                          font-size: 12px
                          color: rgb(255, 153, 0)
                  .delivery-wrapper 
                      line-height: 18px
                      margin-top: 8px           
                      font-size: 0
                      .title  //span文字和文字之间默认是垂直居中的，可以不用加display vertical-align 
                          line-height: 18px
                          font-size: 12px
                          color: rgb(7, 17, 27) 
                      .delivery  
                          display: inline-block
                          vertical-align: top
                          line-height: 18px
                          margin-left: 12px
                          font-size: 12px
                          color: rgb(147, 153, 159)          
        .rating-wrapper
              padding: 0 18px
              .rating-item
                  display: flex
                  padding: 18px 0
                  border-1px(rgba(7, 17, 27, 0.1)) 
                  .avatar
                      flex: 0 0 28px
                      width: 28px
                      margin-right: 12px
                      img  
                         border-radius: 50%
                  .content
                      position: relative
                      flex: 1
                      .name
                          margin-bottom: 4px
                          line-height: 12px
                          font-size: 10px
                          color: rgb(7, 17, 27)
                      .star-wrapper
                          margin-bottom: 6px
                          font-size: 0
                          .star 
                              display: inline-block
                              vertical-align: top
                              margin-right: 6px
                          .delivery
                              display: inline-block
                              vertical-align: top
                              line-height: 12px
                              font-size: 10px
                              color: rgb(147, 153, 159)
                      .text
                          margin-bottom: 8px
                          line-height: 18px
                          color: rgb(7, 17, 27)
                          font-size: 12px
                      .recommend
                          line-height: 16px
                          font-size: 0
                          .icon-thumb_up, .item 
                             display: inline-block
                             margin:0 8px 4px 0
                             font-size: 9px
                          .icon-thumb_up
                             color:rgb(0, 160, 220)
                          .item
                             padding: 0 6px
                             border: 1px solid rgba(7, 17, 27, 0.1)
                             border-radius: 1px
                             color: rgb(147, 153, 159)
                             background: #ffffff      
                     .time
                        position: absolute
                        top: 0
                        right: 0
                        line-height: 12px
                        font-size: 10px
                        color: rgb(147, 153, 159)

</style>  