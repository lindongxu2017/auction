var apiAddress = {
    // 微信
    wx: {
        getCode: '/index.php/Login/getWxCode', // 获取wxCode
        login: '/index.php/Login/wxLogin', // wxlogin 微信登录
        jssdk: '/index.php/Home/System/getJssdk' // 获取签名信息
    },
    // 认证、支付、绑定
    admin: {
        getMobileCode: '/index.php/Login/getMobileCode', // 获取手机验证码
        binding: '/index.php/Login/binding', // 绑定手机号
        orderID: '/index.php/paymant/makePMcOrder', // 生成订单ID
        getQRcode: '/index.php/member/getDownLine', // 获取二维码
        setUserDown: '/index.php/member/setUserDown', // 成为下级
        cash: '/index.php/Home/Withdraw/apply', // 提现
        cashlist: '/index.php/Home/Withdraw/getList' // 提现列表
    },
    // 首页
    home: {
        carouselImg: '/index.php/index/getIndexSlides', // 首页轮播图
        goodsClassify: '/index.php/index/getGoodsCategory', // 商品分类
        goodslist: '/index.php/index/getGoodsList', // 商品列表
        goodsDetails: '/index.php/index/getGoodsDetail', // 商品列表
        support: '/index.php/index/supportGoods' // 支持点赞
    },
    // 个人中心
    center: {
        userData: '/index.php/member/userDetail', // 用户详情
        getCode: '/index.php/member/sendChangeMsg', // 修改绑定手机号时获取验证码
        modify: '/index.php/member/changeMobile', // 修改绑定手机号
        address: '/index.php/member/getAddressList', // 收货地址列表
        addressDel: '/index.php/member/delAddress', // 删除收货地址
        addressModify: '/index.php/member/ModifyAddress', // 添加或修改收货地址
        addressDetails: '/index.php/member/getAddressDetail', // 收货地址详情
        addressDefault: '/index.php/member/setAddressDefault', // 设置默认收货地址
        incomeLog: '/index.php/member/userCostBill', // 用户收支记录
        bondMoney: '/index.php/paymant/payPledge', // 保证金充值
        balance: '/index.php/paymant/payMemberCost', // 余额充值
        // 订单部分
        order: '/index.php/Home/order/get_lsit', // 订单列表
        orderDetails: '/index.php/Home/order/info', // 订单详情
        appealType: '/index.php/Home/order/appeal_type', // 维权类型
        appeal: '/index.php/Home/order/appeal', // 维权
        appealCancel: '/index.php/Home/order/cancel_appeal', // 取消维权
        confirmReceipt: '/index.php/Home/order/confirm_receipt', // 确认收货
        orderPay: '/index.php/paymant/OtherPayOther', // 支付订单 pay_type 2余额支付  4线下汇款支付
        wxPay: '/index.php/paymant/wxPayOrder', // 微信支付
        isDefaultAddress: '/index.php/member/checkAddress', // 判断是否有默认地址
        // 保证金
        getBond: '/index.php/Home/System/get_deposit', // 获取最低保证金
        telephone: '/index.php/Home/System/customer_phone', // 获取客服电话
        experience: '/index.php/Home/Member/getRankInfo', // 获取经验
        offerLog: '/index.php/Home/AuctionSpecial/get_auction_record_list', // 获取出价记录
        // 修改个人信息
        username: '/index.php/member/updateNickname', // 修改昵称
        headimg: '/index.php/member/updateHeadimgurl' // 修改头像
    },
    // 专场拍卖
    specialAuction: {
        roomList: '/index.php/Home/AuctionSpecial/room_list', // 房间列表
        roomShopList: '/index.php/Home/AuctionSpecial/auction_list', // 拍品列表
        roomShopDetails: '/index.php/Home/AuctionSpecial/auction_info', // 拍品详情
        setPrice: '/index.php/Home/AuctionSpecial/raise_price', // 拍卖会加价
        open_remind: '/index.php/Home/AuctionSpecial/add_remind', // 开启提醒
        close_remind: '/index.php/Home/AuctionSpecial/cancel_remind', // 关闭提醒
        again: '/index.php/Home/AuctionSpecial/again', // 再来一次
        remindType: '/index.php/Home/AuctionSpecial/add_bidpric_remind' // 设置提醒类型
    },
    // 拍卖会
    auction: {
        shopList: '/index.php/Home/Auction/preview_goods_list', // 拍卖列表
        shopDetails: '/index.php/Home/Auction/goods_detail', // 拍品详情传pid
        remid: '/index.php/Home/Auction/add_remind', // 提醒传pid
        redPacket: '/index.php/Auction/red_packet_info' // 红包详情
    }
}
export {apiAddress}
