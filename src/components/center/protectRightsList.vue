<template>
    <div class="protectRights" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <div class="list">
            <div class="order-wrapper" v-for="(item,index) in list">
                <p class="creat-time">下单时间：<span v-html="item.format_time">2017/05/05 18:30</span></p>
                <div class="order-content">
                    <div class="order-info" @click="goPage(item.id, item.pid)">
                        <mt-cell>
                            <img slot="icon" :src="item.pictures">
                            <span slot="title" class="text-content">
                                <p class="goods-name title" v-html="item.pname ">PIAGET伯爵SUNNYSIDEOFLIEF高级珠宝腕表</p>
                                <p class="goods-classify">类型：<span v-html="item.order_type==1?'专场订单':'拍卖会订单'">0元起拍</span></p>
                            </span>
                            <span class="iconfont icon-jiantou link"></span>
                            <p class="goods-price"><span v-html="'￥' + item.total_money">￥500000</span></p>
                        </mt-cell>
                    </div>
                    <div class="order-operation">
                        <mt-button v-if="item.appeal_status == 1" type="default" size="small" @click="cancel(item.id, index)">取消</mt-button>
                        <div class="reason">
                            <!-- <p>维权原因：<span v-html="item.appeal_type_msg">退货</span></p> -->
                            <p class="marsk"><span>维权状态：</span><span v-html="item.appeal_status_msg">拍错了退货</span></p>
                            <p class="marsk"><span>维权备注：</span><span v-html="item.content">拍错了退货</span></p>
                            <img v-for="obj in item.appeal_image" :src="obj">
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
        name: 'protectRights',
        data () {
            return {
                list: [],
                getData: {
                    page: 0,
                    status: 5
                },
                loading: false,
                total: 1
            }
        },
        mounted () {
            // this.getlist();
        },
        methods: {
            loadMore () {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    if (this.list.length >= this.total) return false;
                    this.getData.page ++;
                    myFn.ajax('get', this.getData, apiAddress.center.order, (res) => {
                        if (res.data.data) {
                            this.list = this.list.concat(res.data.data);
                        }
                    })
                }, 500)
            },
            cancel (id, index) {
                myFn.ajax('post', {order_id: id}, apiAddress.center.appealCancel, (res) => {
                    alert('取消成功!');
                    this.list.splice(index, 1);
                    // this.$router.push({name: ''})
                })
            },
            goPage (id, pid) {
                this.$router.push({name: 'orderDetails', params: {id: id, pid: pid}})
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .protectRights .mint-cell img {
        width: 95px;
        height: 95px;
        float: left;
    }
    .protectRights .mint-cell-title .text-content {
        display: block;
        padding-left: 110px;
        position: relative;
    }
    .protectRights .iconfont.link {
        position: absolute;
        font-size: 20px;
        color: #D5D5D5;
        top: 50%;
        right: 15px;
        margin-top: -10px;
    }
    .protectRights .mint-cell-title .text-content p {
        margin: 7px 0;
        font-size: 14px;
    }
    .protectRights .mint-cell:first-child .mint-cell-wrapper {
        padding: 15px;
        position: relative;
    }
    .protectRights .mint-cell-title .text-content p.goods-name {
        margin-top: 0px;
        font-size: 16px;
        color: #0f1014;
        line-height: 1.2;
    }
    .protectRights .mint-cell-title .text-content p.goods-classify {
        font-size: 13px;
        color: #a3a8b8;
    }
    .protectRights p.goods-price {
        font-size: 20px;
        color: #bb9f56;
        margin-top: 10px;
        position: absolute;
        left: 125px;
        bottom: 22px;
    }
    .protectRights .mint-cell:last-child {
        background-size: 95% 1px;
    }
    .protectRights .mint-button {
        font-size: 14px;
        padding: 0 13px;
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
    .protectRights {
        background: none;
    }
    .list {
        margin-top: -1px;
    }
    .order-wrapper {
        background: #fff;
        margin-bottom: 7px;
        border-top: 1px solid #d4d4d4;
    }
    .creat-time {
        font-size: 14px;
        color: #a3a8b8;
        padding: 15px 0 7px;
        padding-left: 10px;
    }
    .order-operation {
        /* text-align: right; */
        padding: 10px;
        font-size: 12px;
        color: #585b67;
    }
    .reason img {
         width:60px;
         height: 60px;
         margin-right:10px;
         margin-bottom: 10px;
         vertical-align: top;
    }
    .order-operation button {
        background: #BF3D3D;
        color: #fff;
        float: right;
        /* margin-top: 20px; */
    }
    .order-operation .reason {
        padding-right: 80px;
    }
    .marsk span {
        vertical-align: top;
    }
    .marsk span:last-child {
        display: inline-block;
        max-width: calc(100% - 70px);
    }
    .order-operation p {
        margin-bottom: 10px;
        font-size: 14px;
        text-align: left;
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
