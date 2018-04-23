<template>
    <div class="specialAuction">
        <ul>
            <li v-for="item in roomList">
                <!-- <mt-swipe :auto="4000" class="swipe"> -->
                    <!-- <mt-swipe-item v-for="(item,key) in imglist" :key="item.id"> -->
<!--                         <img src="../../assets/banner/banner.png" />
                    </mt-swipe-item>
                </mt-swipe> -->
                <mt-swipe :auto="6000" class="swipe" :show-indicators="false">
                    <mt-swipe-item v-for="(img,key) in item.carousel_image" :key="key">
                        <img :src="img" />
                    </mt-swipe-item>
                </mt-swipe>
                <div class="attribute" @click="go_list(item.id)">
                    <!-- <img :src="item.image" /> -->
                    <p class="title" v-html="item.name">宝石</p>
                    <p class="title">进入会场 ></p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'specialAuction',
        data () {
            return {
                roomList: []
            }
        },
        mounted () {
            this.get_data();
        },
        methods: {
            get_data () {
                myFn.ajax('get', {}, apiAddress.specialAuction.roomList, (res) => {
                    this.roomList = res.data.data;
                });
            },
            go_list (id) {
                this.$router.push({name: 'specialAuctionList', params: {id: id}});
            }
        }
    }
</script>
<style>
    .specialAuction .mint-swipe {
        height: 120px;
        width: 70%;
    }
</style>
<style scoped>
    .specialAuction ul {
        padding-bottom: 55px;
    }
    li {
        font-size: 0px;
        margin-bottom: 7px;
        background: #fff;
        position: relative;
    }
    .attribute {
        height: 65px;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 70%;
        right: 0;
        margin: auto;
        font-size: 15px;
        text-align: center;
    }
    .attribute img {
        width: 40px;
    }
    .attribute p {
        margin: 10px;
        font-size: 15px;
        color: #585b67;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>