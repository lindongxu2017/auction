<template>
    <div class="address">
        <p v-if="list.length == 0" class="noAddress">您还没有设置收货地址，请添加！</p>
        <div class="options" v-for="(item,index) in list">
            <div class="info">
                <div class="flex">
                    <span v-html="item.address_name"></span>
                    <span v-html="item.address_phone"></span>
                </div>
                <p>地址：<span v-html="item.address">深圳市福田区上沙6坊</span></p>
            </div>
            <div class="operation">
                <div class="radio"  @click="setDefault(item.id, index)">
                    <img v-if="item.is_default == 1" src="../../assets/icon/true(1).png" width="17" @click.stop="addressEditorAdd(item.id)">
                    <span v-else></span>
                    <div :class="[item.is_default == 1?'red':'']">设为默认</div>
                </div>
                <div class="operation-wrapper">
                    <div @click.stop="addressEditorAdd(item.id)">
                        <img src="../../assets/icon/edit.png" width="20">
                        <span>编辑</span>
                    </div>
                    <div @click.stop="delAddress(item.id, index)">
                        <img src="../../assets/icon/del.png" width="18">
                        <span>删除</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click.native="addressEditorAdd(0)">新增收货地址</mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'address',
        data () {
            return {
                list: []
            }
        },
        mounted () {
            this.addressList();
        },
        methods: {
            setDefault (id, index) {
                for (var i = 0; i < this.list.length; i++) {
                    this.list[i].is_default = '0';
                };
                myFn.ajax('get', {addr_id: id}, apiAddress.center.addressDefault, (res) => {
                    this.list[index].is_default = '1';
                })
            },
            addressList () {
                myFn.ajax('get', {}, apiAddress.center.address, (res) => {
                    this.list = res.data;
                })
            },
            addressEditorAdd (id) {
                this.$router.push({name: 'addressEdit', params: {id: id}});
            },
            delAddress (id, index) {
                myFn.ajax('post', {addr_id: id}, apiAddress.center.addressDel, (res) => {
                    this.list.splice(index, 1);
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .red {
        color: #ad9355;
    }
    .noAddress {
        padding: 10px;
        font-size: 14px;
        color: #999;
        text-align: center;
        margin-top: 50px;
    }
    .address {
        margin-top: -1px;
        background: #f3f3f3;
    }
    .options {
        background: #fff;
        padding: 10px 0 3px;
        margin-bottom: 10px;
    }
    .operation {
        padding: 10px;
        border-top: 1px solid #d4d4d4;
    }
    .operation .operation-wrapper {
        display: inline-block;
        float: right;
    }
    .operation-wrapper > div {
        display: inline-block;
        font-size: 14px;    
        margin: 0 5px;
    }
    .operation-wrapper > div span,
    .operation-wrapper > div img {
        font-size: 12px;
        vertical-align: middle;
    }
    .operation-wrapper > div:first-child .iconfont {
        font-size: 20px;
    }
    .operation-wrapper > div:last-child .iconfont {
        font-size: 17px;
    }
    .options .radio {
        display: inline-block;
    }
    .options .radio img,
    .options .radio span,
    .options .radio div {
        vertical-align: middle;
    }   
    .options .radio span {
        width: 15px;
        height: 15px;
        display: inline-block;
        background: #fff;
        border: 1px solid #a0a0a0;
        border-radius: 50%;
    }
    .options .radio span.active {
        background: #D4CEAB;
        border-color: #D4CEAB;
    }
    .options .radio > div {
        display: inline-block;
        font-size: 12px;
    }
    .options .info {
        position: relative;
        font-size: 16px;
    }
    .options .info .flex {
        padding: 0 10px;
        font-size: 0;
    }
    .options .info .flex span {
        width: 50%;
        display: inline-block;
        font-size: 15px;
        color: #585b67;
    }
    .options .info .flex span:last-child {
        text-align: right;
    } 
    .options .info p {
        padding: 10px;
        color: #858585;
        font-size: 14px;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 20%;
        font-size: 0;
    }
    .delete {
        margin-top: 15px;
        background: #fff;
        color: #D4CEAB;
        box-shadow: 0 0px 2px #D4CEAB;
    }
</style>
