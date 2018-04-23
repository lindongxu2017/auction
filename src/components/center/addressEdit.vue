<template>
    <div class="addressEdit">
        <mt-field label="收件人" placeholder="请输入姓名" v-model="username"></mt-field>
        <mt-field label="联系电话" placeholder="请输入手机号" v-model="phone"></mt-field>
        <mt-field placeholder="请输入收件地址" type="textarea" rows="4" v-model="address"></mt-field>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click.native="submit" v-html="'保存'"></mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'addressEdit',
        data () {
            return {
                id: '',
                phone: '',
                address: '',
                username: ''
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            if (parseInt(this.id) !== 0) {
                this.addressDetails();
            };
        },
        methods: {
            addressDetails () {
                myFn.ajax('get', {addr_id: this.id}, apiAddress.center.addressDetails, (res) => {
                    this.address = res.data.address;
                    this.phone = res.data.address_phone;
                    this.username = res.data.address_name;
                })
            },
            submit () {
                var data = {
                    addr_id: this.id,
                    address_name: this.username,
                    address_phone: this.phone,
                    address: this.address
                };
                if (this.username === '') {
                    alert('收货人名称不能为空');
                    return;
                };
                if (this.phone === '') {
                    alert('收货人电话不能为空');
                    return;
                };
                if (this.address === '') {
                    alert('收货人地址不能为空');
                    return;
                };
                myFn.ajax('post', data, apiAddress.center.addressModify, (res) => {
                    this.$router.push({name: 'address'});
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .addressEdit .mint-field .mint-cell-title {
        width: 80px;
        font-size: 15px;
    }
    .addressEdit .mint-field-core {
        font-size: 15px;
    }
    .addressEdit .mint-field.is-textarea .mint-cell-title {
        margin-top: -70px;
    }
    .addressEdit .mint-cell-wrapper {
        background-origin: border-box;
        background-position: bottom left;
        background-image: linear-gradient(180deg, #d4d4d4, #d4d4d4 50%, transparent 50%)
    }
    .addressEdit .submit-btn {
        padding: 10px;
        margin-top: 20%;
    }
    .addressEdit .mint-cell {
        min-height: 50px;
    }
</style>
