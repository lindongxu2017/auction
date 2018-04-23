<template>
    <div class="specialAuctionDetails" :class="[roomType==1 || roomType==3?'margin-b-40':'']">
        <mt-swipe :auto="4000" class="swipe">
            <mt-swipe-item v-for="(item,key) in datainfo.pictures" :key="item.id">
                <img class="shopBanner" :src="item" />
            </mt-swipe-item>
        </mt-swipe>
        <div class="attribute">
            <div class="attribute_title">
                <p style="font-size:16px;" v-html="datainfo.pname">翡翠</p>
                <span class="marketValue">市场价 ￥{{datainfo.price}}</span>
                <span class="startingPrice">起拍价：￥{{datainfo.onset}}</span>
            </div>
            <div class="attribute_price">
                <p><span>{{datainfo.nowprice}}</span><br>当前价(￥)</p>
                <i></i>
                <p><span>{{datainfo.stepsize}}</span><br>加价幅度(￥)</p>
            </div>
            <div class="attribute_details">
                <div>
                    <span>开拍时间</span>
                    <span v-html="datainfo.starttime?datainfo.starttime.split(' ')[1]:''">{{}}</span>
                    <span v-html="datainfo.starttime?datainfo.starttime.split(' ')[0]:''">{{}}</span>
                </div>
                <div class="middle-line"></div>
                <div>
                    <span>结束时间</span>
                    <span v-html="datainfo.endtime?datainfo.endtime.split(' ')[1]:''"></span>
                    <span v-html="datainfo.endtime?datainfo.endtime.split(' ')[0]:''"></span>
                </div>
            </div>
        </div>
        <div v-if="offer_list.length > 0" class="box offer-log">
            <p class="title" style="text-align:left;color:#4D4E53;">拍品记录</p>
            <div v-for="(item,index) in offer_list" v-if="index < 3" :class="offer_list.length == index + 1 ?'border-none':''">
                <img :src="item.headimgurl">
                <span v-html="'￥' + item.bided"></span>
                <div>
                    <p style="min-height:21px;" v-html="item.nickname">托尔斯泰</p>
                    <p v-html="item.time">2017-02-05 12:00:00</p>
                </div>
            </div>
            <p v-if="offer_list.length > 2" @click="checkMore">查看更多出价人 ></p>
        </div>
        <div class="box">
            <p class="title">拍品参数</p>
            <div class="parameter_details">
                <span v-for="item in datainfo.goodsattr">{{item.attr_name}}：{{item.attr_value}}</span>
            </div>
        </div>
        <div class="box">
            <p class="title">拍品展示</p>
            <div class="lot" v-html="datainfo.content"></div>
        </div>
        <div class="box" v-if="datainfo.cert_img.length">
            <p class="title">证书展示</p>
            <div class="certificate">
                <img class="shopBanner" v-for="item in datainfo.cert_img" :src="item" />
            </div>
        </div>
        <div class="button-group" v-if="roomType == 1 && personID != 0">
            <mt-button type="danger" class="offer" :class="[datainfo.self_raise_info.money != 0 ? 'remind' : '']" @click="offer">出价<span v-if="datainfo.self_raise_info.money != 0"
             v-html="'(' + parseInt(datainfo.self_raise_info.bided) + ')'"></span></mt-button>
            <!-- <div class="remind-wrapper" v-if="parseInt(datainfo.self_raise_info.money) && isShow">
                <ul>
                    <li @click="remindType(2)" :class="is_set == 1">有人出价时提醒</li>
                    <li @click="remindType(1)" :class="is_set == 2">1小时提醒一次</li>
                    <li @click="remindType(3)" :class="is_set == 3">结束前半小时</li>
                </ul>
            </div> -->
            <div class="remind-btn" v-if="datainfo.self_raise_info.money != 0" @click="remindType">设置提醒</div>
        </div>
        <div class="button-group" v-if="roomType == 3 && personID != 0">
            <mt-button class="remind" v-if="is_warm == 1" @click="set_remind(1)">提醒(提前30分)</mt-button>
            <mt-button class="remind" v-if="is_warm == 0" @click="set_remind(0)">关闭提醒</mt-button>
        </div>
        <div class="button-group" v-if="personID == 0">
            <mt-button class="remind" @click="goCenter">认证用户</mt-button>
        </div>
        <offer :popup="ispopup" :currentMoney="datainfo.nowprice" :limit="datainfo.stepsize" :shopId="id" @input="close_popup" @specialAuction="specialAuction"></offer>
    </div>
