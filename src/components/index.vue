<template>
    <div class="index">
        <router-view></router-view>
        <keep-alive>
            <router-view name="footerNav" ref="footer"></router-view>
        </keep-alive>
    </div>
</template>
<script>
    export default {
        name: 'index',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>