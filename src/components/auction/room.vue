<template>
    <div class="room" id="room">
        <!-- <mt-swipe :auto="4000" class="swipe" :prevent="prevent">
            <mt-swipe-item><img src="../../assets/banner/banner3.jpg" /></mt-swipe-item>
            <mt-swipe-item><img src="../../assets/banner/banner4.jpg" /></mt-swipe-item>
            <mt-swipe-item><img src="../../assets/banner/banner5.jpg" /></mt-swipe-item>
        </mt-swipe> -->
        <div class="main-wrapper">
            <mt-swipe :auto="4000" class="swipe" :prevent="prevent" v-if="carousel_image_type == 1">
                <mt-swipe-item v-if="!defaut_img.length" v-for="(item,key) in auctionInfo.arrpictures" :key="key"><img :src="item" /></mt-swipe-item>
                <mt-swipe-item v-if="defaut_img.length" v-for="(item,key) in defaut_img" :key="key"><img :src="item" /></mt-swipe-item>
            </mt-swipe>
            <!-- <iframe v-if="carousel_image_type == 2" :src="videoUrl" height="180" width="100%" frameborder="0"></iframe> -->
            <div v-if="carousel_image_type == 2" style="width:100%;height:180px;background:#fff;">
                <video v-if="!popupVisible && !popupVisible2 && !popupVisible4 && !is_open_private" id="video" autoplay loop class="video" controls="controls" webkit-playsinline="true" playsinline="true">
                    <source :src="defaut_img[0]"></source>
                </video>
            </div>
            <div class="chat" id="chat">
                <!-- 倒计时 -->
                <div class="countdown" v-if="has_periods">
                    <div v-if="start_time != 0">
                        <span>{{'离下期开拍还剩：' + start_time}}</span>
                        <div class="set_clock" @click="set_remind">
                            <span v-html="!is_warm?'开启提醒':'关闭提醒'"></span>
                            <img :src="!is_warm?require('../../assets/icon/clock_default.png'):require('../../assets/icon/clock_active.png')" >
                        </div>
                    </div>
                    <div v-else class="isAuction">
                        <div v-if="auctionInfo.status == 0">
                            <span style="white-space: nowrap;display: inline-block;width: 195%;text-overflow: ellipsis;overflow: hidden;" v-html="warm_message"></span>
                        </div>
                        <div v-if="auctionInfo.status == 0">
                            <!-- <span>本期结束</span>
                            <span v-html="periods_end_time"></span> -->
                        </div>

                        <div v-if="auctionInfo.status != 0" :class="[auctionInfo.status != 0?'line-height':'']">
                            <p v-html="auctionInfo.pname"></p>
                            <p><span>出价人 </span><span v-html="auctionInfo.nickname || '无'"></span></p>
                        </div>
                        <div v-if="auctionInfo.status != 0" :class="[auctionInfo.status != 0?'line-height':'']">
                            <p><span>当前价 ￥</span><span v-html="auctionInfo.nowprice || 0"></span></p>
                            <p><span>市场价 ￥</span><span  v-html="auctionInfo.price || 0"></span></p>
                        </div>
                    </div>
                </div>
                <div class="countdown" v-if="!has_periods">
                    <span style="white-space: nowrap;">下期拍品尚未开始，敬请期待。</span>
                </div>
                <!-- 聊天框 -->
                <!-- <div v-if="is_auth == 1" class="chat-wrapper" :class="[is_Unread_message?'new-message':'']">
                    <div class="btn">
                        <mt-button type="default" size="small" @click="sendMsg">发送</mt-button>
                        <mt-button type="default" @click="sendMsg('-1')" size="small">发送</mt-button>
                    </div>
                    <img class="redpacIcon" v-if="open_private" @click="open_private_popup" style="width: 33px;height: 33px;margin-left: 5px;margin-right: 5px;" src="../../assets/icon/qun.png">
                    <img class="redpacIcon" v-if="!open_private" @click="open_private_popup" style="width: 33px;height: 33px;margin-left: 5px;margin-right: 5px;" src="../../assets/icon/si.png">back_group_chat
                    <img v-if="is_auctioneer == 2" class="redpacIcon" @click="launchPackage" src="../../assets/icon/redpacIcon.png" />
                    <img v-if="is_auctioneer == 1" class="redpacIcon offerIcon" @click="offer" src="../../assets/icon/offer.png"/>
                    <div class="input">
                        <input type="text" v-model="sendMsgValue" @keyup.13="sendMsg('-1')">
                    </div>
                </div>
                <div v-else class="chat-wrapper">
                    <p class="before-auth"><span @click="is_goAuth(2)">请先认证账户</span></p>
                </div> -->
                <!-- 聊天区 -->
                <div id="chatArea" class="chat-content" :class="[content_list.length<2?'white-Top':'']">
                    <!-- 侧栏 -->
                    <div class="sidebar" :class="hasLot?'':'sidebar_none'">
                        <div @click="checkout(1)"><span class="iconfont icon-banfazhengshu"></span>证书</div>
                        <div @click="checkout(2)"><span class="iconfont icon-xinpinkaipai"></span>拍品</div>
                        <div @click="checkout(3)"><span class="iconfont icon-liebiao"></span>预展</div>
                        <div @click="checkout(4)"><span class="iconfont icon-fenxiang"></span>分享</div>
                        <!-- <div @click="popupVisible2=true">红包</div> -->
                    </div>
                    <!-- 私聊内容区
                    <div v-show="open_private" class="content-wrapper">
                        <div v-for="(item,index) in private_chat_log">
                            聊天信息模板 type:1
                            <div class="message-wrapper">
                                <p class="send-time"><span v-html="item.create_time"></span></p>
                                <div class="head-wrapper" :class="item.is_auctioneer == 2 ? 'isVIP' : ''">
                                    <p v-html="item.nickname"></p>
                                    <img :src="item.headimgurl">
                                </div>
                                <div class="message-content" v-html="item.message"></div>
                            </div>
                        </div>
                    </div> -->
                    <!-- 群聊内容区 -->
                    <!-- <div v-show="!open_private" class="content-wrapper"> -->
                    <div class="content-wrapper">
                        <div v-for="(item,index) in content_list">
                            <!-- 聊天信息模板 type:1 -->
                            <div class="message-wrapper" v-if="item.type==1">
                                <p class="send-time"><span v-html="item.create_time"></span></p>
                                <div class="head-wrapper" :class="item.is_auctioneer == 2 ? 'isVIP' : ''">
                                    <p v-html="item.nickname"></p>
                                    <!-- <img :src="item.headimgurl" @click="open_private_chat(item.uid, item.is_auctioneer)"> -->
                                    <img :src="item.headimgurl" @click="dosomething(item, index)">
                                </div>
                                <div class="message-content" v-html="item.message"></div>
                            </div>
                            <!-- 红包模板 type:2 -->
                            <div class="message-wrapper package-wrapper" v-if="item.type==2">
                                <p class="send-time"><span v-html="item.create_time"></span></p>
                                <div class="head-wrapper" :class="item.is_auctioneer == 2 ? 'isVIP' : ''">
                                    <p v-html="item.nickname"></p>
                                    <!-- <img :src="item.headimgurl" @click="open_private_chat(item.uid, item.is_auctioneer)"> -->
                                    <img :src="item.headimgurl" @click="dosomething(item, index)">
                                </div>
                                <div class="package" @click="rob_package(item.chat_id)">
                                    <div class="package-unopen">
                                        <div>
                                            <span v-if="item.hb_type == 2" class="iconfont icon-icon-test package-img"></span>
                                            <img v-if="item.hb_type == 1" class="iconfont pinshouqi package-img" src="../../assets/icon/shouqi.png">
                                        </div>
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
                                <div class="head-wrapper" :class="item.is_auctioneer == 2 ? 'isVIP' : ''">
                                    <p v-html="item.nickname"></p>
                                    <!-- <img :src="item.headimgurl" @click="open_private_chat(item.uid, item.is_auctioneer)"> -->
                                    <img :src="item.headimgurl" @click="dosomething(item, index)">
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
                            <!-- 竞价模板 type:30 -->
                            <div class="message-wrapper package-wrapper offer" v-if="item.type==30">
                                <p class="send-time"><span v-html="item.create_time"></span></p>
                                <div class="head-wrapper" :class="item.is_auctioneer == 2 ? 'isVIP' : ''">
                                    <p v-html="item.nickname"></p>
                                    <!-- <img :src="item.headimgurl" @click="open_private_chat(item.uid, item.is_auctioneer)"> -->
                                    <img :src="item.headimgurl" @click="dosomething(item, index)">
                                </div>
                                <div class="package">
                                    <div class="package-unopen">
                                        <div>
                                            <span v-if="parseInt(item.message.split(',')[0]) <= 0" v-html="'出价' + item.message.split(',')[1] + '（无效）'"></span>
                                            <span v-if="parseInt(item.message.split(',')[0]) > 0" v-html="'出价' + item.message.split(',')[1]"></span>
                                        </div>
                                    </div>
                                    <div class="package-classify" v-if="parseInt(item.message.split(',')[0]) <= 0" v-html="'本次加价无效'"></div>
                                    <div class="package-classify" v-if="parseInt(item.message.split(',')[0]) > 0" v-html="'本次加价' +item.message.split(',')[0]"></div>
                                </div>
                            </div>
                            <!-- 倒计时模板 type:4 -->
                            <div class="message-wrapper" v-if="item.type==4">
                                <p class="send-time"><span v-html="item.create_time"></span></p>
                                <div class="head-wrapper" :class="item.is_auctioneer == 2 ? 'isVIP' : ''">
                                    <p>系统</p>
                                    <img src="../../assets/icon/head.png">
                                </div>
                                <div class="message-content" v-html="item.message"></div>
                            </div>
                            <!-- 禁言模板 type:5 -->
                            <div class="message-wrapper" v-if="item.type==9">
                                <p class="send-time"><span v-html="item.message"></span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 聊天框 -->
            <div v-if="is_auth == 1" class="chat-wrapper">
                <div class="btn">
                    <!-- <mt-button type="default" size="small" @click="sendMsg">发送</mt-button> -->
                    <mt-button class="sendBtn" type="default" @click="sendMessage" size="small">发送</mt-button>
                </div>
                <!-- <img class="redpacIcon" v-if="open_private" @click="open_private_popup" style="width: 33px;height: 33px;margin-left: 5px;margin-right: 5px;" src="../../assets/icon/qun.png">
                <img class="redpacIcon" v-if="!open_private" @click="open_private_popup" style="width: 33px;height: 33px;margin-left: 5px;margin-right: 5px;" src="../../assets/icon/si.png">back_group_chat -->
                <!-- <img v-if="is_auctioneer == 2" class="redpacIcon" @click="launchPackage" src="../../assets/icon/redpacIcon.png" /> -->
                <img v-if="is_auctioneer == 2" class="redpacIcon offerIcon" @click="launchPackage" src="../../assets/icon/hongbao-.png"/>
                <div v-if="is_auctioneer == 1" class="redpacIcon offer-btn"  @click="offer">
                    <span>出价</span>
                    <img src="../../assets/icon/chujia.png">
                </div>
                <!-- <img v-if="is_auctioneer == 2" class="redpacIcon offerIcon" @click="offer" src="../../assets/icon/offer.png"/> -->
                <div class="input" :class="is_auctioneer == 1 ? 'input-offer' : ''">
                    <input type="text" id="chat-input" class="chat-input" @click="inputClick" @focus="inputFocus" @blur="inputBlur" v-model="sendMsgValue" @keyup.8="backspace" @keyup.13="sendMessage">
                    <input type="text" id="ios-input">
                </div>
            </div>
            <div v-else class="chat-wrapper">
                <p class="before-auth"><span @click="is_goAuth(2)">请先认证账户</span></p>
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
                        <p class="goods-star-parseFloat" v-html="auctionInfo.onset"></p>
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
                        <div :class="[parseInt(item.endstatus) != 1?'noDeal':'']">
                            <p class="item-name"><span v-html="item.pname"></span></p>
                            <div class="isDeal">
                                <p>
                                    <span class="item-lebal">成交价：</span>
                                    <span v-html="item.endstatus == 1?item.nowprice:item.endstatus_msg"></span>
                                    <!-- <span v-if="parseInt(item.endstatus) == 0" v-html="'拍卖中'"></span>
                                    <span v-if="parseInt(item.endstatus) == 1" v-html="item.nowprice"></span>
                                    <span v-if="parseInt(item.endstatus) == 2" v-html="'流拍'"></span> -->
                                </p>
                                <span class="iconfont icon-yichengjiao"></span>
                                <p><span class="item-lebal">起拍价：</span><span v-html="item.onset"></span></p>
                                <p><span class="item-lebal">中拍人：</span><span v-html="item.endstatus == 2 ? '无' : item.nickname"></span></p>
                            </div>
                        </div>
                    </div>
                    <p v-if="goods_list.length == 0" style="color: #999;font-size: 14px;text-align: center;margin-top: 40%;">暂无数据 ...</p>
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
            <mt-field label="总金额" placeholder="0.00" type="parseFloat" v-model="package_info.total"><span>元</span></mt-field>
            <p class="redPacketType" v-if="package_info.type == 1">每人抽到金额随机，<span @click="package_info.type=2">改为普通红包</span></p>
            <p class="redPacketType" v-if="package_info.type == 2">每人收到固定金额，<span @click="package_info.type=1">改为拼手气红包</span></p>
            <mt-field label="红包个数" placeholder="填写个数" type="parseFloat" v-model="package_info.num"><span>个</span></mt-field>
            <mt-field type="textarea" placeholder="恭喜发财，大吉大利" v-model="package_info.marsk"></mt-field>
            <p class="package-money"><span>￥</span><span  v-html="package_info.total||'0.00'"></span></p>
            <div class="submit-btn">
                <mt-button type="primary" size="large" @click="sendPackage" style="margin-bottom:20px">发红包</mt-button>
                <mt-button type="default" size="large" @click="popupVisible2=false">取消</mt-button>
            </div>
        </mt-popup>
        <!-- 抢红包状态页 -->
        <!-- <mt-popup v-model="popupVisible3" class="rob-package">
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
        </mt-popup> -->
        <offer :popup="popupVisible4" :currentMoney="currentMoney" :limit="limit" @input="close_popup" @auction="auction"></offer>
        <!-- <div class="mask" v-if="isloading">
            <img src="../../assets/icon/loading.gif" />
        </div> -->
       <!--  私聊列表
       <mt-popup v-model="is_open_private" class="private-wrapper" position='left'>:closeOnClickModal="!is_open_private"
           <p class="private-title">私聊列表</p>
           <div class="private-list">
               <div v-for="item in private_list" @click="open_private_chat(item.uid, 2)">
                   <div class="new-private-message" v-if="item.not_read_num != 0" v-html="item.not_read_num > 99?'99':item.not_read_num"></div>
                   <img :src="item.headimgurl">
                   <span v-html="item.nickname">小V</span>
               </div>
           </div>
           <div class="back-public" @click="back_group_chat">返回群聊</div>
       </mt-popup> -->
        <div class="operation" v-if="jinyanPopup">
            <div class="operation_cell" v-if="is_auctioneer == 2" @click.stop="jinyan" v-html="jinyanInfo.is_silenced == 0?'禁言':'解除禁言'"></div>
            <div class="operation_cell" @click.stop="open_siliao">私聊</div>
            <div v-if="is_auctioneer == 2 && jinyanInfo.types != 3 && jinyanInfo.types !=2" class="operation_cell" @click.stop="del_message">删除该条信息</div>
            <div class="mint-msgbox-btns"><button class="mint-msgbox-btn mint-msgbox-cancel" @click="jinyanPopup = false">取消</button></div>
        </div>
        <div class="no-say" v-if="jinyanPopup"></div>
        <div class="online">在线 <span v-html="count_user"></span></div>
    </div>
