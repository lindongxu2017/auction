<template>
    <div class="cashlog" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <div class="table-head">
            <div>时间</div>
            <div>提现金额</div>
            <div>状态</div>
        </div>
        <div class="table-cell" v-for="item in list">
            <div v-html="item.create_time">12-25</div>
            <div v-html="item.money + '.00'">￥300.00</div>
            <div v-if="item.status == 1" :class="item.status == 1 ? 'success' : 'fail'">已通过</div>
            <div v-if="item.status == 2" :class="item.status == 2 ? 'success' : 'fail'">审核未通过</div>
            <div v-if="item.status != 1 && item.status!= 2" :class="item.status == 1 ? 'success' : 'fail'">审核中</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'cashlog',
        data () {
            return {
                list: [],
                loading: false,
                total: 1,
                page: 0
            }
        },
        mounted () {
        },
        methods: {
            loadMore () {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    if (this.list.length >= this.total) return false;
                    this.page ++;
                    myFn.ajax('get', {page: this.page}, apiAddress.admin.cashlist, res => {
                        for (var i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].create_time = this.getTime(res.data.data[i].create_time)
                            this.total = res.data.total
                        };
                        this.list = this.list.concat(res.data.data);
                    })
                }, 1000)
            },
            getTime (value) {
                var date = new Date(value * 1000)
                var time = date.toLocaleString().split(' ')[0]
                return time
            }
        }
    }
</script>

<style scoped>
    .cashlog {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #fff;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .table-head {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid #d4d4d4;
    }
    .table-head > div {
        flex: 1;
        text-align: center;
    }
    .table-cell {
        display: flex;
        padding: 15px 0;
        position: relative;
    }
    .table-cell > div {
        flex: 1;
        text-align: center;
        font-size: 14px;
    }
    .table-cell:after {
        content: '';
        position: absolute;
        left: 10px;
        width: calc(100% - 20px);
        border-bottom: 1px solid #d4d4d4;
        bottom: 0;
    }
    .success {
        color: green;
    }
    .fail {
        color: #999;
    }
</style>