import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'
import home from '@/components/home/home'
import homeDetails from '@/components/home/home_details'
// 拍卖专场
import specialAuction from '@/components/specialAuction/auction'
import specialAuctionList from '@/components/specialAuction/auction_list'
import specialAuctionDetails from '@/components/specialAuction/auction_details'
import setRemind from '@/components/specialAuction/set_remind'

import center from '@/components/center/center'
import footerNav from '@/components/footerNav'
import statePage from '@/components/statePage'
// 拍卖会
import room from '@/components/auction/room'
import redPacket from '@/components/auction/red_packet'
import video from '@/components/auction/video'

// 我的
import certify from '@/components/center/certify'
import pendingPay from '@/components/center/pendingPay'
import pendingReceive from '@/components/center/pendingReceive'
import received from '@/components/center/received'
import protectRights from '@/components/center/protectRights'
import protectRightsList from '@/components/center/protectRightsList'
import orderDetails from '@/components/center/orderDetails'
import goodsDetails from '@/components/center/goodsDetails'
import balance from '@/components/center/balance'
import recharge from '@/components/center/balanceRecharge'
import incomeDetails from '@/components/center/incomeDetails'
import personInfo from '@/components/center/personInfo'
import modifyPhoneNumber from '@/components/center/modifyPhoneNumber'
import address from '@/components/center/address'
import addressEdit from '@/components/center/addressEdit'
import bond from '@/components/center/bond'
import cash from '@/components/center/cash'
import cashlog from '@/components/center/cashlog'
import pay from '@/components/center/pay'
import offerList from '@/components/center/offerList'
import modifyUsername from '@/components/center/modifyUsername'
import customer from '@/components/center/customer'
import QRcode from '@/components/center/QRcode'
import blankPage from '@/components/center/blankPage'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '*',
            redirect: '/statePage/4',
            component: statePage
        },
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/statePage',
            redirect: '/statePage/1'
        },
        {
            path: '/statePage/:type',
            name: 'statePage',
            component: statePage
        },
        {
            path: '/index',
            name: 'index',
            component: index,
            redirect: '/index/home',
            children: [
                {
                    path: '/index/home',
                    name: 'home',
                    components: {
                        default: home,
                        footerNav: footerNav
                    }
                },
                // 我的 start
                {
                    path: '/index/home/details/:id',
                    name: 'homeDetails',
                    components: {
                        default: homeDetails
                    }
                },
                {
                    path: '/index/special/auction',
                    name: 'specialAuction',
                    components: {
                        default: specialAuction,
                        footerNav: footerNav
                    }
                },
                {
                    path: '/index/special/auction/details/:id/:roomType',
                    name: 'specialAuctionDetails',
                    components: {
                        default: specialAuctionDetails
                    }
                },
                {
                    path: '/index/special/auction/setRemind/:id',
                    name: 'setRemind',
                    components: {
                        default: setRemind
                    }
                },
                {
                    path: '/index/special/auction/list/:id',
                    name: 'specialAuctionList',
                    components: {
                        default: specialAuctionList
                    }
                },
                {
                    path: '/index/center',
                    name: 'center',
                    components: {
                        default: center,
                        footerNav: footerNav
                    }
                },
                {
                    path: '/index/center/certify',
                    name: 'certify',
                    components: {
                        default: certify
                    }
                },
                {
                    path: '/index/center/pendingPay',
                    name: 'pendingPay',
                    components: {
                        default: pendingPay
                    }
                },
                {
                    path: '/index/center/pendingReceive',
                    name: 'pendingReceive',
                    components: {
                        default: pendingReceive
                    }
                },
                {
                    path: '/index/center/received',
                    name: 'received',
                    components: {
                        default: received
                    }
                },
                {
                    path: '/index/center/protectRights/:id',
                    name: 'protectRights',
                    components: {
                        default: protectRights
                    }
                },
                {
                    path: '/index/center/protectRightsList',
                    name: 'protectRightsList',
                    components: {
                        default: protectRightsList
                    }
                },
                {
                    path: '/index/center/orderDetails/:id/:pid',
                    name: 'orderDetails',
                    components: {
                        default: orderDetails
                    }
                },
                {
                    path: '/index/center/goodsDetails/:id/:type',
                    name: 'goodsDetails',
                    components: {
                        default: goodsDetails
                    }
                },
                {
                    path: '/index/center/balance',
                    name: 'balance',
                    components: {
                        default: balance
                    }
                },
                {
                    path: '/index/center/balance/recharge/:type', // type: 1余额充值 2 保证金充值
                    name: 'recharge',
                    components: {
                        default: recharge
                    }
                },
                {
                    path: '/index/center/balance/incomeDetails',
                    name: 'incomeDetails',
                    components: {
                        default: incomeDetails
                    }
                },
                {
                    path: '/index/center/personInfo',
                    name: 'personInfo',
                    components: {
                        default: personInfo
                    }
                },
                {
                    path: '/index/center/personInfo/modifyPhoneNumber',
                    name: 'modifyPhoneNumber',
                    components: {
                        default: modifyPhoneNumber
                    }
                },
                {
                    path: '/index/center/address',
                    name: 'address',
                    components: {
                        default: address
                    }
                },
                {
                    path: '/index/center/address/addressEdit/:id',
                    name: 'addressEdit',
                    components: {
                        default: addressEdit
                    }
                },
                {
                    path: '/index/center/bond',
                    name: 'bond',
                    components: {
                        default: bond
                    }
                },
                {
                    path: '/index/center/cash/:balance',
                    name: 'cash',
                    components: {
                        default: cash
                    }
                },
                {
                    path: '/index/center/cashlog',
                    name: 'cashlog',
                    components: {
                        default: cashlog
                    }
                },
                {
                    path: '/index/pay/:id/:payid',
                    name: 'pay',
                    components: {
                        default: pay
                    }
                },
                {
                    path: '/index/center/offerlist/:id',
                    name: 'offerList',
                    components: {
                        default: offerList
                    }
                },
                {
                    path: '/index/center/modifyUsername',
                    name: 'modifyUsername',
                    components: {
                        default: modifyUsername
                    }
                },
                {
                    path: '/index/center/customer',
                    name: 'customer',
                    components: {
                        default: customer
                    }
                },
                {
                    path: '/index/center/QRcode/:uid',
                    name: 'QRcode',
                    components: {
                        default: QRcode
                    }
                },
                {
                    path: '/index/center/blankPage/:uid',
                    name: 'blankPage',
                    components: {
                        default: blankPage
                    }
                },
                // 拍卖会 start
                {
                    path: '/index/auction/room/:id',
                    name: 'room',
                    components: {
                        default: room,
                        footerNav: footerNav
                    }
                },
                {
                    path: '/index/auction/redPacket/:id',
                    name: 'redPacket',
                    components: {
                        default: redPacket
                    }
                },
                {
                    path: '/index/auction/video/:src',
                    name: 'video',
                    components: {
                        default: video
                    }
                }
            ]
        }
    ]
})
