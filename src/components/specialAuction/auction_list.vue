<template>
    <div class="specialAuctionList">
        <mt-navbar v-model="selectedTab">
            <mt-tab-item id="1" @click.native="getlist(1)">正在拍卖</mt-tab-item>
            <mt-tab-item id="2" @click.native="getlist(1)">已结束拍卖</mt-tab-item>
        </mt-navbar>

        <!-- tab-container -->
        <mt-tab-container v-model="selectedTab">
            <mt-tab-container-item id="1">
                <ul>
                    <li v-for="item in auctioning" @click="go_details(1, item.pid)">
                        <div class="visibility">
                            <img :src="item.pictures" />
                            <p class="title" v-html="item.pname"></p>
                        </div>
                        <img :src="item.pictures" />
                        <p class="current_money">市场价 <span v-html="item.price"></span></p>
                        <p class="offer">当前价 <span v-html="item.nowprice"></span></p>
                        <p class="time">预计 <span v-html="item.endtime"></span> 结束</p>
                        <!-- <div class="instantAuction">
                            <img src="../../assets/icon/nav/index.png" />
                            <p>立即拍</p>
                        </div> -->
                        <button class="instantAuction">立即拍</button>
                    </li>
                    <div class="noMore" v-if="auctioning.length == 0">当前房间暂无拍品</div>
                </ul>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <ul>
                    <li v-for="(item,index) in auctioned" @click="go_details(2, item.pid)">
                        <div class="visibility">
                            <img :src="item.pictures" />
                            <p class="title" v-html="item.pname"></p>
                        </div>
                        <img :src="item.pictures" />
                        <p class="current_money">
                            <span v-html="'市场价 ' + item.price"></span>
                        </p>
                        <p class="offer out"><span v-html="item.uid == 0?'未成交':'成交价格 ' + item.nowprice"></span></p>
                        <!-- <div class="instantAuction">
                            <p>再来</p>
                            <p>一次</p>
                        </div> -->
                        <button class="instantAuction" :class="[item.isagain == 0?'':'isAgain']" @click.stop="again(item.pid,index,item.isagain)">再来一次</button>
                    </li>
                </ul>
                <div class="noMore" v-if="auctioned.length == 0">当前房间暂无拍品</div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>
<script>
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'specialAuctionList',
        data () {
            return {
                selectedTab: '1',
                id: '',
                auctioning: [],
                auctioned: []
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            this.getlist();
        },
        methods: {
            getlist (page) {
                var data = {
                    page: page,
                    status: this.selectedTab,
                    room_id: this.id
                }
                myFn.ajax('get', data, apiAddress.specialAuction.roomShopList, (res) => {
                    if (res.data.data) {
                        for (var i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].endtime = res.data.data[i].endtime.replace(/-/g, '/');
                            var time = new Date(res.data.data[i].endtime)
                            var hour = time.getHours();
                            var min = time.getMinutes();
                            if (min.toString().length === 1) {
                                min = '0' + min;
                            };
                            res.data.data[i].endtime = hour + ':' + min;
                            // console.log(typeof res.data.data[i].endtime);
                        };
                    };
                    if (parseInt(data.status) === 1) {
                        this.auctioning = res.data.data;
                        if (!res.data.data) this.auctioning = [];
                    } else {
                        this.auctioned = res.data.data;
                        if (!res.data.data) this.auctioned = [];
                    }
                })
            },
            again (id, index, isagain) {
                if (parseInt(isagain) !== 0) {
                    MessageBox('提示', '已经点击过再来一次！');
                    return false;
                };
                myFn.ajax('post', {pid: id}, apiAddress.specialAuction.again, (res) => {
                    this.auctioned[index].isagain = 1;
                })
            },
            go_details (type, id) {
                this.$router.push({name: 'specialAuctionDetails', params: {id: id, roomType: type}})
            }
        }
    }
</script>
<style>
    .specialAuctionList .mint-tab-item-label {
        font-size: 14px;
    }
    .specialAuctionList .mint-navbar .mint-tab-item.is-selected {
        border: none;
    }
    .specialAuctionList .mint-navbar .mint-tab-item {
        padding: 15px 0;
    }
    .mint-navbar .mint-tab-item.is-selected {
        color: #ad9355;
    }
    .specialAuctionList .mint-navbar .mint-tab-item.is-selected {
        border-bottom: 1px solid #ad9355;
        margin-bottom: 0;
    }
</style>
<style scoped>
    ul {
        font-size: 0px;
        /*padding-left: -0.5%;*/
        padding: 5px 0;
    }
    ul li {
        width: calc(50% - 15px);
        font-size: 14px;
        background: #fff;
        display: inline-block;
        box-sizing: border-box;
        position: relative;
        margin: 5px 10px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        font-size: 0;
        /*box-sizing: content-box;*/
    }
    ul li:nth-child(odd) {
        margin-right: 5px;
    }
    ul li:nth-child(even) {
        margin-left: 5px;
    }
    ul li img {
        width: 100%;
        /*height: 100px;*/
        display: block;
    }
    .instantAuction.isAgain {
        background: #ededed;
        color: #fff;
    }
    .current_money, .offer, .time {
        margin-top: 5px;
        padding-left: 10px;
        font-size: 12.5px;
    }
    .offer {
        color: #585b67;
    }
    .current_money {
        color: #1b1a1d;
        margin-top: 7px;
        font-size: 14px;
    }
    .time {
        color: #E13131;
    }
    .title {
        position: absolute;
        width: 100%;
        background: rgba(0,0,0,0.5);
        bottom: 0;
        padding: 5px 10px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #fff;
        margin: 0;
        box-sizing: border-box;
    }
    .time, .out {
        margin-bottom: 12px;
    }
    /*.instantAuction {
        position: absolute;
        right: -4px;
        bottom: 7px;
        width: 55px;
        font-size: 10px;
        text-align: center;
        border-left: 1px #ccc solid;
    }
    .instantAuction img {
        width: 25px;
        height: 25px;
        display: inline;
    }*/
    .instantAuction {
        background: #1b1a1d;
        border: none;
        padding: 5px 15%;
        margin: 13px auto;
        display: block;
        border-radius: 5px;
        font-size: 12px;
        color: #fff;
        outline: none;
    }
    .noMore {
        color: #999;
        font-size: 14px;
        letter-spacing: 1px;
        text-align: center;
        margin-top: 150px;
    }
    .visibility {
        position: absolute;
        top: 0;
        left: 0;
    }
    .visibility img {
        width: 100%;
        visibility: hidden;
    }
</style>