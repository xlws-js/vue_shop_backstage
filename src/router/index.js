import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import( 'views/login/Login.vue' )
const Home = () => import( 'views/home/Home.vue' )
const Welcome = () => import( 'views/home/homecomponents/Welcome.vue' )
const User = () => import( 'components/user/User.vue' )

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: User
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    // mode: history
})

// 挂载路由导航首位
router.beforeEach( ( to, from, next ) => {
    if ( to.path === '/login' ) return next()
    const tokenStr = window.sessionStorage.getItem( 'token' )
    if ( !tokenStr ) return next( '/login' )
    next()
} )

export default router
