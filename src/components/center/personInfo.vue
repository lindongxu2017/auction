<template>
    <div class="personInfo">
        <mt-cell title="头像" class="headImg">
            <img :src="userInfo.wximg || '../../assets/icon/nav/index.png'">
        </mt-cell>
        <mt-cell title="手机号码" to="/index/center/personInfo/modifyPhoneNumber" is-link>
            <span v-html="userInfo.mobile"></span>
        </mt-cell>
    </div>
</template>

<script>
    export default {
        name: 'personInfo',
        data () {
            return {
                userInfo: {}
            }
        },
        mounted () {
            if (localStorage.userInfo) {
                this.userInfo = JSON.parse(localStorage.userInfo);
            };
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .personInfo .mint-cell-wrapper {
        background-origin: border-box;
        background-size: 94% 1px;
        background-position-x: 40%;
        background-position-y: 0%;
        padding: 0 15px;
    }
    .personInfo .mint-cell:first-child .mint-cell-wrapper {
        background: none;
    }
    .personInfo .headImg img {
        width: 40px;
        border-radius: 50%;
    }
    .personInfo .mint-cell:last-child {
        background-size: 94% 1px;
    }
    .personInfo .mint-cell {
        min-height: 55px;
    }
    .personInfo .mint-cell-value {
        color: #989DB3
    }
</style>