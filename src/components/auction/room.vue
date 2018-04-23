<template>
    <div class="room" id="room">
        <!-- <mt-swipe :auto="4000" class="swipe" :prevent="prevent">
            <mt-swipe-item><img src="../../assets/banner/banner3.jpg" /></mt-swipe-item>
            <mt-swipe-item><img src="../../assets/banner/banner4.jpg" /></mt-swipe-item>
            <mt-swipe-item><img src="../../assets/banner/banner5.jpg" /></mt-swipe-item>
        </mt-swipe> -->
        <mt-swipe :auto="4000" class="swipe" :prevent="prevent">
            <mt-swipe-item v-if="!defaut_img" v-for="(item,key) in auctionInfo.arrpictures" :key="key"><img :src="item" /></mt-swipe-item>
            <mt-swipe-item v-if="defaut_img" ><img :src="defaut_img" /></mt-swipe-item>
        </mt-swipe>
        <div class="chat">
            <!-- 倒计时 -->
            <div class="countdown" v-if="hasLot">
                <!-- <div v-if="!auctionInfo.pname">
                    <span>暂无拍品</span>
                </div> -->
                <div class="isAuction">
                    <div>
                        <p v-html="auctionInfo.pname"></p>
                        <p><span>出价人 </span><span v-html="auctionInfo.nickname"></span></p>
                    </div>
                    <div>
                        <p><span>当前价 ￥</span><span v-html="auctionInfo.nowprice"></span></p>
                        <p><span>市场价 ￥</span><span  v-html="auctionInfo.price"></span></p>
                    </div>
                </div>
            </div>
            <div class="countdown" v-if="!hasLot">
                <span>暂无拍品</span>
            </div>
            <!-- 聊天框 -->
            <div v-if="!is_visitor" class="chat-wrapper">
                <div class="btn">
                    <!-- <mt-button type="default" size="small" @click="sendMsg">发送</mt-button> -->
                    <mt-button type="default" @click="sendMsg('-1')" size="small">发送</mt-button>
                </div>
                <img class="redpacIcon" @click="launchPackage" src="../../assets/icon/redpacIcon.png" />
                <img class="redpacIcon offerIcon" @click="offer" src="../../assets/icon/offer.png"/>
                <div class="input">
                    <input type="text" v-model="sendMsgValue" @keyup.13="sendMsg('-1')">
                </div>
            </div>
            <div v-if="is_visitor" class="chat-wrapper">
                <p class="before-auth"><span @click="warmMsg">请先认证账户</span></p>
            </div>
            <!-- 聊天区 -->
            <div id="chatArea" class="chat-content" :class="[content_list.length<2?'white-Top':'']">
                <!-- 侧栏 -->
                <div class="sidebar" :class="hasLot?'':'sidebar_none'">
                    <div @click="checkout(1)"><span class="iconfont icon-banfazhengshu"></span>证书</div>
                    <div @click="checkout(2)"><span class="iconfont icon-xinpinkaipai"></span>拍品</div>
                    <div @click="checkout(3)"><span class="iconfont icon-liebiao"></span>列表</div>
                    <div @click="checkout(4)"><span class="iconfont icon-fenxiang"></span>分享</div>
                    <!-- <div @click="popupVisible2=true">红包</div> -->
                </div>
                <!-- 内容区 -->
                <div class="content-wrapper">
                    <div v-for="(item,index) in content_list">
                        <!-- 聊天信息模板 type:1 -->
                        <div class="message-wrapper" v-if="item.type==1">
                            <p class="send-time"><span v-html="item.create_time"></span></p>
                            <div class="head-wrapper">
                                <img :src="item.headimgurl">
                            </div>
                            <div class="message-content" v-html="item.message"></div>
                        </div>
                        <!-- 红包模板 type:2 -->
                        <div class="message-wrapper package-wrapper" v-if="item.type==2">
                            <p class="send-time"><span v-html="item.create_time"></span></p>
                            <div class="head-wrapper">
                                <img :src="item.headimgurl">
                            </div>
                            <div class="package" @click="rob_package(item.chat_id)">
                                <div class="package-unopen">
                                    <div><span class="iconfont icon-icon-test package-img"></span></div>
                                    <div class="package-text">
                                        <p v-html="item.message||'恭喜发财，大吉大利'"></p>
                                        <p>领取红包</p>
                                    </div>
                                </div>
                                <div class="package-classify">红包</div>
                            </div>
                        </div>
                        <!-- 竞价模板 type:3 -->
                        <div class="message-wrapper package-wrapper offer" v-if="item.type==3">
                            <p class="send-time"><span v-html="item.create_time"></span></p>
                            <div class="head-wrapper">
                                <img :src="item.headimgurl">
                            </div>
                            <div class="package">
                                <div class="package-unopen">
                                    <div>
                                        <span v-html="'出价' + item.message.split(',')[1]"></span>
                                    </div>
                                </div>
                                <div class="package-classify" v-html="'本次加价' +item.message.split(',')[0]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 侧栏内容弹层 -->
        <mt-popup v-model="popupVisible" popup-transition="popup-fade">
            <!-- 证书内容 -->
            <div class="licence" v-if="popupContent==1">
                <div class="current-licence" v-html="'证书'"></div>
                <div class="licence-image">
                    <img v-for="item in auctionInfo.cert_img" :src="item">
                </div>
            </div>
            <!-- 拍品内容 -->
            <div class="goods" v-if="popupContent==2">
                <div class="goods-content">
                    <img :src="auctionInfo.pictures">
                    <div>
                        <p class="goods-name" v-html="auctionInfo.pname"></p>
                        <p class="goods-market-price"><span class="cell-lebal">市场价：￥{{auctionInfo.price}}</span></p>
                        <p class="goods-star-number" v-html="auctionInfo.onset"></p>
                        <p class="goods-star-title">起拍价(￥)</p>
                        <div class="white-line"></div>
                        <p class="goods-parameter" v-for="item in auctionInfo.goodsattr">
                            <span class="cell-lebal" v-html="item.attr_name + '：'"></span><span v-html="item.attr_value"></span>
                        </p>
                    </div>
                </div>
            </div>
            <!-- 列表内容 -->
            <div class="goods-list" v-if="popupContent==3">
                <div class="goods-list-wrapper">
                    <div class="goods-item" v-for="item in goods_list" @click="goDetails(item.pid)">
                        <div><img :src="item.pictures?item.pictures:require('../../assets/icon/nav/index.png')" style="width:100%;max-height:100px;"></div>
                        <div :class="[parseInt(item.endstatus) == 0?'noDeal':'']">
                            <p class="item-name"><span v-html="item.pname"></span></p>
                            <div class="isDeal">
                                <p>
                                    <span class="item-lebal">成交价：</span>
                                    <span v-if="parseInt(item.endstatus) == 0" v-html="'拍卖中'"></span>
                                    <span v-if="parseInt(item.endstatus) == 1" v-html="item.nowprice"></span>
                                    <span v-if="parseInt(item.endstatus) == 2" v-html="'流拍'"></span>
                                </p>
                                <span class="iconfont icon-yichengjiao"></span>
                                <p><span class="item-lebal">起拍价：</span><span>￥500</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 分享内容 -->
            <div class="goods-share" v-if="popupContent==4">
                <div class="share-wrapper">
                    <div class="share"><span class="iconfont icon-fenxiang1"></span><p>点击分享</p></div>
                    <div class="close" @click="popupVisible=false"><span class="iconfont icon-shanchu"></span></div>
                </div>
            </div>
            <div v-if="popupContent!==4" class="popup-close" @click="popupVisible=false"><span class="iconfont icon-shanchu"></span></div>
        </mt-popup>
        <!-- 发红包弹层 -->
        <mt-popup v-model="popupVisible2" position="right" class="package-popup">
            <mt-field label="总金额" placeholder="0.00" v-model="package_info.total"><span>元</span></mt-field>
            <mt-field label="红包个数" placeholder="填写个数" v-model="package_info.num"><span>个</span></mt-field>
            <mt-field type="textarea" placeholder="恭喜发财，大吉大利" v-model="package_info.marsk"></mt-field>
            <p class="package-money"><span>￥</span><span  v-html="package_info.total||'0.00'"></span></p>
            <div class="submit-btn">
                <mt-button type="primary" size="large" @click="sendPackage" style="margin-bottom:20px">发红包</mt-button>
                <mt-button type="default" size="large" @click="popupVisible2=false">取消</mt-button>
            </div>
        </mt-popup>
        <!-- 抢红包状态页 -->
        <mt-popup v-model="popupVisible3" class="rob-package">
            <div class="rob-details">
                <img :src="robPackInfo.headimgurl?robPackInfo.headimgurl:require('../../assets/icon/nav/index.png')">
                <p class="sender">{{robPackInfo.nickname}}的红包</p>
                <p class="sender-msg"><span v-html="robPackInfo.remark">恭喜发财，大吉大利</span></p>
                <p class="send-money"><span v-html="robPackInfo.money">100.00</span><span>元</span></p>
                <p style="color:#EA5F39">已领取</p>
            </div>
            <div class="submit-btn">
                <mt-button type="primary" size="large" @click="confirm_rob" style="margin-bottom:20px">确定</mt-button>
            </div>
        </mt-popup>
        <offer :popup="popupVisible4" :currentMoney="currentMoney" :limit="limit" @input="close_popup" @auction="auction"></offer>
        <!-- <div class="mask" v-if="isloading">
            <img src="../../assets/icon/loading.gif" />
        </div> -->
    </div>
