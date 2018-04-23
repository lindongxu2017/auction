<template>
    <div class="protectRights">
        <div class="form">
            <!-- <mt-field label="原因" readonly placeholder="请选择" @click.native="choose" v-model="reason">
                <span class="select"></span>
            </mt-field> -->
            <p>维权图片</p>
            <div class="upload-wrapper">
                <div v-for="(item,index) in imgPreview">
                    <img :src="item" @click="preview(index)">
                    <span class="iconfont icon-shanchu" @click="delImg(index)"></span>
                </div>
                <img v-if="imgPreview.length < 5" src="../../assets/icon/upload.png" @click="chooseImg">
            </div>
            <p>备注</p>
            <mt-field placeholder="请填写备注信息" type="textarea" rows="4" v-model="marsk"></mt-field>
        </div>
        <div class="submit-btn">
            <mt-button type="primary" size="large" @click="submit">提交</mt-button>
        </div>
        <mt-popup  v-model="popupVisible" position="bottom">
            <mt-picker :slots="slots" value-key="name" valueKey="name" showToolbar @change="onValuesChange">
                <div>
                    <span @click="popupVisible=false">取消</span>
                    <span @click="confirm">确认</span>
                </div>
            </mt-picker>
        </mt-popup>
    </div>
</template>

<script>
    import wx from 'weixin-js-sdk'
    export default {
        name: 'protectRights',
        data () {
            return {
                reason: '',
                marsk: '',
                popupVisible: false,
                slots: [
                    {
                        flex: 1,
                        values: [],
                        className: 'slot1',
                        textAlign: 'center'
                    }
                ],
                selectValue: '',
                selectID: '',
                // 图片上传
                imgID: [],
                imgPreview: []
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            this.getAppealType();
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
            chooseImg () {
                var chooseCount = 5 - this.imgID.length;
                var self = this;
                wx.chooseImage({
                    // 默认9
                    count: chooseCount,
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
            },
            preview (index) {
                var self = this;
                wx.previewImage({
                    // 当前显示图片的http链接
                    current: self.imgPreview[index],
                    // 需要预览的图片http链接列表
                    urls: self.imgPreview
                });
            },
            delImg (index) {
                this.imgID.splice(index, 1);
                this.imgPreview.splice(index, 1);
            },
            getAppealType () {
                myFn.ajax('post', {order_id: this.id}, apiAddress.center.appealType, (res) => {
                    this.slots[0].values = res.data;
                    localStorage.appealType = JSON.stringify(res.data);
                })
            },
            choose () {
                this.popupVisible = true;
            },
            onValuesChange (picker, values) {
                if (values[0]) {
                    this.selectValue = values[0].name;
                    this.selectID = values[0].id;
                };
            },
            confirm () {
                this.reason = this.selectValue;
                console.log(this.selectValue)
                console.log(this.selectID)
                this.popupVisible = false;
            },
            submit () {
                /* if (this.selectID === '') {
                    alert('请选择维权原因');
                    return false;
                } else */
                if (this.marsk === '') {
                    alert('请填写维权备注');
                    return false;
                } else if (this.imgID.length === 0) {
                    alert('请上传维权图片')
                    return false;
                }
                var formData = new FormData();
                formData.append('order_id', this.id)
                formData.append('type', this.selectID)
                formData.append('content', this.marsk)
                for (var i = 0; i < this.imgID.length; i++) {
                    formData.append('media[]', this.imgID[i])
                };
                myFn.uploadImg(formData, apiAddress.center.appeal, (res) => {
                    alert('已收到维权信息，请等待结果!')
                    this.$router.push({name: 'pendingReceive'});
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .protectRights .mint-cell:first-child .mint-cell-wrapper {
        padding: 15px 10px;
    }
    .protectRights .mint-cell-wrapper {
        background-position: bottom left;
    }
    .protectRights .mint-field.is-textarea .mint-cell-wrapper {
        border-bottom: 1px solid #d9d9d9;
        background: none;
    }
    .protectRights .mint-field-core {
        font-size: 16px;
        resize: none;
    }
    .protectRights .mint-popup-bottom {
        width: 100%;
    }
    .protectRights .picker-item {
        font-size: 16px;
    }
    .protectRights .picker-toolbar {
        border-bottom: 1px solid #d4d4d4;
        line-height: 41px;
        padding: 0 10px;
    }
    .protectRights .picker-toolbar span:last-child {
        float: right;
        color: #09f;
    }
    .protectRights .mint-field .mint-cell-title {
        margin-top: -5px;
    }
    .protectRights .mint-cell {
        min-height: 50px;
    }
    .protectRights .mint-field.is-textarea .mint-cell-value {
        padding: 0;
    }
</style>
<style scoped>
    .form {
        color: #585b67;
    }
    .form p {
        padding: 10px;
        font-size: 16px;
    }
    .submit-btn {
        padding: 10px;
        margin-top: 20%;
    }
    .select {
        width: 15px;
        height: 15px;
        display: inline-block;
        position: relative;
    }
    .select:before {
        content: '';
        position: absolute;
        right: 5px;
        top: 5px;
        border: 8px solid;
        border-color: #585b67 transparent transparent; 
    }
    .upload-wrapper {
        padding: 5px 10px 15px;
        border-bottom: 1px solid #d4d4d4;
        font-size: 0;
    }
    .upload-wrapper > div {
        display: inline-block;
        margin: 0 15px 15px 0;
        position: relative;
    }
    .upload-wrapper > div span {
        position: absolute;
        right: -5px;
        top: -5px;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        background: red;
        color: #fff;
    }
    .upload-wrapper img {
        vertical-align: middle;
        width: 80px;
        height: 80px; 
    }
    .submit-btn {
        margin-top: 20%!important;
    }
</style>
