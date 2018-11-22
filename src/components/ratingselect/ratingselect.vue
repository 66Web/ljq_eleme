<template>
  <div class="ratingselect">
        <div class="rating-type" border-1px>
            <span class="block positive" @click.stop.prevent="select(2,$event)" :class="{'active':sType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span> </span>
            <span class="block positive" @click.stop.prevent="select(0,$event)" :class="{'active':sType === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span class="block negative" @click.stop.prevent="select(1,$event)" :class="{'active':sType === 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div @click.stop.prevent="toggleContent($event)"  class="switch" :class="{'on':oContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
  </div>
</template>


<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
    props: {
        ratings:{
            type: Array,
            default() {
                return []
            }
        },
        selectType:{
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default() {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        }
    },
    data() {
        return {
            sType : this.selectType,
            oContent : this.onlyContent
        }
    },
    computed: {
        positives() {
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE;
            })
        },
        negatives() {
            return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE;
            })
        }
    },
    methods: {
        select(type, event) {
            if(!event._constructed) {
                return;
            }
            this.sType = type;
            //console.log('ratingselect.vue ' + type);
            this.$emit('increment', 'selectType', this.sType); // 子组件通过 $emit触发父组件的方法 increment   还可以传参
        },
        toggleContent(event) {
            if(!event._constructed) {
                return;
            }
            this.oContent = !this.oContent;
            //console.log('ratingselect.vue ' + this.oContent);
            this.$emit('increment', 'onlyContent', this.oContent);
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/mixin"

    .ratingselect
        .rating-type
             padding: 18px 0
             margin: 0 18px
             border-1px(rgba(7, 17, 27, 0.1))
             font-size: 0
             .block
                 display: inline-block
                 padding: 8px 12px
                 margin-right: 8px
                 line-height: 16px
                 border-radius: 2px
                 font-size: 12px
                 color: rgb(77, 85, 93)
                 &.active
                   color: #ffffff 
                 .count
                   margin-left: 2px       
                   font-size: 8px
                 &.positive
                   background: rgba(0, 160, 220, 0.2)
                   &.active
                     background: rgb(0, 160, 220)
                 &.negative
                   background: rgba(77, 85, 93, 0.2)
                   &.active
                     background: rgb(77, 85, 93)
        .switch
            padding: 12px 18px
            line-height: 24px
            border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            color: rgb(147, 153, 159)
            &.on
               .icon-check_circle
                   color: #00c850   
            .icon-check_circle
               display: inline-block
               vertical-align: top
               margin-right: 4px
               font-size: 24px
            .text
               font-size: 12px
                  
                      
</style> 