</template>
<script>
    import wx from 'weixin-js-sdk'
    import offer from '../tools/offer'
    import { MessageBox, Indicator } from 'mint-ui';
    export default {
        name: 'room',
        data () {
            return {
                // 游客身份
                is_visitor: true,
                // 当前有无拍品
                hasLot: '',
                // prevent
                prevent: true,
                // 聊天信息
                sendMsgValue: '',
                // 发送时间
                send_time: '',
                // 聊天区域内容
                content_list: [],
                // 侧栏弹层
                popupVisible: false,
                // 红包弹层
                popupVisible2: false,
                // 抢红包弹层
                popupVisible3: false,
                // 竞价弹层
                popupVisible4: false,
                // 当前竞价金额
                currentMoney: '',
                // 每次加价金额
                limit: '',
                // 当前加价
                currentAddprice: '',
                // 红包表单信息
                package_info: {
                    total: '',
                    num: '',
                    marsk: ''
                },
                // 抢红包成功信息
                robPackInfo: {},
                // 弹层内容
                popupContent: 0,
                // 拍品信息
                auctionInfo: {},
                // 拍品列表
                goods_list: [],
                // 默认展示图片
                defaut_img: ''
            }
        },
        beforeRouteEnter (to, from, next) {
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
        },
        beforeMount () {
            if (localStorage.userInfo) {
                if (parseInt(localStorage.is_auth) === 1) {
                    this.is_visitor = false;
                }
            }
        },
        mounted () {
            var self = this;
            document.getElementById('room').style.height = document.documentElement.clientHeight + 'px';
            console.log(document.documentElement.clientHeight);
            Indicator.open({
                text: '连接房间中',
                spinnerType: 'snake'
            });
            if (myFn.GetQueryString('code')) {
                myFn.wxlogin();
            };
            window.websocket = new WebSocket('ws://120.25.225.119:9529');
            window.websocket.onopen = function (evt) {
                // 加入房间
                window.websocket.send(JSON.stringify({
                    type: 'join_room',
                    room_id: 1
                }))
                // 获取房间消息历史记录
                window.websocket.send(JSON.stringify({
                    type: 'get_message',
                    room_id: 1
                }));
                // 获取最新拍品列表
                window.websocket.send(JSON.stringify({
                    type: 'get_auction_list',
                    room_id: 1
                }));
                // 获取最新拍品详情,包括商品信息及证书
                window.websocket.send(JSON.stringify({
                    type: 'get_auction_info',
                    room_id: 1
                }));
                // 获取当前拍品剩余流拍时间
                window.websocket.send(JSON.stringify({
                    type: 'get_auction_time',
                    room_id: 1
                }));
                console.log('打开' + evt);
            };
            window.websocket.onclose = function (evt) {
                console.log(evt);
            };
            window.websocket.onmessage = function (evt, e) {
                var res = JSON.parse(evt.data)
                switch (parseInt(res.code)) {
                    case 200:
                        // 进入房间成功
                        if (res.type === 'join_room') {
                            // 关闭加载
                            Indicator.close();
                        };
                        // 获取最新拍品详情,包括商品信息及证书
                        if (res.type === 'get_auction_info') {
                            self.auctionInfo = res.data;
                            self.currentMoney = parseInt(res.data.nowprice);
                            self.limit = parseInt(res.data.stepsize);
                            self.hasLot = true;
                        }
                        // 获取最新拍品列表
                        if (res.type === 'get_auction_list') {
                            self.goods_list = res.data;
                        };
                        // 发送聊天消息回调
                        if (res.type === 'send_message') {
                            self.content_list.push(res.data);
                            self.scroll_bottom();
                        };
                        // 获取聊天记录
                        if (res.type === 'get_message') {
                            self.content_list = self.content_list.concat(res.data.data.reverse());
                            self.scroll_bottom();
                            // 清除缓存信息
                            localStorage.sendInfo = '';
                        };
                        // 发送红包回调
                        if (res.type === 'send_red_packets') {
                            self.content_list.push(res.data);
                            self.popupVisible2 = false;
                            self.scroll_bottom();
                            // 清空表单数据
                            self.package_info.total = '';
                            self.package_info.num = '';
                            self.package_info.marsk = '';
                            // 清除缓存信息
                            localStorage.sendInfo = '';
                        };
                        // 领红包回调
                        if (res.type === 'get_red_packet') {
                            self.robPackInfo = res.data;
                            self.popupVisible3 = true;
                            // 清除缓存信息
                            localStorage.sendInfo = '';
                        };
                        // 加价回调
                        if (res.type === 'raise_price') {
                            self.content_list.push(res.data);
                            // 获取最新拍品详情,包括商品信息及证书
                            window.websocket.send(JSON.stringify({
                                type: 'get_auction_info',
                                room_id: 1
                            }));
                            self.scroll_bottom();
                            // 清除缓存信息
                            localStorage.sendInfo = '';
                        };
                        // 认证回调
                        if (res.type === 'auth') {
                            if (localStorage.sendInfo) {
                                if (JSON.parse(localStorage.sendInfo).type === 'send_message') {
                                    var sendMsgData = JSON.parse(localStorage.sendInfo);
                                    self.sendMsg(sendMsgData)
                                };
                                if (JSON.parse(localStorage.sendInfo).type === 'send_red_packets') {
                                    var packetsData = JSON.parse(localStorage.sendInfo);
                                    self.sendPackage(packetsData)
                                };
                                if (JSON.parse(localStorage.sendInfo).type === 'raise_price') {
                                    var raiseData = JSON.parse(localStorage.sendInfo);
                                    self.auction('', raiseData)
                                };
                                if (JSON.parse(localStorage.sendInfo).type === 'get_red_packet') {
                                    self.rob_package(false);
                                };
                            };
                        };
                        break;
                    // 用户未认证
                    case 89999:
                        // 将发送失败的消息做缓存、认证之后继续发送原消息。
                        /* if (res.type === 'send_message') {
                            localStorage.sendInfo = JSON.stringify({
                                type: 'send_message',
                                room_id: 1,
                                data: self.sendMsgValue
                            })
                        }; */
                        if (res.type === 'send_red_packets') {
                            localStorage.sendInfo = JSON.stringify({
                                type: 'send_red_packets',
                                room_id: 1,
                                num: self.package_info.num,
                                money: self.package_info.total,
                                remark: self.sendMsgValue
                            })
                        };
                        if (res.type === 'raise_price') {
                            localStorage.sendInfo = JSON.stringify({
                                type: 'raise_price',
                                room_id: 1,
                                price: self.currentAddprice,
                                pid: parseInt(self.auctionInfo.pid)
                            })
                        };
                        // 判断是否登录、再去调认证接口
                        if (localStorage.userInfo) {
                            var userID = JSON.parse(localStorage.userInfo).uid;
                            window.websocket.send(JSON.stringify({type: 'auth', user_id: userID}))
                        } else {
                            // alert(1)
                            myFn.wxlogin()
                        }
                        break;
                    case 99988:
                        alert(res.msg);
                        break;
                    case 99990:
                        alert(res.msg);
                        break;
                    case 10000:
                        if (res.type === 'get_red_packet') {
                            MessageBox('提示', '红包被抢光了！');
                        };
                        if (res.type === 'get_auction_info') {
                            self.defaut_img = res.data.defaut_img;
                            self.hasLot = false;
                        };
                        break;
                }
                console.log(res)
            }
        },
        methods: {
            warmMsg () {
                MessageBox('提示', '请返回至个人中心授权认证！');
            },
            // 发送聊天信息
            sendMsg (value) {
                var sendData = {};
                if (!localStorage.userInfo) {
                    myFn.wxlogin();
                    return false;
                }
                if (parseInt(value) === -1) {
                    sendData = {
                        type: 'send_message',
                        room_id: 1,
                        data: this.sendMsgValue
                    }
                    localStorage.sendInfo = JSON.stringify(sendData);
                } else {
                    sendData = value;
                    this.sendMsgValue = value.data;
                }
                if (!this.sendMsgValue) return;
                window.websocket.send(JSON.stringify(sendData));
                this.sendMsgValue = '';
            },
            // 发起发红包之前判断是否登录
            launchPackage () {
                if (!localStorage.userInfo) {
                    myFn.wxlogin();
                    return false;
                }
                this.popupVisible2 = true;
            },
            // 发红包
            sendPackage (value) {
                if (!localStorage.userInfo) {
                    myFn.wxlogin();
                    return false;
                }
                if (!this.package_info.total) {
                    this.$toast({
                        message: '请填写红包金额',
                        duration: 1500
                    });
                    return false;
                } else if (!this.package_info.num) {
                    this.$toast({
                        message: '请填写红包数量',
                        duration: 1500
                    });
                    return false;
                }
                var sendData = {};
                if (value.room_id) {
                    sendData = value;
                } else {
                    sendData = {
                        type: 'send_red_packets',
                        room_id: 1,
                        num: this.package_info.num,
                        money: this.package_info.total,
                        remark: this.sendMsgValue
                    }
                }
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    // 查询余额是否大于所发红包金额
                    if (parseInt(res.data.cost) > 0 && parseInt(res.data.cost) > parseInt(this.package_info.total)) {
                        window.websocket.send(JSON.stringify(sendData));
                    } else {
                        MessageBox.confirm('当前余额不足，是否充值?').then(action => {
                            location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/center/balance/recharge/1'
                        }, () => {
                            this.package_info.num = '';
                            this.package_info.total = '';
                            this.sendMsgValue = '';
                        });
                    }
                })
            },
            // 抢红包
            rob_package (id) {
                if (!localStorage.userInfo) {
                    this.warmMsg();
                    return false;
                } else if (parseInt(localStorage.is_auth) === 0) {
                    this.warmMsg();
                    return false;
                }
                var sendData = {};
                if (id) {
                    sendData = {
                        chat_id: id,
                        room_id: 1,
                        type: 'get_red_packet'
                    }
                    localStorage.sendInfo = JSON.stringify(sendData);
                } else {
                    window.websocket.send(localStorage.sendInfo);
                    return false;
                }
                window.websocket.send(JSON.stringify(sendData));
            },
            confirm_rob () {
                this.popupVisible3 = false;
            },
            close_popup (boolean) {
                this.popupVisible4 = boolean;
            },
            // 出价
            auction (value, data) {
                var self = this;
                var sendData = {};
                self.currentAddprice = value;
                if (!localStorage.userInfo) {
                    myFn.wxlogin();
                    return false;
                }
                if (data) {
                    sendData = data;
                } else {
                    sendData = {
                        type: 'raise_price',
                        room_id: 1,
                        price: self.currentAddprice,
                        pid: parseInt(self.auctionInfo.pid)
                    }
                }
                window.websocket.send(JSON.stringify(sendData));
            },
            offer () {
                this.popupVisible4 = true;
            },
            // 消息更新自动滚动到底部
            scroll_bottom () {
                this.$nextTick(function () {
                    var h = document.getElementById('chatArea').scrollHeight;
                    $('#chatArea').scrollTop(h);
                });
            },
            // 查看侧栏内容
            checkout (type) {
                switch (parseInt(type)) {
                    case 1:
                        if (!this.hasLot) {
                            MessageBox('提示', '当前暂无拍品！');
                            return false;
                        };
                        this.popupContent = 1;

                        // ....
                        break;
                    case 2:
                        if (!this.hasLot) {
                            MessageBox('提示', '当前暂无拍品！');
                            return false;
                        };
                        this.popupContent = 2;
                        // ...
                        break;
                    case 3:
                        this.popupContent = 3;
                        // ...
                        break;
                    case 4:
                        this.popupContent = 4;
                        // ...
                        break;
                }
                this.popupVisible = true;
            },
            goDetails (id) {
                this.$router.push({name: 'goodsDetails', params: {id: id, type: 2}});
            }
        },
        watch: {
            hasLot: function () {
                var self = this;
                var shareImg = ''
                if (self.hasLot) {
                    shareImg = location.protocol + '//' + location.hostname + self.auctionInfo.pictures;
                } else {
                    shareImg = self.defaut_img;
                }
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: '臻宝拍卖',
                    link: location.protocol + '//' + location.hostname + '/mobile/#/index/auction/room',
                    imgUrl: shareImg,
                    // 用户确认分享后执行的回调函数
                    success: function () {
                        self.popupVisible = false;
                    },
                    // 用户取消分享后执行的回调函数
                    cancel: function () {
                        self.popupVisible = false;
                    }
                });
                // 分享给好友
                wx.onMenuShareAppMessage({
                    title: '臻宝拍卖',
                    link: location.protocol + '//' + location.hostname + '/mobile/#/index/auction/room',
                    imgUrl: shareImg,
                    desc: '极致珠宝热拍中',
                    type: 'link',
                    dataUrl: '',
                    success: function () {
                        self.popupVisible = false;
                    },
                    cancel: function () {
                        self.popupVisible = false;
                    }
                });
            }
        },
        components: {
            offer
        }
    }
