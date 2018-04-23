<template>
    <div class="login">
        <mt-field label="手机号" placeholder="请输入手机号" v-model="username"></mt-field>
        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
        <mt-field label="验证码" v-model="captcha">
            <mt-button @click="get_code" class="getCode"  type="primary" size="small" :disabled="is_disabled">{{codeText}}</mt-button>
        </mt-field>
        <mt-button @click="submit" class="submit"  type="primary" size="large">注册</mt-button>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data () {
            return {
                username: '',
                password: '',
                captcha: '',
                codeText: '获取',
                is_disabled: false
            }
        },
        methods: {
            get_code: function () {
                this.setTime('60s');
            },
            setTime: function (t) {
                var self = this;
                self.codeText = t;
                self.is_disabled = true;
                setTimeout(function () {
                    if (self.codeText !== '1s') {
                        self.codeText = parseInt(self.codeText) - 1 + 's';
                        self.setTime(self.codeText);
                    } else {
                        self.codeText = '获取';
                        self.is_disabled = false;
                    }
                }, 1000);
            },
            submit: function () {
                this.$router.push({name: 'index'});
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .submit {
        width: 90%;
        margin:auto;
        margin-top: 49%;
    }
    .getCode {
        width: 70px;
        border-radius: 2px;
        height: 35px;
    }
</style>
