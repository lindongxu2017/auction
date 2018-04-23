<template>
    <div class="state">
        <img :src="imgUrl" />
        <p v-html="text"></p>
        <mt-button v-if="button_isShow" @click="go_back" type="primary" size="large">确认</mt-button>
    </div>
</template>

<script>
    export default {
        name: 'state',
        data () {
            return {
                imgUrl: require('../assets/icon/state/success.png'),
                text: '操作成功',
                button_isShow: true
            }
        },
        beforeRouteUpdate (to, from, next) {
            next();
            this.get_query();
        },
        mounted () {
            this.get_query();
        },
        methods: {
            get_query: function () {
                var type = this.$route.params.type;
                if (type !== undefined) {
                    this.set_state(type);
                }
            },
            set_state: function (type) {
                var url = '';
                var text = '';
                var isShow = true;
                switch (parseInt(type)) {
                    case 1:
                        url = require('../assets/icon/state/success.png');
                        text = '操作成功';
                        break;
                    case 2:
                        url = require('../assets/icon/state/fail.png');
                        text = '失败';
                        break;
                    case 3:
                        url = require('../assets/icon/state/examine.png');
                        text = '审核中';
                        isShow = false;
                        break;
                    case 4:
                    default:
                        url = require('../assets/icon/state/404.png');
                        text = '页面丢了';
                        break;
                }
                this.imgUrl = url;
                this.text = text;
                this.button_isShow = isShow;
            },
            go_back: function () {
                var url = this.$route.fullPath
                this.$router.go(-1);
                var self = this;
                setTimeout(function () {
                    if (url === self.$route.fullPath) {
                        self.$router.push('/index');
                    }
                }, 500);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .state {
        width: 100%;
        height: 100%;
        background: #fff;
        position: absolute;
        text-align: center;
    }
    img {
        width: 50%;
        margin: auto;
        margin-top: 18%;
    }
    p {
        margin-top: 10%;
        font-size: 1.4rem;
        color: #bedae7;
        letter-spacing:1px;
    }
    button {
        width: 90%;
        margin:auto;
        margin-top: 49%
    }
</style>