</script>
<style>
    .room .mint-swipe-indicator {
        background: #fff;
        opacity: 0.7;
    }
    .room .mint-swipe-indicator.is-active {
        background: #AD9355;
    }
    .room .mint-swipe {
        z-index: 2;
    }
    .room .mint-popup {
        width: 100%;
        height: 100%;
        background: none;
        box-sizing: border-box;
        padding: 10% 10px;
        text-align: center;
    }
    .room .mint-popup.package-popup {
        padding: 20px 10px 0;
        background: #F2F2F2;
        text-align: left;
        overflow: auto;
    }
    .room .mint-popup.package-popup .mint-cell {
        background: #fff;
        height: 60px;
        border-radius: 5px;
    }
    .room .mint-popup.package-popup .mint-cell.is-textarea {
        min-height: 80px;
        font-size: 16px;
    }
    .room .mint-popup.rob-package {
        background: #fff;
        overflow: auto;
    }
    .room .mint-cell-wrapper {
        background: none;
    }
    .room .mint-cell {
        background: none;
        margin-bottom: 25px;
    }
    .room .mint-field.is-textarea .mint-field-core {
        resize: none;
        text-align: left;
        font-size: 16px;
    }
    .room .mint-field-core {
        text-align: right;
        font-size: 16px;
        outline: none;
        padding-right: 5px;
        color: #B29A60;
    }
    .room .offer .mint-popup {
        width: 85%;
        height: 250px;
        border-radius: 10px;
        text-align: center;
        margin-right: 7.5%;
        background: #fff;
        padding: 0;
    }
