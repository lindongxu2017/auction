<template>
    <div class="pendingPay" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <div class="list">
            <div class="order-wrapper" v-for="(item,index) in list">
                <p class="creat-time">下单时间：<span v-html="item.format_time">2017/05/05 18:30</span></p>
                <div class="order-content">
                    <div class="order-info" @click="goPage(item.id, item.pid)">
                        <mt-cell>
                            <img slot="icon" :src="item.image">
                            <span slot="title" class="text-content">
                                <p class="goods-name title" v-html="item.pname"></p>
                                <p class="goods-classify">类型：<span v-html="item.order_type==1?'专场订单':'拍卖会订单'">0元起拍</span></p>
                            </span>
                            <span class="iconfont icon-jiantou link"></span>
                            <p class="goods-price"><span v-html="'￥' + item.total_money">￥500000</span></p>
                        </mt-cell>
                    </div>
                    <div class="order-operation">
                        <div class="btn-group">
                            <!-- <mt-button type="default" size="small">取消</mt-button> -->
                            <mt-button type="default" size="small" @click="goPay(item.id, item.pay_id)">付款</mt-button>
                        </div>
                        <div>
                            <p>请<span class="losetime">{{init[index].losetime | getDate}}</span>之前完成支付。</p>
                            <p>剩余时间：<span>{{item.losetime}}</span></p>
                            <p v-if="item.pay_type == 4" style="margin-top:10px;">*您已进行线下汇款，请等待官方审核！</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="noMore" v-if="list.length == 0">暂无数据 ...</div>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'pendingPay',
        data () {
            return {
                list: [],
                getData: {
                    page: 0,
                    status: 0
                },
                init: [],
                addressID: '',
                loading: false,
                total: 1
            }
        },
        mounted () {
            setInterval(() => {
                this.getMinus()
            }, 1000)
            this.isDefaultAddress();
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
                            localStorage.orderlist = JSON.stringify(this.list);
                            this.init = JSON.parse(localStorage.orderlist);
                        }
                    })
                }, 500)
            },
            isDefaultAddress () {
                myFn.ajax('get', {}, apiAddress.center.isDefaultAddress, (res) => {
                    this.addressID = res.data.id;
                })
            },
            goPay (id, payid, type) {
                this.isDefaultAddress();
                if (parseInt(type) === 4) {
                    MessageBox('提示', '您已进行线下汇款，请勿重复付款，如有疑问请联系客服！')
                    return false;
                };
                if (!this.addressID) {
                    // MessageBox('提示', '您还没有默认地址，请前往个人中心填写收货地址！')
                    MessageBox.confirm('您还没有默认地址，请前往个人中心填写收货地址！').then(action => {
                        this.$router.push({name: 'address'})
                    });
                    return false;
                };
                /* var parameter = JSON.stringify({
                    id: id,
                    pay_id: payid,
                    adr: this.addressID
                }) */
                // this.$router.push({name: 'pay', params: {parameter: parameter}})
                location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/pay/' + id + '/' + payid;
                // wx.miniProgram.navigateTo({url: '/pages/pay/pay?parameter=' + parameter});
            },
            goPage (id, pid) {
                this.$router.push({name: 'orderDetails', params: {id: id, pid: pid}})
            },
            getMinus () {
                if (this.list) {
                    var nowTime = Math.round(new Date().getTime() / 1000);
                    for (var i = 0; i < this.list.length; i++) {
                        var value = this.init[i].losetime;
                        this.list[i].losetime = myFn.arrive_timer_format(value - nowTime)
                    };
                }
            }
        },
        filters: {
            getDate: function (value) {
                var unixTimestamp = new Date(value * 1000);
                var date = unixTimestamp.toLocaleString()
                return date;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .pendingPay .mint-cell img {
        width: 95px;
        height: 95px;
        float: left;
    }
    .pendingPay .mint-cell-title .text-content {
        display: block;
        padding-left: 110px;
        position: relative;
    }
    .pendingPay .iconfont.link {
        position: absolute;
        font-size: 20px;
        color: #D5D5D5;
        top: 50%;
        right: 15px;
        margin-top: -10px;
    }
    .pendingPay .mint-cell-title .text-content p {
        margin: 7px 0;
        font-size: 14px;
    }
    .pendingPay .mint-cell:first-child .mint-cell-wrapper {
        padding: 15px;
    }
    .pendingPay .mint-cell-title .text-content p.goods-name {
        margin-top: 0px;
        font-size: 16px;
        color: #0f1014;
        line-height: 1.2;
    }
    .pendingPay .mint-cell-title .text-content p.goods-classify {
        font-size: 13px;
        color: #a3a8b8;
    }
    .pendingPay p.goods-price {
        font-size: 20px;
        color: #bb9f56;
        margin-top: 10px;
        position: absolute;
        left: 125px;
        bottom: 22px;
    }
    .pendingPay .mint-cell:last-child {
        background-size: 95% 1px;
    }
    .pendingPay .mint-button {
        font-size: 14px;
        margin-left: 15px;
        padding: 0 15px;
    }
    .pendingPay .mint-button:first-child {
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
    .pendingPay {
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
        padding: 15px 10px;
        font-size: 14px;
    }
    .order-operation .losetime {}
    .order-operation > div:first-child {
        float: right;
        display: inline-block;
    }
    .order-operation > div:last-child {
        padding-right: 80px;
    }
    .order-operation > div p {
        text-align: left;
        margin-bottom: 0;
        font-size: 13px;
        color: #a3a8b8;
        color: red;
    }
    .order-operation p {
        margin-bottom: 10px;
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
