<template>
    <div class="pendingReceive">
        <div class="list">
            <div class="order-wrapper" v-for="item in list">
                <p class="creat-time">下单时间：<span v-html="item.format_time">2017/05/05 18:30</span></p>
                <div class="order-content">
                    <div class="order-info" @click="goPage(item.id, item.pid)">
                        <mt-cell>
                            <img slot="icon" :src="item.pictures">
                            <span slot="title" class="text-content">
                                <p class="goods-name title" v-html="item.pname">PIAGET伯爵SUNNYSIDEOFLIEF高级珠宝腕表</p>
                                <p class="goods-classify">类型：<span v-html="item.order_type==1?'专场订单':'拍卖会订单'">0元起拍</span></p>
                            </span>
                            <p class="goods-price"><span v-html="'￥' + item.total_money">￥500000</span></p>
                            <span class="iconfont icon-jiantou"></span>
                        </mt-cell>
                    </div>
                    <div class="order-operation">
                        <div class="btn-group">
                            <mt-button type="default" size="small" @click="goRight(item.id)">维权</mt-button>
                            <mt-button type="default" size="small" @click="confirm(item.id)">确认收货</mt-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="noMore" v-if="list.length == 0">暂无数据 ...</div>
    </div>
</template>

<script>
    export default {
        name: 'pendingReceive',
        data () {
            return {
                list: [],
                getData: {
                    page: 1,
                    status: 1
                }
            }
        },
        mounted () {
            this.getlist();
        },
        methods: {
            getlist () {
                myFn.ajax('get', this.getData, apiAddress.center.order, (res) => {
                    this.list = res.data.data;
                })
            },
            confirm (id) {
                myFn.ajax('post', {order_id: id}, apiAddress.center.confirmReceipt, (res) => {
                    console.log('确认收货成功');
                    this.$router.push({name: 'received'})
                })
            },
            goRight (id) {
                this.$router.push({name: 'protectRights', params: {id: id}})
            },
            goPage (id, pid) {
                this.$router.push({name: 'orderDetails', params: {id: id, pid: pid}})
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .pendingReceive .mint-cell img {
        width: 95px;
        height: 95px;
        float: left;
    }
    .pendingReceive .mint-cell-title .text-content {
        display: block;
        padding-left: 110px;
        position: relative;
    }
    .pendingReceive .iconfont.link {
        position: absolute;
        font-size: 20px;
        color: #D5D5D5;
        top: 50%;
        right: 15px;
        margin-top: -10px;
    }
    .pendingReceive .mint-cell-title .text-content p {
        margin: 7px 0;
        font-size: 14px;
    }
    .pendingReceive .mint-cell:first-child .mint-cell-wrapper {
        padding: 15px;
    }
    .pendingReceive .mint-cell-title .text-content p.goods-name {
        margin-top: 0px;
        font-size: 16px;
        color: #0f1014;
        line-height: 1.2;
    }
    .pendingReceive .mint-cell-title .text-content p.goods-classify {
        font-size: 13px;
        color: #a3a8b8;
    }
    .pendingReceive p.goods-price {
        font-size: 20px;
        color: #bb9f56;
        margin-top: 10px;
        position: absolute;
        left: 125px;
        bottom: 22px;
    }
    .pendingReceive .mint-cell:last-child {
        background-size: 95% 1px;
    }
    .pendingReceive .mint-button {
        font-size: 14px;
        margin-left: 15px;
        padding: 0 13px;
    }
    .pendingReceive .mint-button:first-child {
        margin-left: 0;
    }
</style>
<style scoped>
    .noMore {
        position: absolute;
        top: 150px;
        left: 50%;
        margin-left: -39px;
        color: #999;
        font-size: 14px;
        letter-spacing: 1px;
    }
    .pendingReceive {
        background: none;
    }
    .list {
        margin-top: -1px;
    }
    .order-wrapper {
        background: #fff;
        margin-bottom: 7px;
    }
    .creat-time {
        font-size: 14px;
        color: #a3a8b8;
        padding: 15px 0 7px;
        padding-left: 10px;
    }
    .order-operation {
        text-align: right;
        padding: 10px 10px;
        font-size: 0;
    }
    .order-operation > div {
        width: 50%;
        display: inline-block;
        font-size: 14px;
        vertical-align: middle;
    }
    .order-operation > div p {
        text-align: left;
        margin-bottom: 0;
        color: #a3a8b8;
    }
    .order-operation p {
        margin-bottom: 10px;
    }
    .order-operation .btn-group button:first-child {
        background: #fff;
        color: #bb9f56;
        box-shadow: 0 0 1px #bb9f56;
    }
    .order-operation .btn-group button:last-child {
        background: #1B1A1D;
        color: #fff;
    }
    .title {
        /* height: 40px; */
        font-size: 15px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
    }
</style>