</style>
<style scoped>
    .room {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .chat {
        position: relative;
        width: 100%;
        height: calc(100% - 180px);
        height: -moz-calc(100% - 180px);
        height: -webkit-calc(100% - 180px);
        box-sizing: border-box;
        background: #fff;
    }
    .countdown {
        position: absolute;
        /* top: 180px; */
        left: 0;
        width: 100%;
        height: 48px;
        color: #fff;
        line-height: 48px;
        padding-left: 15px;
        padding-top: 3px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
        font-size: 14px;
    }
    .countdown .isAuction {
        font-size: 0;
    }
    .countdown .isAuction > div {
        display: inline-block;
        line-height: 1.5;
        width: 50%;
        font-size: 14px;
        box-sizing: border-box;
    }
    .countdown .isAuction > div:last-child {
        text-align: right;
        padding-right: 10px;
    }
    .chat-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 48px;
        line-height: 48px;
        box-sizing: border-box;
        z-index: 2;
        background: #fff;
        box-shadow: 0 -1px 1px #eee;
    }
    .chat-wrapper >div.input {
        position: absolute;
        right: 90px;
        left: 85px;
        top: 0;
    }
    .chat-wrapper >div.input input {
        width: 100%;
        height: 35px;
        border: 0;
        border: 1px solid #e4e4e4;
        border-radius: 5px;
        background: #F7F7F7;
        outline: none;
        text-indent: 10px;
        padding-right: 10px;
        margin-left: 5px;
        box-sizing: border-box;
        appearance: none;
        -webkit-appearance: none;
        /* margin-left: 10px; */
    }
    .chat-wrapper > div.btn {
        float: right;
    }
    .chat-wrapper > div.btn .mint-button {
        margin: 0 3px;
        width: 70px;
        height: 48px;
        background: #D83C1E;
        color: #fff;
        border-radius: 0;
        float: right;
        margin: 0;
    }
    .chat-wrapper .redpacIcon {
        width: 40px;
        height: 40px;
        margin-top: -5px;
        vertical-align: middle;
    }
    .chat-wrapper .redpacIcon.offerIcon {
        width: 33px;
        height: 33px;
    }
    .chat-content {
        /* position: absolute;
        left: 0;
        top: 180px;
        height: calc(100% - 240px); */
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 10px 10px 0;
        z-index: 0;
        overflow: auto;
        padding-bottom: 48px;
    }
    .sidebar {
        border-radius: 5px 0 0 5px;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -105px;
        padding: 5px 0;
        background: #AD9355;
    }
    .sidebar.sidebar_none {
        top: 45%;
    }
    .sidebar > div {
        /* height: 40px; */
        padding: 2px 10px;
        font-size: 14px;
        color: #fff;
    }
    @media screen and (max-height: 568px) and (max-width: 320px) {
        .sidebar > div {
            padding: 0 10px;
            font-size: 14px;
            color: #fff;
        }
    }
    .sidebar > div:last-child {
        border-bottom: 0;
    }
    .sidebar > div span {
        display: block;
        text-align: center;
        font-size: 24px;
    }
    .content-wrapper {
        padding-right: 58px;
        margin-bottom: 48px;
    }
    .content-wrapper .message-wrapper {
        margin-bottom: 15px;
    }
    .content-wrapper .message-wrapper .send-time {
        text-align: center;
        font-size: 12px;
        color: #fff;
        padding-left: 55px;
        margin-bottom: 10px;
    }
    .content-wrapper .message-wrapper .send-time span {
        background: #ccc;
        display: inline-block;
        padding: 3px 10px;
        border-radius: 15px;
    }
    .content-wrapper .message-wrapper > div {
        display: inline-block;
        vertical-align: text-top;
    }
    .message-wrapper .head-wrapper {
        width: 45px;
        height: 45px;
        margin-right: 10px;
        box-sizing: border-box;
    }
    .message-wrapper .head-wrapper img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .message-wrapper .message-content {
        max-width: -moz-calc(100% - 80px);
        max-width: -webkit-calc(100% - 80px);
        max-width: calc(100% - 80px);
        font-size: 14px;
        padding: 10px 5px;
        border: 1px solid #d9d9d9;
        box-sizing: border-box;
        border-radius: 7px;
        position: relative;
        word-wrap: break-word;
        word-break: break-all;
    }
    .message-wrapper .message-content:before {
        content: '';
        position: absolute;
        top: 10px;
        left: -13px;
        height: 0;
        width: 0;
        border: 6px solid;
        border-color: #d9d9d9 transparent transparent;
        transform: rotateZ(90deg);
        -ms-transform: rotateZ(90deg);     /* IE 9 */
        -moz-transform: rotateZ(90deg);    /* Firefox */
        -webkit-transform: rotateZ(90deg); /* Safari 和 Chrome */
        -o-transform: rotateZ(90deg);  /* Opera */
    }
    .message-wrapper .message-content:after {
        content: '';
        position: absolute;
        top: 10px;
        left: -12px;
        height: 0;
        width: 0;
        border: 6px solid;
        border-color: #fff transparent transparent;
        transform: rotateZ(90deg);
        -ms-transform: rotateZ(90deg);     /* IE 9 */
        -moz-transform: rotateZ(90deg);    /* Firefox */
        -webkit-transform: rotateZ(90deg); /* Safari 和 Chrome */
        -o-transform: rotateZ(90deg);  /* Opera */
    }
    .white-Top {
        top: 240px;
    }
    .licence {
        width: 90%;
        box-sizing: border-box;
        margin: auto;
        padding: 10px 15px;
        text-align: center;
        color: #fff;
        background: #fff;
        height: 80%;
        border-radius: 5px;
        overflow: scroll;
    }
    .current-licence,
    .licence-image {
        margin-bottom: 10px;
    }
    .current-licence {
        color: #878787;
    }
    .licence-name {
        margin-bottom: 30px;
    }
    .licence-image img {
        width: 100%;
        /* max-height: 180px; */
    }
    .popup-close {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        margin-top: 40px;
        color: #fff;
        position: absolute;
        bottom: 10%;
        left: 50%;
        margin-left: -16px;
    }
    .popup-close .iconfont {
        font-size: 32px;
    }
    .goods {
        width: 90%;
        height: 80%;
        background: #fff;
        margin: auto;
        text-align: left;
        font-size: 0;
        border: 0;
        border-radius: 5px;
        overflow: auto;
    }
    .goods-content > img {
        width: 100%;
        /* max-height: 180px; */
    }
    .goods-content > div {
        background: #fff;
        font-size: 14px;
        padding: 10px 15px;
    }
    .goods-content > div > p {
        margin-bottom: 7px;
    }
    .goods-parameter {
        color: #A29D83;
        width: 49%;
        word-spacing: -10px;
        min-width: 150px;
        display: inline-block;
        margin: 5px 0;
    }
    .goods-market-price {
        color: #A29D83;
    }
    /*.goods-parameter:first-child {
        margin-top: 15px;
    }*/
    .goods-name {
        font-size: 16px;
    }
    .goods-star-number {
        margin-bottom: 0 !important;
        margin-top: 10px;
        font-size: 23px;
        color: #BB9F56;
    }
    .goods-star-title {
        color: #BB9F56;
    }
    .cell-lebal {
        display: inline-block;
        /*width: 50px;*/
    }
    .white-line {
        border-bottom: 1px solid #d9d9d9;
        margin-top: 15px;
        margin-bottom: 7px;
    }
    .goods-list {
        width: 90%;
        margin: auto;
        text-align: left;
        height: 80%;
        overflow: auto;
        border-radius: 5px;
        background: #fff;
    }
    .goods-list-wrapper {
        background: #fff;
        padding: 20px 25px 20px 15px;
    }
    .goods-list-wrapper .goods-item:last-child {
        margin: 0;
    }
    .goods-list-wrapper .goods-item:last-child .isDeal::after {
        background: none;
    }
    .goods-item {
        margin-bottom: 20px;
        padding-bottom: 10px;
    }
    .goods-item > div:first-child {
        width: 100px;
        height: 100px;
        float: left;
    }
    .goods-item > div:last-child {
        padding-left: 110px;
        height: 100px;
    }
    .item-name {
        padding: 0 5px 5px;
        color: #bababa;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .goods-item .isDeal {
        background: #FAF8F5;
        padding: 5px 10px;
        border-radius: 5px;
        position: relative;
    }
    .goods-item .isDeal > span.iconfont {
        font-size: 60px;
        position: absolute;
        right: -10px;
        top: -20px;
        color: #BAB5AD;
    }
    .goods-item .isDeal:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background: #d4d4d4;
        left: 0;
        bottom: -15px;
    }
    .goods-item .isDeal p {
        padding: 0;
        margin: 5px 0;
        color: #dccfb2;
    }
    .goods-item .isDeal > p:first-child {
        color: #D9D6C8;
        padding-bottom: 10px;
        border-bottom: 1px dashed #d1ceca;
    }
    .goods-item .noDeal .isDeal > span.iconfont {
        font-size: 0;
    }
    .goods-item .noDeal .isDeal p {
        color: #b4af92;
    }
    .goods-item .noDeal .isDeal p:last-child {
        color: #bb9f56;
    }
    .noDeal .item-name {
        color: #0f1014;
    }
    .item-lebal {
        width: 70px;
        text-align: right;
        display: inline-block;
    }
    .package-money {
        text-align: center;
        font-size: 48px;
        margin-top: calc(10% + 15px);
    }
    .package-money span:first-child {
        font-size: 24px;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 20%!important;
    }
    .package-popup .submit-btn {
        margin-top: 10%!important;
    }
    .package-popup .submit-btn button:first-child,
    .rob-package .submit-btn button {
        background: #EA5F39;
    }
    .package-popup .submit-btn button:last-child {
        background: #D4D4D4;
    }
    .package {
        border-radius: 5px;
    }
    .package:before {
        content: '';
        position: absolute;
        top: 10px;
        left: -12px;
        height: 0;
        width: 0;
        border: 6px solid;
        border-color: #FA9D3B transparent transparent;
        transform: rotateZ(90deg);
        -ms-transform: rotateZ(90deg);     /* IE 9 */
        -moz-transform: rotateZ(90deg);    /* Firefox */
        -webkit-transform: rotateZ(90deg); /* Safari 和 Chrome */
        -o-transform: rotateZ(90deg);  /* Opera */
    }
    .package-wrapper .package {
        max-width: -moz-calc(100% - 80px);
        max-width: -webkit-calc(100% - 80px);
        max-width: calc(100% - 80px);
        font-size: 14px;
        box-sizing: border-box;
        position: relative;
    }
    .package-classify {
        padding: 3px 0;
        padding-left: 10px;
        font-size: 12px;
        color: #999;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 1px solid #d4d4d4;
        border-top: 0;
        background: #fff;
        width: 178px;
    }
    .offer .package-classify {
        width: 188px;
    }
    .package-unopen {
        background: #FA9D3B;
        color: #fff;
        padding: 10px;
        width: 170px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .package-unopen > div {
        box-sizing: border-box;
    }
    .package-unopen > div:first-child {
        width: 30px;
        float: left;
    }
    .package-unopen .package-img {
        font-size: 35px;
        color: #D83C1E;
    }
    .package-unopen > div:last-child {
        width: 100%;
        padding-left: 40px;
    }
    .package-text p {
        width: 100%;
    }
    .package-text p:first-child {
        margin-bottom: 5px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .package-text p:last-child {
        font-size: 12px;
    }
    .offer .package-unopen {
        height: 25px;
        line-height: 25px;
        font-size: 16px;
    }
    .offer .package-unopen > div {
        padding-left: 0;
        text-align: center;
    }
    .offer .package-unopen .package-img {
        font-size: 24px;
        color: #fff;
    }
    .offer .package-classify {
        text-align: center;
        padding-left: 0;
    }
    .rob-details img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
    }
    .rob-details .sender {
        font-size: 16px;
        margin: 10px 0;
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
    }
    .rob-details .send-money {
        margin-top: 20%;
    }
    .rob-details .send-money span {
        vertical-align: middle;
    }
    .rob-details .send-money span:first-child {
        font-size: 40px;
    }
    .rob-details .send-money span:last-child {
        font-size: 20px;
        margin-left: 10px;
    }
    .goods-share {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 0;
    }
    .share-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .share-wrapper .share {
        text-align: right;
        padding-right: 30px;
        padding-top: 10px;
    }
    .share-wrapper .share p {
        color: #fff;
        margin-top: 5px;
    }
    .share-wrapper .share .iconfont {
        color: #fff;
        font-size: 50px;
    }
    .share-wrapper .close {
        position: absolute;
        bottom: 10%;
        color: #fff;
        text-align: center;
        left: 50%;
        margin-left: -16px;
    }
    .share-wrapper .close .iconfont {
        font-size: 32px;
    }
    .before-auth {
        text-align: center;
        color: #AD9355;
    }
    .before-auth span {
        position: relative;
    }
    .before-auth span:after {
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        bottom: 0px;
        left: 0;
        background: #AD9355;
    }
    @media screen and (max-width: 320px) {
        .goods-item > div:first-child {
            width: 70px;
            height: 70px;
        }
        .goods-item > div:last-child {
            padding-left: 80px;
            height: auto;
        }
        .item-name {
            font-size: 14px;
        }
        .goods-item .isDeal {
            padding: 5px;
        }
        .goods-item .isDeal p {
            font-size: 12px;
            padding: 0;
            margin: 0;
            text-align: left;
        }
        .goods-item .isDeal p:first-child {
            padding-bottom: 6px;
            margin-bottom: 4px;
        }
    }
</style>