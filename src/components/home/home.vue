<template>
    <div class="home">
        <mt-swipe :auto="4000" class="swipe">
            <mt-swipe-item v-for="(item,key) in imglist" :key="item.id">
                <img :src="item.code"/>
            </mt-swipe-item>
        </mt-swipe>
        <ul class="classification">
            <li v-for="item in classifylist" :class="[item.cid==pageDate.cid?'active':'']" v-html="item.name" @click="toggleClass(item.cid)" ></li>
        </ul>
        <ul class="scroll-ul scroll-ul-bottom" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
            <!-- @click="item.id" -->
            <li v-for="(item,index) in list" @click="go_details(item.id)">
                <div class="content">
                    <p class="title" v-html="item.title"></p>
                    <p class="weight">重量: 100kg</p>
                    <p class="money">￥<span v-html="item.price">10000</span></p>
                </div>
                <img :src="item.pictures">
                <div class="support" @click.stop="toggleSupport(item.id, item.is_support, index)" :class="{'yesSupport': item.is_support}">
                    <span :class="item.is_support == 1 ?'is_support':''" class="iconfont icon-dianzan"></span>
                    <!-- <img :src="item.is_support == 1 ? require('../../assets/icon/supportYes.png') : require('../../assets/icon/supportNo.png')" /> -->
                    <p v-if="item.is_support == 0">支持拍卖</p>
                    <p v-else>取消支持</p>
                    <p v-html="item.support_num">50000</p>
                </div>
            </li>
            <li class="scroll-ul-loading" v-if="list.length<total">
                <img src="../../assets/icon/loading.gif" />
            </li>
            <li class="noMore" v-if="list.length>=total">暂无更多数据...</li>
        </ul>

    </div>
</template>

<script>
    export default {
        name: 'home',
        data () {
            return {
                list: [],
                loading: false,
                // 轮播图列表
                imglist: [],
                // 分类列表
                classifylist: [],
                // 分页传值数据
                pageDate: {
                    // 分类ID
                    cid: '',
                    page: 0
                },
                total: 1
            };
        },
        mounted () {
            // localStorage.userInfo = '';
            this.getCarouselImg();
            this.getClassList();
            if (!localStorage.userInfo && myFn.GetQueryString('code') !== '') {
                myFn.wxlogin();
                return false;
            }
        },
        methods: {
            getCarouselImg () {
                myFn.ajax('get', {}, apiAddress.home.carouselImg, (res) => {
                    this.imglist = res.data;
                })
            },
            getClassList () {
                myFn.ajax('get', {}, apiAddress.home.goodsClassify, (res) => {
                    this.classifylist = res.data;
                    this.pageDate.cid = res.data[0].cid;
                })
            },
            getGoodsList () {
                myFn.ajax('get', this.pageDate, apiAddress.home.goodslist, (res) => {
                    this.list = this.list.concat(res.data.data);
                    this.total = res.data.total;
                    this.loading = false;
                })
            },
            toggleSupport (id, isSupport, index) {
                isSupport = isSupport === 0 ? 1 : 0;
                myFn.ajax('post', {gid: id, status: isSupport}, apiAddress.home.support, (res) => {
                    this.list[index].is_support = this.list[index].is_support === 0 ? 1 : 0;
                    this.list[index].support_num = res.data.new_support;
                })
            },
            loadMore () {
                if (this.list.length >= this.total) return;
                this.loading = true;
                setTimeout(() => {
                    this.pageDate.page ++;
                    this.getGoodsList();
                }, 1000);
            },
            go_details (id) {
                this.$router.push({name: 'homeDetails', params: {id: id}});
            },
            toggleClass (id) {
                this.list = [];
                this.total = 1;
                this.pageDate.page = 1;
                this.pageDate.cid = id;
                this.getGoodsList();
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .home .mint-swipe-indicator {
        opacity: 0.5;
    }
</style>
<style scoped>
    .scroll-ul li {
        height: auto;
        padding: 15px;
        position: relative;
        /* height: 100px; */
        font-size: 0;
        letter-spacing: 1px;
    }
    .scroll-ul .scroll-ul-loading {
        height: auto;
        padding: 0;
    }
    .scroll-ul .scroll-ul-loading img {
        width: 25px;
        height: 25px;
        position: static;
    }
    .classification {
        background: #fff;
        word-spacing: -10px;
        overflow: auto;
        white-space: nowrap;
        box-sizing: border-box;
    }
    .classification li {
        /* width: 16%; */
        display: inline-block;
        width: 11%;
        padding: 10px 0;
        padding-top: 20px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 2%;
        font-size: 13px;
        color: #95959A;
    }
    .classification li.active {
        color: #ad9355;
        /*border-bottom: 2px #ccc solid;*/
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }
    /* .scroll-ul li {
        height: 110px;
    } */
    .scroll-ul li > img {
        /* position: absolute; */
        height: 77px;
        width: 77px;
    }
    .content {
        float: right;
        box-sizing: border-box;
        width: calc(100% - 95px);
    }
    .content .title {
        height: 25px;
        font-size: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        /* line-height: 1.5; */
    }
    .content .weight {
        margin-top: 6px;
        font-size: 14px;
        color: #A3A8B8;
    }
    .money {
        margin-top: 6px;
        color: #ad9355;
        font-size: 16px;
        /* position: absolute; */
        /* bottom: 10px;
        left: 130px; */
    }
    .support {
        position: absolute;
        right: 10px;
        top: 65%;
        margin-top: -34px;
        text-align: center;
        font-size: 12px;
        line-height: 17px;
        color: #848484;
    }
    .support img {
        width: 30px;
        height: 30px;
    }
    .noMore {
        background: none;
        height: 25px!important;
        text-align: center;
        color: #999;
    }
    .yesSupport {
        color: #D01889;
    }
    .is_support {
        color: #D63498;
    }
</style>
