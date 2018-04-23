<template>
    <div class="personInfo">
        <mt-cell title="昵称" to="/index/center/modifyUsername" is-link>
            <span v-html="userInfo.nickname"></span>
        </mt-cell>
        <mt-cell title="头像" class="headImg" @click.native="chooseImg" is-link>
            <img :src="userInfo.wximg">
        </mt-cell>
        <mt-cell title="手机号码" to="/index/center/personInfo/modifyPhoneNumber" is-link>
            <span v-html="userInfo.mobile"></span>
        </mt-cell>
        <mt-cell title="我的二维码" @click.native="goMyQRcode" is-link></mt-cell>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'
    export default {
        name: 'personInfo',
        data () {
            return {
                userInfo: {},
                imgPreview: [],
                imgID: []
            }
        },
        mounted () {
            this.getInfo();
            var url = location.href.split('#')[0];
            myFn.ajax('post', {url: url}, apiAddress.wx.jssdk, (res) => {
                res.data.debug = false;
                res.data.jsApiList = [
                    'chooseImage',
                    'uploadImage',
                    'previewImage'
                ]
                wx.config(res.data);
            })
        },
        methods: {
            getInfo () {
                myFn.ajax('get', {}, apiAddress.center.userData, (res) => {
                    this.userInfo = res.data;
                })
            },
            goMyQRcode () {
                this.$router.push({name: 'QRcode', params: {uid: this.userInfo.uid}})
            },
            chooseImg () {
                var self = this;
                wx.chooseImage({
                    // 默认9
                    count: 1,
                    // 可以指定是原图还是压缩图，默认二者都有
                    sizeType: ['original', 'compressed'],
                    // 可以指定来源是相册还是相机，默认二者都有
                    sourceType: ['album', 'camera'],
                    // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    success: function (res) {
                        if (window.__wxjs_is_wkwebview) {
                            self.localImgData(res.localIds);
                        } else {
                            for (var i = 0; i < res.localIds.length; i++) {
                                self.imgPreview.push(res.localIds[i])
                            };
                        }
                        self.wxUpload(res.localIds);
                    }
                });
            },
            localImgData (localIds) {
                var self = this;
                var newArr = localIds.slice(0);
                var localId = newArr.shift();
                wx.getLocalImgData({
                    localId: localId,
                    success: function (result) {
                        self.imgPreview.push(result.localData);
                        if (newArr.length > 0) {
                            self.localImgData(newArr);
                        }
                    }
                });
            },
            wxUpload (localIds) {
                var self = this;
                var imageIdsArr = localIds;
                var localId = imageIdsArr.shift();
                wx.uploadImage({
                    // 需要上传的图片的本地ID，由chooseImage接口获得
                    localId: localId + '',
                    // 默认为1，显示进度提示
                    isShowProgressTips: 1,
                    success: function (res) {
                        self.imgID.push(res.serverId);
                        if (imageIdsArr.length > 0) {
                            self.wxUpload(localIds);
                        };
                    }
                })
            }
        },
        watch: {
            imgID: function () {
                myFn.ajax('post', {headimgurl: this.imgID[0]}, apiAddress.center.headimg, (res) => {
                    console.log('上传成功')
                    this.getInfo();
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .personInfo .mint-cell-wrapper {
        background-origin: border-box;
        background-size: 94% 1px;
        background-position-x: 40%;
        background-position-y: 0%;
        padding: 0 15px;
    }
    .personInfo .mint-cell:first-child .mint-cell-wrapper {
        background: none;
    }
    .personInfo .headImg img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .personInfo .mint-cell:last-child {
        background-size: 94% 1px;
    }
    .personInfo .mint-cell {
        min-height: 55px;
    }
    .personInfo .mint-cell-value {
        color: #989DB3
    }
</style>