<template>
    <div class="red_packet">
        <div class="rob-package">
            <div class="rob-details">
                <img :src="robPackInfo.headimgurl?robPackInfo.headimgurl:require('../../assets/icon/nav/index.png')">
                <p class="sender">{{robPackInfo.nickname}}的红包</p>
                <p class="sender-msg"><span v-html="robPackInfo.remark">恭喜发财，大吉大利</span></p>
                <p class="send-money"><span v-html="robPackInfo.money">100.00</span><span>元</span></p>
                <p style="color:#9a9a9b;font-size:14px;">已存入余额</p>
            </div>
            <!-- <div class="submit-btn">
                <mt-button type="primary" size="large" @click="confirm_rob" style="margin-bottom:20px">确定</mt-button>
            </div> -->
            <div v-if="offer_list.length > 1" class="offer-log">
                <div v-for="(item,index) in offer_list">
                    <img :src="item.headimgurl">
                    <span v-html="'￥' + item.money"></span>
                    <div>
                        <p style="min-height:21px;color:#1b1a1d" v-html="item.nickname">托尔斯泰</p>
                        <p v-html="item.create_time">2017-02-05 12:00:00</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Indicator } from 'mint-ui';
    export default {
        name: 'red_packet',
        data () {
            return {
                robPackInfo: {},
                offer_list: [],
                id: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            if (localStorage.userInfo) {
                if (from.path === '/index/auction/room/' + JSON.parse(localStorage.userInfo).uid) {
                    Indicator.close();
                    window.is_inroom = false;
                    if (window.websocket) {
                        window.websocket.send(JSON.stringify({type: 'exit_room', room_id: 1}))
                        window.websocket.close();
                        window.websocket = false;
                    }
                    clearInterval(window.periods_timer)
                };
            };
            console.log(from.path)
            console.log(to.path)
            next()
        },
        mounted () {
            this.robPackInfo = JSON.parse(localStorage.robPackInfo);
            this.id = this.$route.params.id;
            this.getPacketInfo();
            localStorage.sendInfo = '';
        },
        methods: {
            getPacketInfo () {
                myFn.ajax('post', {chat_id: this.id}, apiAddress.auction.redPacket, (res) => {
                    this.offer_list = res.data.record;
                })
            }
        }
    }
</script>

<style scoped>
    .rob-package .submit-btn button {
        background: #EA5F39;
    }
    .rob-details {
        text-align: center;
        padding-top: 15%;
    }
    .rob-details img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
    }
    .rob-details .sender {
        font-size: 14px;
        margin: 10px 0;
        color: #585B67;
    }
    .rob-details .sender-msg {
        margin: 20px 0;
    }
    .rob-details .sender-msg span {
        display: inline-block;
        background: #FAF8F5;
        font-size: 15px;
        padding: 10px 20px;
        border-radius: 5px;
        color: #626470;
    }
    .rob-details .send-money {
        margin-top: 7%;
    }
    .rob-details .send-money span {
        vertical-align: middle;
    }
    .rob-details .send-money span:first-child {
        font-size: 50px;
        color: #303030;
    }
    .rob-details .send-money span:last-child {
        font-size: 20px;
        margin-left: 10px;
    }
    .offer-log {
        padding: 0 10px;
        margin-top: 15%;
    }
    .offer-log > div {
        position: relative;
        font-size: 0;
        border-bottom: 1px solid #d4d4d4;
    }
    .offer-log > div:first-child {
        border-top: 0;
    }
    .offer-log > div:last-child {
        border-bottom: 0;
    }
    .offer-log > div img {
        width: 40px;
        vertical-align: middle;
        border-radius: 5px;
    }
    .offer-log > div span {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 14px;
        color: #626470;
    }
    .offer-log > div div {
        vertical-align: middle;
        display: inline-block;
        width: calc(100% - 60px);
        margin-left: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .offer-log > div div > p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .offer-log > div div p:first-child {
        font-size: 14px;
        color: #4D4E53;
    }
    .offer-log > div div p:last-child {
        font-size: 12px;
        margin-top: 3px;
        color: #989aa3;
    }
</style>