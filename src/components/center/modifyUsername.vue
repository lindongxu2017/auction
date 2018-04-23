<template>
    <div class="modifyUsername">
        <div class="form">
            <p class="tips">修改昵称</p>
            <mt-field class="first" label="昵称" placeholder="请输入新昵称" v-model="username"></mt-field>
        </div>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click.native="modify">提交</mt-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modifyUsername',
        data () {
            return {
                username: '',
                codeTitle: '获取'
            }
        },
        mounted () {
            this.getInfo();
        },
        methods: {
            getInfo () {
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    this.username = res.nickname;
                })
            },
            modify () {
                if (this.username === '') {
                    alert('昵称不能为空');
                    return;
                };
                myFn.ajax('post', {nickname: this.username}, apiAddress.center.username, (res) => {
                    this.$router.push({name: 'personInfo'})
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .modifyUsername .mint-cell-wrapper {
        background-origin: border-box;
        padding: 0 3px;
    }
    .modifyUsername .mint-cell-wrapper {
        font-size: 16px;
    }
    .modifyUsername .mint-cell.first .mint-cell-wrapper {
        background: none;
    }
    .modifyUsername .mint-button--small {
        box-shadow: none;
        /* box-shadow: 0 0 2px #d4ceab; */
        border: 1px solid #AD9355;
        color: #AD9355;
        background: #fff;
    }
    .modifyUsername .mint-cell {
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