</template>
<script>
    // import wx from 'weixin-js-sdk'
    import offer from '../tools/offer.vue'
    export default {
        name: 'specialAuctionDetails',
        data () {
            return {
                // 拍品ID
                id: '',
                // is_warm: 1：未提醒, is_warm: 0：已提醒
                is_warm: '',
                // 拍品类型 roomType 1：正在拍, roomType 2：已经结束 , roomType 3：未开拍
                roomType: '',
                personID: '',
                datainfo: {
                    nowprice: 0,
                    self_raise_info: {
                        money: 0
                    },
                    cert_img: []
                },
                ispopup: false,
                offer_list: [],
                isShow: false,
                is_set: 0,
                setID: ''
            }
        },
        /* beforeRouteEnter (to, from, next) {
            // 微信分享
            var url = location.href.split('#')[0];
            myFn.ajax('post', {url: url}, apiAddress.wx.jssdk, (res) => {
                res.data.debug = false;
                res.data.jsApiList = [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ]
                wx.config(res.data);
            })
            next();
        }, */
        mounted () {
            this.id = this.$route.params.id;
            if ((this.$route.params.roomType + '').indexOf('*') === -1) {
                // this.setID = this.$route.params.roomType
                this.roomType = this.$route.params.roomType
            } else {
                this.roomType = (this.$route.params.roomType + '').split('*')[0];
                this.setID = (this.$route.params.roomType + '').split('*')[1];
            }
            if (localStorage.userInfo) {
                this.personID = JSON.parse(localStorage.userInfo).uid;
            } else {
                this.personID = 0;
            }
            if (parseInt(this.setID)) {
                myFn.ajax('post', {uid: this.setID}, apiAddress.admin.setUserDown, (res) => {
                    // alert(JSON.stringify(res))
                })
            };
            this.getdetails();
            var path = this.$route.fullPath;
            var time = setInterval(() => {
                if (this.$route.fullPath !== path) {
                    clearInterval(time);
                    return;
                };
                this.getdetails();
                this.getOfferLog();
            }, 1000)
        },
        methods: {
            getdetails () {
                // var self = this;
                myFn.ajax('get', {pid: this.id, type: 1}, apiAddress.specialAuction.roomShopDetails, (res) => {
                    this.datainfo = res.data;
                    /* var shareImg = location.protocol + '//' + location.hostname + location.port + res.data.pictures[0];
                    if (parseInt(res.data.is_remind) === 0) {
                        this.is_warm = 1;
                    } else {
                        this.is_warm = 0;
                    }
                    // this.is_warm = 0;
                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: '臻宝拍卖',
                        link: location.protocol + '//' + location.hostname + '/mobile/#/index/special/auction/details/' + self.id + '/' + self.roomType + '*' + JSON.parse(localStorage.userInfo).uid,
                        imgUrl: shareImg,
                        // 用户确认分享后执行的回调函数
                        success: function () {
                            // todo
                        },
                        // 用户取消分享后执行的回调函数
                        cancel: function () {
                            // todo
                        }
                    });
                    // 分享给好友
                    wx.onMenuShareAppMessage({
                        title: '臻宝拍卖',
                        link: location.protocol + '//' + location.hostname + '/mobile/#/index/special/auction/details/' + self.id + '/' + self.roomType + '*' + JSON.parse(localStorage.userInfo).uid,
                        imgUrl: shareImg,
                        desc: '珠宝拍卖火热进行中',
                        type: 'link',
                        dataUrl: '',
                        success: function () {
                            // todo
                        },
                        cancel: function () {
                            // todo
                        }
                    }); */
                })
            },
            goCenter () {
                this.$router.push({name: 'center'})
            },
            offer () {
                this.ispopup = true;
            },
            getOfferLog () {
                myFn.ajax('get', {pid: this.id}, apiAddress.center.offerLog, (res) => {
                    this.offer_list = res.data.data || [];
                })
            },
            close_popup (boolean, type, value) {
                if (parseInt(type) === 1) {
                    this.ispopup = boolean;
                } else {
                    var data = {
                        pid: this.id,
                        money: value
                    }
                    myFn.ajax('post', data, apiAddress.specialAuction.setPrice, (res) => {
                        this.ispopup = boolean;
                    });
                }
                console.log(boolean);
            },
            specialAuction (value) {
                var data = {
                    pid: this.id,
                    money: value
                }
                myFn.ajax('post', data, apiAddress.specialAuction.setPrice, (res) => {});
            },
            checkMore () {
                this.$router.push({name: 'offerList', params: {id: this.id}})
            },
            set_remind (type) {
                // type == 0 关闭提醒
                // type == 1 开启提醒
                var api = '';
                if (parseInt(type) === 1) {
                    api = apiAddress.specialAuction.open_remind;
                } else {
                    api = apiAddress.specialAuction.close_remind;
                }
                myFn.ajax('post', {pid: this.id}, api, (res) => {
                    if (parseInt(type) === 1) {
                        this.is_warm = 0;
                    } else {
                        this.is_warm = 1;
                    }
                });
            },
            remindType () {
                this.$router.push({name: 'setRemind', params: {id: this.id}})
            }
        },
        components: {
            offer
        }
    }
