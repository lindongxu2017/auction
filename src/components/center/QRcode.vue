<template>
    <div class="QRcode">
        <img :src="imgUrl">
    </div>
</template>

<script>
    export default {
        name: 'QRcode',
        data () {
            return {
                id: '',
                url: '',
                imgUrl: ''
            }
        },
        mounted () {
            this.id = this.$route.params.uid;
            this.url = location.protocol + '//' + location.hostname + ':' + location.port + '/mobile/#/index/center/blankPage/' + this.id;
            this.getQRcode();
        },
        methods: {
            getQRcode () {
                myFn.ajax('post', {url: this.url}, apiAddress.admin.getQRcode, (res) => {
                    this.imgUrl = res.data.acode;
                })
            }
        }
    }
</script>
<style scoped>
    .QRcode {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        text-align: center;
        font-size: 0;
    }
    .QRcode img {
        width: 100%;
    }
</style>