</template>
<script>
    // import wx from 'weixin-js-sdk'
    import offer from '../tools/offer'
    import { MessageBox, Indicator } from 'mint-ui';
    export default {
        name: 'room',
        data () {
            return {
                // 提醒
                warm_message: '下件商品尚未开拍，敬请期待。',
                // 在线人数
                count_user: '',
                // 点击头像操作
                jinyanPopup: false,
                jinyanInfo: {
                    jinyanID: '',
                    jinyanName: '',
                    is_siliao: false,
                    is_silenced: 0,
                    index: '',
                    messageID: '',
                    messageType: '',
                    types: ''
                },
                // 期数结束时间
                periods_end_time: '',
                // 游客身份
                is_auth: '',
                // 自己的身份ID
                personID: '',
                // 最后出价人信息
                offerInfo: {
                    uid: '',
                    nickname: ''
                },
                // 当前有无拍品
                hasLot: '',
                // prevent
                prevent: true,
                // 聊天信息
                sendMsgValue: '',
                // 发送时间
                // send_time: '',
                // 聊天区域内容
                content_list: [],
                // 侧栏弹层
                popupVisible: false,
                // 红包弹层
                popupVisible2: false,
                // 抢红包弹层
                // popupVisible3: false,
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
                    marsk: '',
                    type: 1
                },
                // 抢红包成功信息
                // robPackInfo: {},
                // 弹层内容
                popupContent: 0,
                // 拍品信息
                auctionInfo: {
                    nickname: ''
                },
                // 拍品列表
                goods_list: [],
                // 图片、视频类型
                carousel_image_type: '',
                // 默认展示图片
                defaut_img: [],
                // 倒计时
                initTime: '',
                start_time: '',
                // 是否开启提醒
                is_warm: '',
                // 是否设置提醒
                has_periods: false,
                // 是否拍卖师身份
                is_auctioneer: '',
                // 是否在私聊房间
                open_private: false,
                // 私聊列表是否打开
                is_open_private: false,
                // 私聊用户列表
                private_list: [],
                // 私聊记录
                private_chat_log: [],
                // 判断是否有未读消息
                is_Unread_message: false,
                // 判断是否已经认证房间
                is_websocket_login: false,
                // 判断是否是发送私聊信息
                // is_private_message: false,
                // 私聊ID
                private_userID: '',
                // 拍品倒计时读秒
                surplus_seconde: '',
                videoUrl: '',
                is_IOS: false,
                is_focus: false,
                raise_priceID: '',
                // 接收消息后是否自动滚动
                is_scroll: false,
                is_connect: false
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
        beforeMount () {
            // 获取平台认证信息
            // this.getInfo();
        },
        mounted () {
            this.is_auth = parseInt(localStorage.is_auth) || 0;
            if (localStorage.userInfo) {
                this.personID = JSON.parse(localStorage.userInfo).uid;
            };
            var routeID = this.$route.params.id;
            if (parseInt(routeID) !== '') {
                myFn.ajax('post', {uid: routeID}, apiAddress.admin.setUserDown, (res) => {
                    // alert(JSON.stringify(res))
                })
            };
            window.is_inroom = true;
            var self = this;
            self.getInfo();
            document.getElementById('room').style.height = document.documentElement.clientHeight + 'px';
            document.getElementById('chat').style.height = document.documentElement.clientHeight - 228 + 'px';
            // console.log(document.documentElement.clientHeight);
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isiOS && window.is_inroom && parseInt(self.is_auth) === 1) {
                self.is_IOS = true;
            };
            document.querySelector('#room').addEventListener('touchmove', function (e) {
                document.querySelector('.chat-input').blur();
            });
            Indicator.open({
                text: '连接房间中',
                spinnerType: 'snake'
            });
            if (myFn.GetQueryString('code')) {
                myFn.wxlogin();
            };
            function websocket () {
                console.log(window.websocket)
                if (window.websocket) {
                    init();
                    return false;
                };
                window.websocket = new WebSocket('wss://auction.qinhantangtop.com:9529');
                window.websocket.onopen = function (evt) {
                    console.log('打开聊天')
                    self.is_connect = true;
                    init();
                    console.log('打开' + evt);
                    Indicator.close();
                };
                window.websocket.onclose = function (evt) {
                    console.log(window.websocket)
                    window.websocket = false;
                    self.is_connect = false;
                    function reconnect () {
                        if (window.is_inroom && !self.is_connect) {
                            setTimeout(res => {
                                websocket();
                                reconnect();
                                // console.log('重连中')
                            }, 1000)
                        }
                    }
                    reconnect();
                };
                window.websocket.onerror = function (evt) {
                    Indicator.open({
                        text: '连接中',
                        spinnerType: 'snake'
                    });
                    // console.log(evt)
                }
                window.websocket.onmessage = function (evt, e) {
                    var res = JSON.parse(evt.data)
                    switch (parseInt(res.code)) {
                        case 200:
                            // 进入房间成功
                            if (res.type === 'join_room') {
                                // 关闭加载
                                Indicator.close();
                                self.count_user = res.data.count;
                            };
                            if (res.type === 'exit_room') {
                                self.count_user = res.data.count;
                            }
                            // 在线人数
                            if (res.type === 'count_user') {
                                self.count_user = res.data.count;
                            };
                            // 获取当前期数开始时间
                            if (res.type === 'get_auction_time') {
                                if (res.data.id) {
                                    self.periods_end_time = res.data.end_time;
                                    window.periods_timer = setInterval(res => {
                                        var timestamp = parseInt(new Date().getTime() / 1000);
                                        if (timestamp === parseInt(self.periods_end_time)) {
                                            clearInterval(window.periods_timer);
                                            MessageBox('提示', '本期拍卖已经结束!')
                                        };
                                    }, 1000)
                                    self.start_time = res.data.start_time;
                                    self.initTime = res.data.start_time;
                                    self.has_periods = true;
                                    var timer = setInterval(() => {
                                        self.getMinux();
                                    }, 1000)
                                    self.getMinux();
                                    if (self.start_time === 0) {
                                        clearInterval(timer);
                                    };
                                } else {
                                    self.start_time = 0;
                                    self.initTime = 0;
                                    self.has_periods = false;
                                }
                            };
                            // 获取最新拍品详情,包括商品信息及证书
                            if (res.type === 'get_auction_info') {
                                self.auctionInfo = res.data;
                                self.carousel_image_type = res.data.carousel_image_type;
                                self.defaut_img = res.data.arrpictures;
                                self.videoUrl = location.protocol + '//' + location.hostname + ':' + location.port + '/#/index/auction/video/' + encodeURIComponent(self.defaut_img[0])
                                // console.log(self.videoUrl)
                                // self.currentMoney = parseFloat(res.data.nowprice);
                                self.limit = parseFloat(res.data.stepsize);
                                self.surplus_seconde = parseInt(res.data.surplus_time);
                                self.hasLot = true;
                                self.offerInfo.nickname = res.data.nickname;
                                self.offerInfo.uid = res.data.uid;
                                self.countDown();
                            }
                            // 获取最新拍品列表
                            if (res.type === 'get_auction_list') {
                                self.goods_list = res.data;
                            };
                            // 发送聊天消息回调
                            if (res.type === 'send_message') {
                                var bool;
                                self.content_list.push(res.data);
                                for (var l = 0; l < self.content_list.length; l++) {
                                    if (parseInt(self.content_list[l].uid) === parseInt(res.data.uid)) {
                                        self.content_list[l].is_auctioneer = res.data.is_auctioneer;
                                    };
                                };
                                if (parseInt(res.data.uid) === parseInt(self.personID)) {
                                    self.sendMsgValue = '';
                                    bool = true;
                                } else {
                                    bool = false;
                                }
                                self.calcHeight(bool)
                                localStorage.sendInfo = '';
                            };
                            // 获取聊天记录
                            if (res.type === 'get_message') {
                                if (res.data.data) {
                                    self.content_list = self.content_list.concat(res.data.data.reverse());
                                    self.scroll_bottom();
                                };
                                // 清除缓存信息
                                localStorage.sendInfo = '';
                            };
                            // 发送红包回调
                            if (res.type === 'send_red_packets') {
                                res.data.is_auctioneer = 2;
                                self.content_list.push(res.data);
                                self.popupVisible2 = false;
                                self.scroll_bottom(true);
                                // 清空表单数据
                                self.package_info.total = '';
                                self.package_info.num = '';
                                self.package_info.marsk = '';
                                // 清除缓存信息
                                localStorage.sendInfo = '';
                            };
                            // 领红包回调
                            if (res.type === 'get_red_packet') {
                                localStorage.robPackInfo = JSON.stringify(res.data);
                                self.$router.push({name: 'redPacket', params: {id: res.data.chat_id}})
                                // alert(res.data.id)
                                // window.websocket.send(JSON.stringify({type: 'red_packet_info', chat_id: res.data.id, room_id: 1}));
                                // self.popupVisible3 = true;
                                // 清除缓存信息
                                // localStorage.sendInfo = '';
                            };
                            // 加价回调
                            if (res.type === 'raise_price') {
                                self.content_list.push(res.data);
                                self.surplus_seconde = parseInt(res.data.surplus_time);
                                self.auctionInfo.nickname = res.data.nickname;
                                // self.countDown();
                                // 获取最新拍品详情,包括商品信息及证书
                                self.auctionInfo.nowprice = res.data.message.split(',')[1];
                                self.offerInfo = res.data;
                                // window.websocket.send(JSON.stringify({type: 'get_auction_info', room_id: 1}));
                                self.scroll_bottom(true);
                                // 清除缓存信息
                                localStorage.sendInfo = '';
                                // self.currentMoney = res.data.message.split(',')[1];
                            };
                            // 判断是否设置提醒回调
                            if (res.type === 'check_remind') {
                                self.is_warm = res.data.is_remind;
                                // 清除缓存信息
                                localStorage.sendInfo = '';
                            };
                            // 设置提醒回调
                            if (res.type === 'add_remind') {
                                self.is_warm = !self.is_warm;
                                // 清除缓存信息
                                localStorage.sendInfo = '';
                            };
                            // 获取用户聊天列表
                            if (res.type === 'get_single_user_list') {
                                if (res.data) {
                                    self.private_list = res.data;
                                    for (var i = 0; i < self.private_list.length; i++) {
                                        if (parseInt(self.private_list[i].not_read_num) !== 0) {
                                            self.is_Unread_message = true;
                                        }
                                    };
                                };
                                localStorage.sendInfo = '';
                            };
                            // 发送私聊信息回调
                            if (res.type === 'send_single_message' && window.is_inroom) {
                                // self.private_chat_log.push(res.data);
                                res.data.type = 1;
                                self.content_list.push(res.data);
                                self.scroll_bottom(true);
                                self.jinyanInfo.is_siliao = false;
                                self.sendMsgValue = '';
                                localStorage.sendInfo = '';
                                /* if (parseInt(self.personID) === parseInt(res.data.uid)) {
                                };
                                // console.log(!((parseInt(self.personID) === parseInt(res.data.uid)) || (parseInt(self.private_userID) === parseInt(res.data.uid))))
                                if (self.open_private) {
                                    if (!((parseInt(self.personID) === parseInt(res.data.uid)) || (parseInt(self.private_userID) === parseInt(res.data.uid)))) {
                                        self.is_Unread_message = true;
                                        // console.log('进来了')
                                    } else {
                                        if (parseInt(self.personID) !== parseInt(res.data.uid)) {
                                            window.websocket.send(JSON.stringify({type: 'get_notread_single_message', user_id: self.private_userID}))
                                        };
                                    }
                                } else {
                                    self.is_Unread_message = true;
                                }
                                window.websocket.send(JSON.stringify({type: 'get_single_user_list', page: 1, room_id: 1}));
                                self.scroll_bottom();
                                localStorage.sendInfo = ''; */
                                // alert(self.private_chat_log.length)
                            };
                            // 获取私聊已读消息
                            if (res.type === 'get_isread_single_message' && window.is_inroom) {
                                if (res.data) {
                                    self.private_chat_log = self.private_chat_log.concat(res.data);
                                }
                                window.websocket.send(JSON.stringify({type: 'get_notread_single_message', user_id: self.private_userID}))
                                // 获取用户聊天列表
                                window.websocket.send(JSON.stringify({type: 'get_single_user_list', page: 1, room_id: 1}));
                                self.scroll_bottom(true);
                            };
                            if (res.type === 'get_notread_single_message') {
                                // alert(res.data && (parseInt(self.personID) === parseInt(res.data.receive_uid)))
                                if (res.data) {
                                    self.private_chat_log = self.private_chat_log.concat(res.data);
                                };
                                self.scroll_bottom(true);
                            };
                            // 认证回调
                            if (res.type === 'auth') {
                                window.websocket.send(JSON.stringify({type: 'get_message', room_id: 1}));
                                if (self.has_periods) {
                                    // 查到期数调用检查提醒
                                    window.websocket.send(JSON.stringify({type: 'check_remind', room_id: 1}));
                                };
                                self.is_websocket_login = true;
                                if (localStorage.sendInfo) {
                                    if (JSON.parse(localStorage.sendInfo).type === 'send_message') {
                                        var sendMsgData = JSON.parse(localStorage.sendInfo);
                                        self.qunliao(sendMsgData)
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
                                    if (JSON.parse(localStorage.sendInfo).type === 'check_remind') {
                                        window.websocket.send(JSON.stringify({type: 'check_remind', room_id: 1}))
                                    };
                                    if (JSON.parse(localStorage.sendInfo).type === 'add_remind') {
                                        self.set_remind();
                                    };
                                    if (JSON.parse(localStorage.sendInfo).type === 'get_single_user_list') {
                                        window.websocket.send(JSON.stringify({type: 'get_single_user_list', room_id: 1, page: 1}))
                                    };
                                    if (JSON.parse(localStorage.sendInfo).type === 'send_single_message') {
                                        window.websocket.send(JSON.stringify(localStorage.sendInfo))
                                    };
                                };
                            };
                            // 禁言回调
                            if (res.type === 'silenced') {
                                for (var n = 0; n < self.content_list.length; n++) {
                                    if (parseInt(self.content_list[n].uid) === parseInt(res.data.silenced_uid)) {
                                        self.content_list[n].is_silenced = res.data.is_silenced
                                    }
                                };
                                /* self.content_list.push({
                                    type: 5,
                                    is_silenced: res.data.is_silenced,
                                    nickname: res.data.nickname
                                }) */
                                self.content_list.push(res.data)
                                self.scroll_bottom(true);
                            }
                            // 删除回调
                            if (res.type === 'delete_chat') {
                                for (var m = 0; m < self.content_list.length; m++) {
                                    if (parseInt(self.content_list[m].id) === parseInt(res.data.chat_id)) {
                                        self.content_list.splice(m, 1)
                                        self.jinyanPopup = false;
                                    };
                                };
                            }
                            break;
                        // 用户未进行websocket认证
                        case 89999:
                            // 将发送失败的消息做缓存、认证之后继续发送原消息。
                            if (res.type === 'send_message') {
                                localStorage.sendInfo = JSON.stringify({type: 'send_message', room_id: 1, data: self.sendMsgValue})
                            };
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
                            if (res.type === 'check_remind') {
                                localStorage.sendInfo = JSON.stringify({type: 'check_remind', room_id: 1})
                            };
                            if (res.type === 'add_remind') {
                                localStorage.sendInfo = JSON.stringify({type: 'add_remind', room_id: 1})
                            };
                            if (res.type === 'get_single_user_list') {
                                localStorage.sendInfo = JSON.stringify({type: 'get_single_user_list', room_id: 1, page: 1})
                            };
                            // 判断是否登录、再去调认证接口
                            // if (localStorage.userInfo && !self.is_websocket_login) {
                            if (!self.is_websocket_login) {
                                var userID = JSON.parse(localStorage.userInfo).uid;
                                window.websocket.send(JSON.stringify({type: 'auth', user_id: userID}))
                            }
                            /* else {
                                // alert(1)
                                // myFn.wxlogin()
                                MessageBox('提示', '请前往个人中心进行认证');
                            } */
                            break;
                        // 平台认证
                        case 99986:
                            MessageBox('提示', res.msg + '请前往个人中心进行认证');
                            break;
                        case 99987:
                            MessageBox('提示', res.msg + '请前往个人中心添加收货地址');
                            break;
                        case 99988:
                            MessageBox('提示', res.msg);
                            break;
                        case 99990:
                            MessageBox('提示', res.msg);
                            break;
                        case 10000:
                            if (res.type === 'send_message') {
                                MessageBox('提示', '您已被禁言，请联系客服');
                                self.sendMsgValue = '';
                            }
                            if (res.type === 'get_red_packet') {
                                MessageBox('提示', '红包被抢光了！');
                                localStorage.sendInfo = '';
                            };
                            if (res.type === 'get_auction_info') {
                                // alert(JSON.stringify(res.data))
                                self.auctionInfo = res.data;
                                self.surplus_seconde = 0;
                                self.auctionInfo.status = 0;
                                self.carousel_image_type = res.data.carousel_image_type;
                                self.defaut_img = res.data.defaut_img;
                                self.videoUrl = location.protocol + '//' + location.hostname + ':' + location.port + '/#/index/auction/video/' + encodeURIComponent(self.defaut_img[0])
                                // console.log(self.videoUrl)
                                self.hasLot = false;
                            };
                            if (res.type === 'get_auction_list') {
                                self.goods_list = [];
                            };
                            if (res.type === 'send_single_message') {
                                MessageBox('提示', res.msg);
                                self.jinyanInfo.is_siliao = false;
                                self.sendMsgValue = '';
                            };
                            if (res.type === 'raise_price') {
                                self.content_list.push(res.data)
                                self.scroll_bottom(true);
                                // MessageBox('提示', '最新价格已变动，请重新出价');
                            };
                            if (res.type === 'silenced') {
                                MessageBox('提示', res.msg);
                            };
                            if (res.type === 'delete_chat') {
                                MessageBox('提示', res.msg);
                                self.jinyanPopup = false;
                            };
                            break;
                    }
                    console.log(res)
                }
            }
            function init () {
                // 加入房间
                window.websocket.send(JSON.stringify({
                    type: 'join_room',
                    room_id: 1
                }))
                window.websocket.send(JSON.stringify({
                    type: 'get_auction_time',
                    room_id: 1
                }))
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
                // 获取在线人数
                window.websocket.send(JSON.stringify({
                    type: 'count_user',
                    room_id: 1
                }));
                if (localStorage.userInfo) {
                    window.websocket.send(JSON.stringify({type: 'auth', user_id: self.personID}))
                } else {
                    // 获取房间消息历史记录
                    window.websocket.send(JSON.stringify({type: 'get_message', room_id: 1}));
                }
                /* window.websocket.send(JSON.stringify({
                    type: 'test',
                    room_id: 1,
                    data: '237472142/mm sagfydtass'
                })); */
                // 获取用户聊天列表
                window.websocket.send(JSON.stringify({type: 'get_single_user_list', page: 1, room_id: 1}));
            }
            /* if(window.websocket){
                window.websocket.close();
                window.websocket = false;
            }
            console.log(11); */
            websocket();
        },
        methods: {
            // 计算当前停留高度
            calcHeight (bool) {
                var scrollHeight = document.getElementById('chatArea').scrollHeight;
                var scrollTop = document.getElementById('chatArea').scrollTop;
                var clientHeight = document.getElementById('chatArea').clientHeight;
                console.log(scrollHeight, scrollTop, clientHeight)
                if (parseInt(scrollHeight - scrollTop - clientHeight) > 100) {
                    this.is_scroll = true;
                } else {
                    this.is_scroll = false;
                }
                this.scroll_bottom(bool);
            },
            inputFocus () {
                // if (!this.is_IOS) {
                //     console(document.body.clientHeight - document.body.scrollTop)
                //     console.log('Android')
                // }
                var str = navigator.userAgent.toLowerCase();
                var ver = str.match(/cpu iphone os (.*?) like mac os/);
                var version = parseInt(ver[1].replace(/_/g, '.'))
                if (this.is_IOS) {
                    if (version > 10) {
                        var obj = document.querySelector('.chat-wrapper')
                        setInterval(() => {
                            obj.style.position = 'absolute';
                        }, 100)
                    } else {
                        setTimeout(res => {
                            document.body.scrollTop = document.body.scrollHeight;
                            document.querySelector('.input').scrollIntoView(true);
                        }, 500);
                    }
                }
            },
            inputBlur () {
                if (this.is_IOS) {
                    document.getElementById('ios-input').focus();
                    setTimeout(res => {
                        document.getElementById('ios-input').blur();
                    }, 100)
                }
            },
            inputClick () {
                if (this.is_IOS) {
                    setTimeout(() => {
                        document.getElementById('ios-input').focus();
                        setTimeout(res => {
                            document.getElementById('chat-input').focus();
                        }, 100)
                    }, 300)
                }
            },
            dosomething (item, index) {
                myFn.ajax('get', {}, apiAddress.center.userData, (obj) => {
                    this.is_auctioneer = parseInt(obj.data.is_auctioneer);
                    for (var l = 0; l < this.content_list.length; l++) {
                        if (parseInt(this.content_list[l].uid) === parseInt(this.personID)) {
                            this.content_list[l].is_auctioneer = this.is_auctioneer;
                        };
                    };
                    if (parseInt(item.uid) !== parseInt(this.personID)) {
                        this.jinyanInfo.jinyanID = item.uid;
                        this.jinyanInfo.jinyanName = item.nickname;
                        this.jinyanInfo.is_silenced = item.is_silenced;
                        this.jinyanInfo.index = index;
                        this.jinyanPopup = true;
                        this.jinyanInfo.messageID = item.id;
                        this.jinyanInfo.types = item.type;
                    };
                    if (item.message[0] === '@') {
                        this.jinyanInfo.messageType = 2;
                    } else {
                        this.jinyanInfo.messageType = 1;
                    }
                })
            },
            jinyan () {
                var type = ''
                if (parseInt(this.jinyanInfo.is_silenced) === 0) {
                    type = 1
                } else {
                    type = 0
                }
                window.websocket.send(JSON.stringify({
                    type: 'silenced',
                    uid: this.jinyanInfo.jinyanID,
                    is_silenced: type
                }))
                this.jinyanPopup = false;
            },
            del_message () {
                window.websocket.send(JSON.stringify({
                    type: 'delete_chat',
                    chat_id: this.jinyanInfo.messageID,
                    chat_type: this.jinyanInfo.messageType
                }))
            },
            open_siliao () {
                this.jinyanInfo.is_siliao = true;
                this.sendMsgValue = '@' + this.jinyanInfo.jinyanName + '：';
                this.jinyanPopup = false;
                document.querySelector('.chat-input').focus();
            },
            siliao () {
                var data = JSON.stringify({
                    type: 'send_single_message',
                    message: this.sendMsgValue,
                    user_id: this.jinyanInfo.jinyanID
                })
                localStorage.sendInfo = data;
                window.websocket.send(data);
            },
            qunliao (value) {
                var sendData = {};
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
            },
            backspace () {
                if (this.sendMsgValue === '') {
                    this.jinyanInfo.is_siliao = false;
                }
            },
            sendMessage () {
                if (this.jinyanInfo.is_siliao) {
                    this.siliao();
                } else {
                    this.qunliao(-1);
                }
            },
            // 更换私聊方式 end
            countDown () {
                var time = myFn.getLocationTime();
                this.surplus_seconde --;
                if (parseInt(this.surplus_seconde) < 11) {
                    if (parseInt(this.surplus_seconde) >= 1) {
                        this.content_list.push({
                            type: 4,
                            is_auctioneer: 1,
                            create_time: time.replace(/\//g, '-').replace('下午', ' '),
                            message: this.surplus_seconde + 's 后无人出价，竞拍结束'
                        })
                        this.scroll_bottom(true);
                    } else if (parseInt(this.surplus_seconde) === 0) {
                        this.content_list.push({
                            type: 4,
                            is_auctioneer: 1,
                            create_time: time.replace(/\//g, '-').replace('下午', ' '),
                            message: '当前拍卖结束！敬请期待下件拍品。'
                        })
                        this.scroll_bottom(true);
                        this.popupVisible4 = false;
                        this.auctionInfo.status = 0;
                        if (parseInt(this.offerInfo.uid) === parseInt(this.personID)) {
                            MessageBox('提示', '恭喜您竞拍成功！请到订单中心进行付款')
                            this.offerInfo.uid = '';
                            this.warm_message = '恭喜您竞拍成功！请到订单中心进行付款'
                        } else if (parseInt(this.offerInfo.uid) !== 0 && parseInt(this.offerInfo.uid) !== parseInt(this.personID)) {
                            MessageBox('提示', '竞拍结束,恭喜 ' + this.offerInfo.nickname + ' 竞拍成功！敬请期待下件拍品。')
                            this.warm_message = '恭喜 ' + this.goods_list[0].nickname + ' 竞拍成功！敬请期待下件拍品。'
                        } else if (parseInt(this.offerInfo.uid) === 0) {
                            MessageBox('提示', '当前拍品已流拍！敬请期待下件拍品。')
                            this.warm_message = '当前拍品已流拍！敬请期待下件拍品。'
                        }
                        this.hasLot = false;
                        // 获取最新拍品列表
                        setTimeout(res => {
                            window.websocket.send(JSON.stringify({type: 'get_auction_list', room_id: 1}));
                        }, 1500)
                        return false;
                    };
                };
                setTimeout(() => {
                    // this.countDown();
                    if (!this.is_connect) return false;
                    window.websocket.send(JSON.stringify({type: 'get_auction_info', room_id: 1}));
                }, 1000)
            },
            // 判断是否平台认证
            getInfo () {
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    // this.is_auth = parseInt(res.data.is_auth);
                    this.is_auctioneer = parseInt(res.data.is_auctioneer);
                    // console.log(res)
                    // this.personID = parseInt(res.data.uid);
                })
            },
            // 设置提醒
            is_goAuth (type) {
                if (parseInt(type) === 1) {
                    MessageBox.confirm('该操作需认证，是否前往认证页面?').then(action => {
                        // this.$router.push({name: 'certify'});
                        location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/center/certify'
                    });
                } else if (parseInt(type) === 2) {
                    MessageBox.confirm('是否确认前往认证页面?').then(action => {
                        // this.$router.push({name: 'certify'});
                        location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/center/certify'
                    });
                }
            },
            set_remind () {
                if (!localStorage.userInfo) {
                    this.is_goAuth(1);
                    return false;
                };
                window.websocket.send(JSON.stringify({type: 'add_remind'}))
            },
            // 获取倒计时差
            getMinux () {
                var nowTime = Math.round(new Date().getTime() / 1000);
                // console.log(myFn.arrive_timer_format(this.initTime - nowTime))
                if (this.initTime - nowTime < 0) {
                    this.start_time = 0;
                    return false;
                };
                this.start_time = myFn.arrive_timer_format(this.initTime - nowTime)
            },
            // 打开私聊列表
            open_private_popup () {
                this.is_open_private = true;
                window.websocket.send(JSON.stringify({type: 'get_single_user_list', page: 1, room_id: 1}));
            },
            open_private_chat (id, type) {
                var self = this;
                var bool = false;
                for (var i = 0; i < self.private_list.length; i++) {
                    if (parseInt(id) === parseInt(self.private_list[i].uid) && parseInt(self.private_list[i].not_read_num) > 0) {
                        self.private_list[i].not_read_num = 0;
                    } else {
                        if (!bool && parseInt(self.private_list[i].not_read_num) !== 0) {
                            bool = true;
                        }
                    }
                };
                if (bool) {
                    this.is_Unread_message = true;
                } else {
                    this.is_Unread_message = false;
                }
                this.private_chat_log = [];
                if ((parseInt(this.is_auctioneer) === 1 && parseInt(type) === 2) || (parseInt(this.is_auctioneer) === 2 && parseInt(id) !== this.personID)) {
                    // alert(1)
                    this.open_private = true;
                    this.is_open_private = false;
                    this.scroll_bottom();
                    // this.is_private_message = true;
                    this.private_userID = id;
                    window.websocket.send(JSON.stringify({type: 'get_isread_single_message', user_id: id}))
                };
            },
            // 返回群聊
            back_group_chat () {
                this.open_private = false;
                this.is_open_private = false;
                // this.is_private_message = false;
                this.scroll_bottom();
            },
            // 发送聊天信息
            sendMsg (value) {
                if (!this.open_private) {
                    // 群聊发消息
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
                } else {
                    // 私聊发消息
                    var data = JSON.stringify({
                        type: 'send_single_message',
                        message: this.sendMsgValue,
                        user_id: this.private_userID
                    })
                    localStorage.sendInfo = data;
                    window.websocket.send(data);
                    // window.websocket.send(JSON.stringify({type: 'get_single_user_list', page: 1, room_id: 1}));
                }
                this.sendMsgValue = '';
            },
            // 发起发红包之前判断是否登录
            launchPackage () {
                if (!localStorage.userInfo) {
                    myFn.wxlogin();
                    return false;
                }
                if (parseInt(this.is_auctioneer) === 2 && this.open_private) {
                    MessageBox('提示', '私聊无法发送红包');
                    return false;
                };
                this.package_info.type = 1;
                this.popupVisible2 = true;
            },
            // 发红包
            sendPackage (value) {
                // alert(JSON.stringify(value))
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
                        remark: this.package_info.marsk,
                        hb_type: this.package_info.type
                    }
                }
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    // 查询余额是否大于所发红包金额
                    if (parseInt(res.data.cost) > 0 && parseInt(res.data.cost) > parseInt(this.package_info.total)) {
                        window.websocket.send(JSON.stringify(sendData));
                    } else {
                        MessageBox.confirm('当前余额不足，是否充值?').then(action => {
                            this.$router.push({name: 'recharge', params: {type: 2}});
                            // location.href = location.protocol + '//' + location.hostname + '/mobile/?/#/index/center/balance/recharge/1'
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
                if (parseInt(this.is_auth) !== 1) {
                    this.is_goAuth(1);
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
            // confirm_rob () {
            //     this.popupVisible3 = false;
            // },
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
                if (!this.hasLot) {
                    MessageBox('提示', '当前暂无拍品！');
                    return false;
                };
                this.popupVisible4 = true;
                this.currentMoney = this.auctionInfo.nowprice;
            },
            // 消息更新自动滚动到底部
            scroll_bottom (bool) {
                // console.log(bool)
                this.$nextTick(() => {
                    if (!this.is_scroll || bool) {
                        var h = document.getElementById('chatArea').scrollHeight;
                        $('#chatArea').scrollTop(h);
                    }
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
                        window.websocket.send(JSON.stringify({type: 'get_auction_list', room_id: 1}));
                        /* if (!this.goods_list.length) {
                            MessageBox('提示', '暂无数据！');
                            return false;
                        }; */
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
        filters: {
            geiSec (value) {
                return myFn.timeDifference(value);
            }
        },
        watch: {
            hasLot: function () {
                var path = this.$route.fullPath;
                var timer = setInterval(() => {
                    if (this.hasLot || this.$route.fullPath !== path) {
                        clearInterval(timer);
                        return false;
                    };
                    if (this.is_connect) {
                        window.websocket.send(JSON.stringify({type: 'get_auction_info', room_id: 1}));
                    }
                }, 1000)
                /* var self = this;
                var shareImg = ''
                if (self.hasLot) {
                    shareImg = location.protocol + '//' + location.hostname + self.auctionInfo.pictures;
                } else {
                    shareImg = location.protocol + '//' + location.hostname + self.auctionInfo.share_img;
                }
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: '臻宝拍卖',
                    link: location.protocol + '//' + location.hostname + '/mobile/#/index/auction/room/' + self.personID,
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
                    link: location.protocol + '//' + location.hostname + '/mobile/#/index/auction/room/' + self.personID,
                    imgUrl: shareImg,
                    desc: '珠宝拍卖火热进行中',
                    type: 'link',
                    dataUrl: '',
                    success: function () {
                        self.popupVisible = false;
                        console.log(shareImg)
                    },
                    cancel: function () {
                        self.popupVisible = false;
                    }
                }); */
            },
            surplus_seconde: function () {
                if (parseInt(this.surplus_seconde) === 0) {
                    if (parseInt(localStorage.surplus_seconde) > 2) {
                        setTimeout(res => {
                            window.websocket.send(JSON.stringify({type: 'get_auction_list', room_id: 1}));
                        }, 500)
                        setTimeout(res => {
                            console.log(this.goods_list[0])
                            if (parseInt(this.goods_list[0].uid) !== 0) {
                                MessageBox('提示', '当前拍品被提前结束！恭喜 ' + this.goods_list[0].nickname + ' 竞拍成功！敬请期待下件拍品。')
                                this.warm_message = '恭喜 ' + this.goods_list[0].nickname + ' 竞拍成功！敬请期待下件拍品。'
                            } else {
                                MessageBox('提示', '当前拍品被提前结束！请期待下件拍品。')
                                this.warm_message = '当前拍品被提前结束！请期待下件拍品。'
                            }
                            localStorage.surplus_seconde = 0;
                        }, 1000)
                    };
                    this.popupVisible4 = false;
                };
                localStorage.surplus_seconde = this.surplus_seconde;
                // console.log(localStorage.surplus_seconde)
            }
        },
        components: {
            offer
        }
    }
</script>
<style>
    .room + .footerNav {
        height: 0;
        border: 0;
    }
    /* 更换聊天方式 */
    .room .no-say {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background: #000;
        z-index: 10;
    }
    .room .operation {
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
        background-color: #fff;
        width: 85%;
        border-radius: 3px;
        font-size: 16px;
        -webkit-user-select: none;
        overflow: hidden;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transition: .2s;
        transition: .2s;
        z-index: 11;
        text-align: center;
    }
    .room .operation_cell {
        line-height: 35px;
    }
    .room .operation_cell:nth-child(1){
        padding-top: 10px;
        color: #f00;
    }
    .room .operation_cell:nth-child(3){
        padding-bottom: 15px;
    }
    .mint-msgbox-btns {
        height: 50px;
    }
    .mint-msgbox-btn {
        font-size: 16px;
    }
    .mint-msgbox-cancel {
        border-top: 1px solid #ddd;
        line-height: 50px;
        height: 50px;
    }
    .room .online {
        position: fixed;
        top: 0;
        right: 0;
        padding: 5px 10px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        background: rgba(0,0,0,0.5);
        z-index: 12;
    }
    /*************/
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
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
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
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .room .mint-cell-wrapper {
        background: none;
    }
    .room .mint-cell {
        background: none;
        margin-bottom: 10px;
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
    .room .mint-popup.private-wrapper {
        background: #fff;
        padding-top: 10px;
        padding-left: calc(50% + 10px);
        left: -50%;
        z-index: 10000;
    }
    .room .mint-swipe-items-wrap > div {
        text-align: center;
        background-color: #000;
    }
    .room .mint-swipe img {
        width: auto;
        height: 100%;
    }
</style>
<style scoped>
    .main-wrapper {
        position: relative;
        height: 100%;
    }
    .video {
        width: 100%;
        height: 180px;
        object-position: center top;
        /* object-fit: fill; */
        background-color: #000;
    }
    .back-public {
        position: absolute;
        bottom: 20px;
        width: calc(50% - 20px);
        height: 29px;
        border-radius: 3px;
        line-height: 29px;
        background: #585b67;
        color: #fff;
        font-size: 14px;
    }
    .private-title {
        text-align: left;
        font-size: 14px;
        color: #333;
        padding: 5px 0;
        border-radius: 3px;
    }
    .private-list {
        max-height: 87%;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .private-list > div {
        padding: 10px 0;
        text-align: left;
        border-bottom: 1px solid #d4d4d4;
        position: relative;
    }
    .private-list > div .new-private-message {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 50%;
        text-align: center;
        background-color: red;
        color: #fff;
        font-size: 12px;
    }
    .private-list > div img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 5px;
        vertical-align: middle;
    }
    .private-list > div span {
        font-size: 15px;
        color: #585b67;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        max-width: calc(100% - 50px);
        text-overflow: ellipsis;
        vertical-align: middle;
    }
    .new-message {
        position: relative;
    }
    .new-message:before {
        content: '';
        position: absolute;
        top: 6px;
        left: 28px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: red;
    }
    .isVIP {
        position: relative;
    }
    .isVIP:before {
        content: '';
        position: absolute;
        top: -36px;
        left: -35%;
        width: 170%;
        padding-bottom: 100%;
        background-image: url('../../assets/icon/huangguan.png');
        background-size: 55%;
        background-position: center bottom;
        background-repeat: no-repeat;
        z-index: 0;
    }
    .isVIP:after {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        border: 2px solid #E7A219;
        border-radius: 50%;
        /* box-sizing: border-box; */
        left: 50%;
        top: 50%;
        margin-top: -22px;
        margin-left: -22px;
        z-index: -1;
    }
    .room {
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        background: #fff;
    }
    .chat {
        position: relative;
        width: 100%;
        /* height: 100%; */
        /* height: calc(100% - 180px);
        height: -moz-calc(100% - 180px);
        height: -webkit-calc(100% - 180px); */
        box-sizing: border-box;
        background: #fff;
        /* padding-top: 180px; */
        /* top: 180px; */
        z-index: 0;
    }
    .countdown {
        position: absolute;
        /* top: 180px; */
        left: 0;
        width: 100%;
        height: 48px;
        color: #fff;
        line-height: 45px;
        padding-left: 10px;
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
        width: 50%;
        font-size: 14px;
        box-sizing: border-box;
    }
    @media screen and (max-width: 320px) {
        .countdown .isAuction > div {
            font-size: 12px;
        }
    }
    .line-height {
        line-height: 1.5;
    }
    .countdown .isAuction > div:last-child {
        text-align: right;
        padding-right: 10px;
    }
    .countdown .isAuction p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .chat-wrapper {
        position: relative;
        /* bottom: 0; */
        left: 0;
        width: 100%;
        height: 48px;
        line-height: 48px;
        box-sizing: border-box;
        z-index: 10;
        background: #fff;
        box-shadow: 0 -1px 1px #eee;
    }
    .chat-wrapper .redpacIcon.offer-btn {
        display: inline-block;
        width: 70px;
        font-size: 16px;
        line-height: 40px;
        padding-left: 10px;
        color: #AD9355;
    }
    .chat-wrapper .redpacIcon.offer-btn span,
    .chat-wrapper .redpacIcon.offer-btn img {
        vertical-align: middle;
    }
    .chat-wrapper .redpacIcon.offer-btn img {
        width: 20px;
    }
    .chat-wrapper > div.input {
        display: inline-block;
        width: calc(100% - 130px);
    }
    .chat-wrapper > .input.input-offer {
        /* left: 80px; */
        width: calc(100% - 170px)
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
        margin-top: 7px;
        box-sizing: border-box;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        /* margin-left: 10px; */
    }
    #ios-input {
        position: absolute;
        z-index: -1;
        opacity: 0;
        top: 0px;
        left: -90px;
        width: 70px;
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
        margin-top: -4px;
        vertical-align: middle;
    }
    .chat-wrapper .redpacIcon.offerIcon {
        width: 33px;
        height: 33px;
        margin-left: 7px;
    }
    .chat-content {
        /* position: absolute;
        left: 0;
        top: 180px;
        height: calc(100% - 240px); */
        position: relative;
        width: 100%;
        /* height: 100%; */
        box-sizing: border-box;
        padding: 10px 10px 0;
        z-index: 0;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        /* padding-bottom: 48px; */
        height: 100%;
    }
    .sidebar {
        border-radius: 5px 0 0 5px;
        position: fixed;
        right: 0;
        top: 65%;
        margin-top: -105px;
        padding: 5px 0;
        background: #AD9355;
    }
    /* .sidebar.sidebar_none {
        top: 45%;
    } */
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
        width: 40px;
        height: 40px;
        margin-right: 10px;
        box-sizing: border-box;
        position: relative;
    }
    .message-wrapper .head-wrapper > p {
        position: absolute;
        width: 100%;
        bottom: -20px;
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
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
        top: 48px;
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
        -webkit-overflow-scrolling: touch;
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
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
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
    .goods-star-parseFloat {
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
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        border-radius: 5px;
        background: #fff;
    }
    .goods-list-wrapper {
        background: #fff;
        padding: 20px 25px 20px 15px;
        font-size: 16px;
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
        /* height: 100px; */
        float: left;
    }
    .goods-item > div:last-child {
        padding-left: 110px;
        /* height: 100px; */
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
        font-size: 14px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .goods-item .isDeal > p:first-child {
        color: #dccfb2;
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
    .redPacketType {
        color: #999;
        font-size: 14px;
        margin-bottom: 15px;
        user-select: none;
    }
    .redPacketType span {
        color: #EA5F39;
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
    .package-unopen .pinshouqi {
        width: 35px;
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
        font-size: 15px;
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
    /* 设置提醒 */
    .set_clock {
        float: right;
        margin-top: -3px;
        margin-right: 5px;
    }
    .set_clock span {
        font-size: 12px;
        color: #fff;
        vertical-align: middle;
    }
    .set_clock img {
        width: 20px;
        vertical-align: middle;
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