<template>
    <div class="goodsDetails">
        <div class="banner">
            <mt-swipe :auto="4000">
                <mt-swipe-item><img src="../../assets/banner/banner.png"></mt-swipe-item>
                <mt-swipe-item><img src="../../assets/banner/banner.png"></mt-swipe-item>
                <mt-swipe-item><img src="../../assets/banner/banner.png"></mt-swipe-item>
            </mt-swipe>
        </div>
        <div class="auction-info">
            <p class="goods-name">翡翠翡翠翡翠翡翠翡翠</p>
            <p class="price">当前价<span>￥1000</span><span>市场价￥5000</span></p>
            <div class="flex" style="margin-top: 10px">
                <div>起拍价<span>￥100</span></div>
                <div>加价幅度<span>￥100</span></div>
            </div>
            <p class="cell">开拍时间<span>11月09日 18:00</span></p>
            <p class="cell">结束时间<span>11月09日 18:30</span></p>
        </div>
        <div class="label">拍卖参数</div>
        <div class="goods-info">
            <div class="flex">
                <div class="vertical"><span class="justify">尺寸<i></i></span>：<span>6.33*4.64mm</span></div>
                <div>主石重量：<span>1.01ct</span></div>
            </div>
            <div class="flex">
                <div class="vertical"><span class="justify">形状<i></i></span>：<span>圆形</span></div>
                <div>重量：<span>2.7597g</span></div>
            </div>
            <p class="vertical"><span class="justify">颜色<i></i></span>：绿色</p>
            <p class="vertical"><span class="justify">证书<i></i></span>：国检</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'goodsDetails',
        data () {
            return {
            }
        },
        methods: {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .banner {
        width: 100%;
        font-size: 0;
    }
    .banner img {
        width: 100%;
    }
    .auction-info {
        padding: 10px;
        padding-bottom: 0;
        font-size: 14px;
        background: #fff;
        margin-bottom: 7px;
        border-bottom: 1px solid #d9d9d9;
    }
    .goods-name {
        font-size: 18px;
        margin-bottom: 10px;
    }
    .price {
        font-size: 14px;
        padding-bottom: 10px;
        border-bottom: 1px solid #d9d9d9;
    }
    .price span:first-child {
        font-size: 20px;
        color: red;
    }
    .price span:last-child {
        float: right;
        margin-top: 5px;
    }
    .flex {
        display: flex;
    }
    .flex > div {
        flex: 1;
    }
    .flex > div:last-child {
        text-align: right;
    }
    .cell {
        margin: 10px 0;
    }
    .label {
        padding: 10px;
        background: #fff;
        border-top: 1px solid #d9d9d9;
    }
    .goods-info {
        padding: 10px;
        background: #fff;
        margin-bottom: 7px;
        font-size: 14px;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
    }
    .goods-info > div,
    .goods-info > p {
        margin: 5px 0;
    }
    .justify {
        width: 40px;
        height: 20px;
        text-align: justify;
        display: inline-block;
    }
    .justify i {
        width: 100%;
        display: inline-block;
    }
    .vertical span {
        vertical-align: middle;
    }
</style>
