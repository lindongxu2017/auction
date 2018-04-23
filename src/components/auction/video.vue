<template>
    <div class="video">
        <video :src="videoUrl" style="width:100%;height:180px" controls="controls" webkit-playsinline="true" playsinline="true"></video>
    </div>
</template>

<script>
    export default {
        name: 'footerNav',
        data () {
            return {
                videoUrl: ''
            }
        },
        mounted () {
            this.videoUrl = this.$route.params.src;
            console.log('1111111');
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .video {
        width: 100%;
        height: 100%;
        font-size: 0;
    }
</style>
