<template>
    <div class="homeDetails">
        <img class="shopBanner"  :src="data.pictures" />
        <div class="attribute">
            <div class="attribute_title">
                <p v-html="data.title"></p>
                <div class="money">
                    <span>市场价格:</span>
                    <span>￥</span>
                    <span v-html="data.price"></span>
                    <div class="support" @click="toggleSupport()">
                        <span :class="data.is_support == 1 ?'is_support':''" class="iconfont icon-dianzan"></span>
                        <span v-html="data.support_num"></span>
                    </div>
                </div>
            </div>
            <div class="attribute_details">
                <span v-for="item in data.goods_attr">{{item.attr_name}}：{{item.attr_value}}</span>
            </div>
        </div>
        <div class="box">
            <p class="title">拍品展示</p>
            <div class="lot" v-html="data.content"></div>
        </div>
        <div class="box">
            <p class="title">证书展示</p>
            <div class="certificate">
                <img v-for="item in data.cert_img" class="shopBanner" :src="item"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'homeDetails',
        data () {
            return {
                id: '',
                data: {}
            };
        },
        mounted () {
            this.id = this.$route.params.id;
            this.getdetails();
        },
        methods: {
            getdetails () {
                myFn.ajax('get', {id: this.id}, apiAddress.home.goodsDetails, (res) => {
                    this.data = res.data;
                })
            },
            toggleSupport () {
                var isSupport = '';
                this.data.is_support === 1 ? isSupport = 0 : isSupport = 1;
                myFn.ajax('post', {gid: this.id, status: isSupport}, apiAddress.home.support, (res) => {
                    this.data.support_num = res.data.new_support;
                    this.data.is_support === 1 ? this.data.is_support = 0 : this.data.is_support = 1;
                })
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .homeDetails .lot img {
        width: 100%;
    }
</style>
<style scoped>
    .homeDetails {
        /* padding-bottom: 48px; */
    }
    .shopBanner {
        width: 100%;
        display: block;
    }
    .attribute {
        background: #fff;
        padding: 10px 10px;
        line-height: 30px;
        /* position: relative; */
    }
    .attribute_title {
        padding: 0px 10px;
        color: #000;
        font-size: 18px;
    }
    .attribute_title .money {
        color: #B4AF92;
        font-size: 14px;
        margin-top: 7px;
        height: 30px;
        position: relative;
    }
    .attribute_title .money > span {
        display: inline-block;
        position: absolute;
        font-size: 14px;
        color: #a3a3a3;
    }
    .attribute_title .money span:nth-child(2) {
        left: 85px;
        top: 3px;
        color: #ad9355;
    }
    .attribute_title .money span:nth-child(3) {
        left: 100px;
        font-size: 24px;
        color: #ad9355;
    }
    .attribute_details {
        color: #B4AF92;
        border-top: 1px #ccc solid;
        margin-top: 10px;
        padding: 10px 10px 0;
        font-size: 0px;
    }
    .attribute_details span {
        min-width: 50%;
        display: inline-block;
        font-size: 14px;
    }
    /* .attribute_details span:nth-child(even) {
        text-align: right;
    } */
    .box {
        background: #fff;
        margin-top: 7px;
    }
    .lot {
        color: #4D4E53;
    }
    .title {
        color: #4D4E53;
        font-size: 23px;
        margin-bottom: 10px;
        padding: 10px 15px;
        padding-top: 20px;
    }
    .certificate, .lot{
        padding: 0px 15px;
        padding-bottom: 20px;
    }
    .certificate img {
        margin-bottom: 10px;
    }
    .support {
        position: absolute;
        right: 0px;
        top: 5px;
        text-align: center;
        font-size: 14px;
        line-height: 15px;
        color: #5F626E;
    }
    .support img {
        width: 23px;
        height: 23px;
        vertical-align: text-bottom;
    }
    .is_support {
        color: #D63498;
    }
</style>
