<template>
    <div class="specialAuctionDetails" :class="[roomType==1?'margin-b-40':'']">
        <mt-swipe :auto="4000" class="swipe">
            <mt-swipe-item v-for="(item,key) in datainfo.pictures" :key="item.id">
                <img class="shopBanner" :src="item" />
            </mt-swipe-item>
        </mt-swipe>
        <div class="attribute">
            <div class="attribute_title">
                <p v-html="datainfo.pname">翡翠</p>
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
                    <span v-html="datainfo.starttime.split(' ')[1]">{{}}</span>
                    <span v-html="datainfo.starttime.split(' ')[0]">{{}}</span>
                </div>
                <div class="middle-line"></div>
                <div>
                    <span>结束时间</span>
                    <span v-html="datainfo.endtime.split(' ')[1]"></span>
                    <span v-html="datainfo.endtime.split(' ')[0]"></span>
                </div>
            </div>
        </div>
        <div class="box offer-log">
            <div v-for="(item,index) in offer_list" :class="offer_list.length == index + 1 ?'border-none':''">
                <img :src="item.headimgurl">
                <span v-html="'￥' + item.bided"></span>
                <div>
                    <p v-html="item.nickname">托尔斯泰</p>
                    <p>2017-02-05 12:00:00</p>
                </div>
            </div>
            <p @click="checkMore">查看更多出价人 ></p> <!-- v-if="offer_list.length > 2" -->
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
        <div class="box">
            <p class="title">证书展示</p>
            <div class="certificate">
                <img class="shopBanner" v-for="item in datainfo.cert_img" :src="item" />
            </div>
        </div>
        <div class="button-group" v-if="roomType == 1">
            <!-- <mt-button class="remind" @click="set_remind(1)">提醒(提前30分)</mt-button> -->
            <!-- <mt-button class="remind" @click="set_remind(0)">关闭提醒</mt-button> -->
            <mt-button type="danger" class="offer" @click="offer">出价<span v-if="datainfo.self_raise_info.money != 0"
             v-html="parseInt(datainfo.self_raise_info.bided)"></span></mt-button>
        </div>
        <offer :popup="ispopup" :currentMoney="datainfo.nowprice" :limit="datainfo.stepsize" :shopId="id" @input="close_popup" @specialAuction="specialAuction"></offer>
    </div>
</template>
<script>
    import offer from '../tools/offer.vue'
    export default {
        name: 'specialAuctionDetails',
        data () {
            return {
                // 拍品ID
                id: '',
                // 拍品类型 roomType 1：正在拍, roomType 2：已经结束
                roomType: '',
                datainfo: {
                    nowprice: 0,
                    self_raise_info: {
                        money: 0
                    }
                },
                ispopup: false,
                offer_list: []
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            this.roomType = this.$route.params.roomType;
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
                myFn.ajax('get', {pid: this.id, type: 1}, apiAddress.specialAuction.roomShopDetails, (res) => {
                    this.datainfo = res.data;
                })
            },
            offer () {
                this.ispopup = true;
            },
            getOfferLog () {
                var newArr = [];
                myFn.ajax('get', {pid: this.id}, apiAddress.center.offerLog, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        if (i > 1) return false;
                        newArr.push(res.data.data[i]);
                    };
                    this.offer_list = newArr;
                })
            },
            close_popup (boolean) {
                this.ispopup = boolean;
                console.log(boolean)
            },
            specialAuction (value) {
                var data = {
                    pid: this.id,
                    money: value
                }
                myFn.ajax('post', data, apiAddress.specialAuction.setPrice, (res) => {
                });
            },
            checkMore () {
                this.$router.push({name: 'offerList', params: {id: this.id}})
            }
            // set_remind (type) {
            //     // type == 0 关闭提醒
            //     // type == 1 开启提醒
            //     var api = ''
            //     if (type === 1) {
            //         api = apiAddress.specialAuction.open_remind;
            //     } else {
            //         api = apiAddress.specialAuction.close_remind;
            //     }
            //     var data = {
            //         pid: this.id
            //     }
            //     myFn.ajax('post', data, api, (res) => {});
            // }
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
    .margin-b-40 {
        margin-bottom: 40px;
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
        height: 55px;
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
        /*min-width: 50%;*/
        margin-right: 20px;
        font-size: 15px;
        float: left;
    }
    .attribute_price {
        margin: 20px 0;
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
        width: 50%;
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