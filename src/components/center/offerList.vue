<template>
    <div class="offerList">
        <div class="offer-log">
            <div v-for="(item,index) in offer_list" :class="offer_list.length == index + 1 ?'border-none':''">
                <img :src="item.headimgurl">
                <span v-html="'￥' + item.bided"></span>
                <div>
                    <p v-html="item.nickname" style="min-height: 21px;">托尔斯泰</p>
                    <p>2017-02-05 12:00:00</p>
                </div>
            </div>
        </div>
        <!-- <div class="button-group" v-if="type == 1">
            <mt-button class="remind" @click="set_remind(1)">提醒(提前30分)</mt-button>
            <mt-button class="remind" @click="set_remind(0)">关闭提醒</mt-button>
            <mt-button type="danger" class="offer" @click="offer" 
            v-html="datainfo.self_raise_info.money?'出价' + datainfo.self_raise_info.money:'出价'"></mt-button>
        </div>
        <offer :popup="ispopup" :currentMoney="datainfo.nowprice" :limit="datainfo.stepsize" :shopId="id" @input="close_popup"></offer> -->
    </div>
</template>
<script>
    export default {
        name: 'offerList',
        data () {
            return {
                id: '',
                offer_list: []
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            this.getOfferLog();
        },
        methods: {
            getOfferLog () {
                myFn.ajax('get', {pid: this.id}, apiAddress.center.offerLog, (res) => {
                    this.offer_list = res.data.data
                })
            }
        }
    }
</script>
<style scoped>
    .offerList {
        background: #f2f2f2;
    }
    .offer-log {
        padding: 0 10px;
        background: #fff;
        margin-bottom: 10px;
    }
    .offer-log > div {
        padding: 10px;
        border-bottom: 1px solid #d4d4d4;
    }
    .offer-log > div.border-none {
        border-bottom: 0;
    }
    .offer-log > div img {
        float: left;
        width: 55px;
        border-radius: 50%;
    }
    .offer-log > div span {
        float: right;
        margin-top: 15px;
        color: #bb9f56;
    }
    .offer-log > div div {
        padding-top: 5px;
        padding-bottom: 10px;
        padding-left: 70px;
    }
    .offer-log > p {
        text-align: center;
        padding: 10px 0 13px;
        color: #989aa3;
    }
    .offer-log > div div p:first-child {
        color: #4D4E53;
    }
    .offer-log > div div p:last-child {
        font-size: 12px;
        margin-top: 3px;
        color: #989aa3;
    }
</style>