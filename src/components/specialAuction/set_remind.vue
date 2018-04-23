<template>
    <div class="setRemind">
        <!-- <mt-checklist title="设置拍卖提醒" align="right" v-model="value" :options="options"></mt-checklist> -->
        <mt-radio title="设置拍卖提醒" align="right" v-model="type" :options="options" @change="select">
</mt-radio>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                id: '',
                type: '',
                value: [],
                options: [
                    {
                        label: '1小时提醒一次',
                        value: '1'
                    },
                    {
                        label: '有人高于我出价提醒我 ',
                        value: '2'
                    },
                    {
                        label: '结束前半个小时提醒我',
                        value: '3'
                    }
                ]
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            this.getdetails();
        },
        methods: {
            getdetails () {
                myFn.ajax('get', {pid: this.id, type: 1}, apiAddress.specialAuction.roomShopDetails, (res) => {
                    this.type = res.data.bidprice_remind_type;
                })
            },
            set () {
                myFn.ajax('post', {type: this.type, pid: this.id}, apiAddress.specialAuction.remindType, (res) => {
                    this.$router.go(-1);
                })
            },
            select (value) {
                this.type = value;
                this.set();
            }
        }
    }
</script>

<style>
    .setRemind .mint-checklist-title,
    .setRemind .mint-radiolist-title {
        /* display: none; */
        margin: 0;
        padding: 15px;
        font-size: 15px;
        border-bottom: 1px solid #d9d9d9;
    }
    .setRemind .mint-cell-wrapper {
        background-position: bottom left;
        background-origin: border-box;
    }
    .setRemind .mint-checklist-label,
    .setRemind .mint-radiolist-label {
        padding: 0;
    }
    .setRemind .mint-checkbox-label,
    .setRemind .mint-radiolist-label {
        font-size: 15px;
    }
    .setRemind .mint-checkbox-core::after {
        top: 4px;
        left: 7px;
    }
</style>
<style scoped>

</style>