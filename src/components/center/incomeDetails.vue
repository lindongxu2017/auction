<template>
    <div class="incomeDetails">
        <div class="title">
            <span>——</span>
            <span class="iconfont icon-logo"></span>
            <span>收支明细</span>
            <span>——</span>
        </div>
        <table>
            <thead>
                <tr>
                    <th>时间</th>
                    <th>收支</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in list">
                    <td v-html="item.create_time">2017/11/15 15:30</td>
                    <td v-html="item.change">+ 3000</td>
                </tr>
            </tbody>
        </table>
        <div class="noMore" v-if="list.length == 0">暂无数据 ...</div>
    </div>
</template>

<script>
    export default {
        name: 'incomeDetails',
        data () {
            return {
                list: []
            }
        },
        mounted () {
            myFn.ajax('get', {}, apiAddress.center.incomeLog, (res) => {
                this.list = res.data.data;
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .noMore {
        position: absolute;
        top: 150px;
        left: 50%;
        margin-left: -39px;
        color: #999;
        font-size: 14px;
        letter-spacing: 1px;
    }
    .title {
        text-align: center;
        padding: 20px 0;
        color: #D7B764;
        border-bottom: 1px solid #d4d4d4;
    }
    .title > span {
        vertical-align: middle;
    }
    .title > span:nth-child(1) {
        margin-right: 15px;
    }
    .title > span:nth-child(4) {
        margin-left: 15px;
    }
    table {
        width: 100%;
        border-collapse:collapse;
    }
    thead tr {
        height: 45px;
    }
    thead tr th {
        width: 50%;
        color: #393939;
        font-weight: 500;
    }
    tbody tr td {
        height: 40px;
        text-align: center;
        font-size: 14px;
        color: #888;
    }
</style>