<template>
  <div id="app">
      <v-header :seller="seller"></v-header>
      <div class="tab border-1px">
          <div class="tab-item">
            <router-link :to="{ path: '/goods' }">商品</router-link>
          </div>
          <div class="tab-item">
            <router-link :to="{ path: '/ratings' }">评论</router-link>
          </div>
          <div class="tab-item">
            <router-link :to="{ path: '/seller' }">商家</router-link>
          </div>
      </div>
      <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import header from './components/header/header.vue'
import {urlParse} from './common/js/util.js'

const ERR_OK = 0;

export default {
  components: {
     'v-header': header
   },
   data() {
     return {
       seller:{
         id: (() => {
           let queryParam = urlParse();
          //  console.log(queryParam)
           return queryParam.id;
         })()
       }
     }
   },
   created: function() {
      this.$http.get('/api/seller?id=' + this.seller.id)          
          .then((res) => { 
             res = res.body;
             if (res.errno === ERR_OK) {
                  this.seller = res.data;
                  // console.log(this.seller)
                  this.seller = Object.assign({}, this.seller, res.data);//扩展对象 添加其它属性--id
             }               
          }, (err) => { 

          })
   }
}
</script>

<style scoped lang="stylus">
  @import"./common/stylus/mixin.styl";
  
  .tab
     display: flex
     width: 100%
     height: 40px
     line-height: 40px
     border-1px(rgba(7, 17, 27, 0.1))
     .tab-item
        flex:1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
        & > a.router-link-active
            color: rgb(240, 20, 20)
</style>
