<template>
    <div class="customer">
        <img :src="imgUrl">
    </div>
</template>

<script>
    export default {
        data () {
            return {
                imgUrl: ''
            }
        },
        mounted () {
            this.getTelephone();
        },
        methods: {
            getTelephone () {
                myFn.ajax('get', {}, apiAddress.center.telephone, (res) => {
                    this.imgUrl = res.data.customer;
                })
            }
        }
    }
</script>

<style scoped>
    .customer {
        position: absolute;
        width: 100%;
        height: 100%;
        font-size: 0;
        background: #fff;
    }
    .customer img {
        width: 100%;
    }
</style>