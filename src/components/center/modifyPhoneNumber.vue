<template>
    <div class="modifyPhoneNumber">
        <div class="form">
            <p class="tips">请输入你需要绑定的新手机号</p>
            <mt-field class="first" label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
            <mt-field label="验证码" placeholder="请输入验证码" v-model="captcha">
                <mt-button class="mobileCode" type="default" size="small" @click.native="getCode">{{codeTitle}}</mt-button>
            </mt-field>
        </div>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click.native="modify">提交</mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modifyPhoneNumber',
        data () {
            return {
                phone: '',
                captcha: '',
                userInfo: {},
                codeTitle: '获取'
            }
        },
        mounted () {
            if (localStorage.userInfo) {
                this.userInfo = JSON.parse(localStorage.userInfo);
            };
        },
        methods: {
            getCode () {
                if (this.codeTitle === '获取') {
                    if (this.phone === '') {
                        alert('手机号码不能为空');
                        return false;
                    }
                    if (parseInt(this.phone) === parseInt(this.userInfo.mobile)) {
                        alert('您输入的手机号码与当前绑定手机号码相同');
                        return false;
                    }
                    myFn.ajax('post', {mobile: this.phone}, apiAddress.center.getCode, (res) => {
                        this.codeTitle = '60s';
                        this.set_codeTime();
                    })
                } else {
                    return false;
                }
            },
            set_codeTime () {
                setTimeout(() => {
                    this.codeTitle = parseInt(this.codeTitle) - 1 + 's'
                    if (this.codeTitle === '0s') {
                        this.codeTitle = '获取';
                    } else {
                        this.set_codeTime();
                    }
                }, 1000);
            },
            modify () {
                if (this.phone === '') {
                    alert('请输入手机号');
                    return;
                };
                if (this.captcha === '') {
                    alert('请输入验证码');
                    return;
                };
                myFn.ajax('post', {mobile: this.phone, code: this.captcha}, apiAddress.center.modify, (res) => {
                    this.$toast({
                        message: '修改成功',
                        duration: 1000
                    })
                    setTimeout((res) => {
                        this.$router.push({name: 'center'})
                    }, 1200)
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .modifyPhoneNumber .mint-cell-wrapper {
        background-origin: border-box;
        padding: 0 3px;
    }
    .modifyPhoneNumber .mint-cell-wrapper {
        font-size: 16px;
    }
    .modifyPhoneNumber .mint-cell.first .mint-cell-wrapper {
        background: none;
    }
    .modifyPhoneNumber .mint-button--small {
        box-shadow: none;
        /* box-shadow: 0 0 2px #d4ceab; */
        border: 1px solid #AD9355;
        color: #AD9355;
        background: #fff;
    }
    .modifyPhoneNumber .mint-cell {
        min-height: 55px;
    }
</style>
<style scoped>
    .form {
        padding: 0 10px;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 20%;
    }
    .tips {
        color: #585b67;
        font-size: 14px;
        padding: 12px 5px;
        padding-bottom: 5px;
    }
    .mobileCode {
        padding: 0 7px;
    }
</style>