</script>
<style>
    .specialAuctionDetails .mint-popup {
        width: 85%;
        height: 250px;
        border-radius: 10px;
        text-align: center;
        margin-right: 7.5%;
    }

    .specialAuctionDetails .lot img {
        max-width: 100%;
    }
    .specialAuctionDetails .mint-swipe {
        height: auto;
        padding-bottom: 100%;
    }
    .specialAuctionDetails .mint-swipe-items-wrap {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
<style scoped>
    .is_set {
        color: red;
    }
    .remind-btn {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background: #BB9F56;
        font-size: 14px;
        line-height: 40px;
        padding: 0 30px;
        color: #fff;
        letter-spacing: 0.5px;
    }
    .offer.remind {
        width: calc(100% - 116px)
    }
    .margin-b-40 {
        padding-bottom: 40px;
    }
    .shopBanner {
        width: 100%;
        /*max-height: 180px;*/
        display: block;
    }
    .attribute {
        background: #fff;
        padding: 10px 10px;
        line-height: 30px;
        position: relative;
    }
    .attribute_title {
        padding: 0px 7px;
        /* height: 55px; */
        height: auto;
        font-size: 0;
    }
    .attribute_title .marketValue {
        color: #B4AF92;
    }
    .attribute_title .startingPrice {
        color: #A27070;
    }
    .attribute_title p {
        margin-bottom: 3px;
    }
    .attribute_title span {
        display: inline-block;
        min-width: 50%;
        /* margin-right: 20px; */
        font-size: 15px;
        /* float: left; */
    }
    .attribute_price {
        margin: 10px 0 20px;
        padding-top: 20px;
        text-align: center;
        position: relative;
        border-top: 1px #d4d4d4 solid;
    }
    .attribute_price i {
        width: 1px;
        display: inline-block;
        border-right: 1px #d4d4d4 solid;
        position: absolute;
        right: 50%;
        height: 40px;
        top: 30px;
    }
    .attribute_price p {
        width: 48%;
        display: inline-block;
        color: #A29D83;
    }
    .attribute_price p:first-child {
        color: #BB9F56;
    }
    .attribute_price p span {
        font-size: 25px;
    }
    .parameter_details {
        padding: 10px 17px;
        padding-top: 0px;
        font-size: 0px;
        line-height: 30px;
    }
    .parameter_details span {
        min-width: 50%;
        display: inline-block;
        font-size: 16px;
        color: #BB9F56;
    }
    .parameter_details span:nth-child(even) {
        text-align: right;
    }
    .box {
        background: #fff;
        margin-top: 7px;
    }
    .title {
        color: #4D4E53;
        font-size: 21px;
        padding: 10px 15px;
    }
    .certificate, .lot{
        padding: 0px 17px;
        padding-bottom: 20px;
    }
    .certificate img {
        margin-bottom: 10px;
    }
    .button-group {
        position: fixed;
        bottom: 0;
        width: 100%;
        word-spacing: -5px;
    }
    .button-group .remind-wrapper {
        position: absolute;
        right: 5px;
        top: -80px;
        padding: 5px 10px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 0 5px #aaa;
        font-size: 14px;
        color: #666;
    }
    .button-group .remind-wrapper:before {
        content: '';
        position: absolute;
        width: 0;
        border-left: 7px solid transparent;  
        border-right: 7px solid transparent;  
        border-top: 7px solid rgba(0,0,0,0.1);
        bottom: -7px;
        margin-left: -3px;
        left: 50%;
    }
    .button-group .remind-wrapper:after {
        content: '';
        position: absolute;
        width: 0;
        border-left: 7px solid transparent;  
        border-right: 7px solid transparent;  
        border-top: 7px solid #fff;
        bottom: -5px;
        margin-left: -3px;
        left: 50%;
    }
    .button-group button {
        width: 100%;
        font-size: 16px;
        background: #ef4f4f;
        color: #fff;
    }
    .offer, .remind {
        border-radius: 0;
    }
    .offer {
        width: 100%;
    }
    /*.remind {
        width: 45%;
        font-size: 12px;
        vertical-align: bottom;
    }*/
    .attribute_details {
        position: relative;
        font-size: 0;
    }
    .attribute_details .middle-line {
        position: absolute;
        width: 14%;
        height: 1px;
        background: #d4d4d4;
        padding: 0;
        top: 50%;
        left: 43%;
    }
    .attribute_details > div {
        width: 50%;
        display: inline-block;
        text-align: center;
        font-size: 16px;
        border-top: 1px solid #d4d4d4;
        padding-top: 10px;
        color: #9b9da3;
        box-sizing: border-box;
    }
    .attribute_details > div:first-child {
        padding-right: 20px;
    }
    .attribute_details > div:last-child {
        padding-left: 20px;
    }
    .attribute_details > div span {
        display: block;
    }
    .attribute_details > div span:nth-child(2) {
        display: inline-block;
        padding: 10px 25px;
        background: #ededed;
        border-radius: 30px;
        margin: 7px 0;
        color: #585b67;
        font-size: 20px;
    }
    .attribute_details > div:last-child span:nth-child(2) {
        color: #cd2020;
    }
    .box.offer-log {
        padding: 0 10px;
    }
    .box.offer-log > div {
        padding: 10px;
        border-bottom: 1px solid #d4d4d4;
    }
    .box.offer-log > div.border-none {
        border-bottom: 0;
    }
    .box.offer-log > div img {
        float: left;
        width: 55px;
        border-radius: 50%;
    }
    .box.offer-log > div span {
        float: right;
        margin-top: 15px;
        color: #bb9f56;
    }
    .box.offer-log > div div {
        padding-top: 5px;
        padding-bottom: 10px;
        padding-left: 70px;
    }
    .box.offer-log > p {
        text-align: center;
        padding: 10px 0 13px;
        color: #989aa3;
    }
    .box.offer-log > div div p:first-child {
        color: #4D4E53;
    }
    .box.offer-log > div div p:last-child {
        font-size: 12px;
        margin-top: 3px;
        color: #989aa3;
    }
</style>