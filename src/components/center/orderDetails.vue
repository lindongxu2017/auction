<template>
    <div class="orderDetails">
        <div class="user-info">
            <p v-html="orderData.receiver_name">杰克斯派洛</p>
            <p v-html="orderData.mobile">18088888888</p>
            <p v-html="orderData.receiver_addr">深圳市福田区上沙6坊深圳市福田区上沙6坊深圳市福田区上沙6坊深圳市福田区上沙6坊</p>
        </div>
        <div class="order-content">
            <div class="order-info" @click="goPage">
                <mt-cell>
                    <img slot="icon" :src="orderData.pictures">
                    <span slot="title" class="text-content">
                        <p class="goods-name title" v-html="orderData.pname">PIAGET伯爵SUNNYSIDEOFLIEF高级珠宝腕表</p>
                        <p class="goods-classify">类型：<span v-html="orderData.order_type==1?'专场订单':'拍卖会订单'">0元起拍</span></p>
                    </span>
                    <span class="iconfont icon-jiantou link"></span>
                    <p class="goods-price"><span v-html="orderData.total_money">￥500000</span></p>
                </mt-cell>
            </div>
        </div>
        <div class="send-time">
            <p>订单编号：<span v-html="orderData.order_no">EQ78454854854545874</span></p>
            <p>创建时间：<span v-html="orderData.time">2017/11/11 15:22:30</span></p>
            <p>付款时间：<span v-html="orderData.pay_time">2017/11/11 15:22:30</span></p>
            <p>发货时间：<span v-html="orderData.send_time">2017/11/11 15:22:30</span></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'orderDetails',
        data () {
            return {
                id: '',
                gid: '',
                orderData: {},
                goodsData: {},
                type: ''
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            this.pid = this.$route.params.pid;
            this.getOrderDetail();
        },
        methods: {
            getOrderDetail () {
                myFn.ajax('get', {order_id: this.id}, apiAddress.center.orderDetails, (res) => {
                    this.orderData = res.data;
                    this.type = res.data.order_type;
                })
            },
            getGoodsDetail () {
                myFn.ajax('get', {order_id: this.gid}, apiAddress.specialAuction.roomShopDetails, (res) => {
                    this.goodsData = res.data;
                })
            },
            goPage () {
                this.$router.push({name: 'goodsDetails', params: {id: this.pid, type: this.type}})
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .orderDetails .mint-cell img {
        width: 95px;
        height: 95px;
        float: left;
    }
    .orderDetails .mint-cell-title .text-content {
        display: block;
        padding-left: 110px;
        position: relative;
    }
    .orderDetails .iconfont.link {
        position: absolute;
        font-size: 20px;
        color: #D5D5D5;
        top: 50%;
        right: 15px;
        margin-top: -10px;
    }
    .orderDetails .mint-cell-title .text-content p {
        margin: 7px 0;
        font-size: 14px;
    }
    .orderDetails .mint-cell:first-child .mint-cell-wrapper {
        padding: 20px 15px;
    }
    .orderDetails .mint-cell-title .text-content p.goods-name {
        margin-top: 0px;
        font-size: 16px;
        color: #0f1014;
        line-height: 1.2;
    }
    .orderDetails .mint-cell-title .text-content p.goods-classify {
        font-size: 13px;
        color: #a3a8b8;
    }
    .orderDetails p.goods-price {
        font-size: 20px;
        color: #bb9f56;
        margin-top: 10px;
        position: absolute;
        left: 125px;
        bottom: 22px;
    }
</style>
<style scoped>
    .orderDetails {
        color: #393939;
    }
    .user-info {
        padding: 10px 15px;
        font-size: 15px;
        background: #fff;
    }
    .user-info p {
        margin: 7px 0;
    }
    .user-info p:last-child {
        color: #858585;
        padding-right: 30px;
        line-height: 1.5;
    }
    .send-time {
        padding: 10px 15px 0;
        font-size: 16px;
        background: #fff;
        border-bottom: 1px solid #d4d4d4;
    }
    .send-time p {
        margin: 10px 0;
    }
    .send-time p:first-child {
        padding-bottom: 10px;
        border-bottom: 1px solid #d4d4d4;
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
