<template>
    <div id="home">
        <el-container class="home_container">
            <el-header>
                <div class="logo">
                    <img src="~assets/img/heima.png" alt="黑马程序员">
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <el-container>
                <el-aside :width="isFold ? '64px' : '200px'">
                    <div class="togger_button" @click="fold">|||</div>
                    <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"
                        :unique-opened="true"
                        :collapse="isFold"
                        :collapse-transition='false'
                        :router="true"
                        :default-active="active">
                        <el-submenu :index="item.id + ''" v-for="item in authList" :key="item.id">
                            <template slot="title">
                                <i :class="iconList[ item.id ]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <el-menu-item :index="'/' + children.path" v-for="children in item.children" :key="children.id">
                                <i class="el-icon-menu"></i>
                                <span>{{children.authName}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { request } from 'network/request.js'

export default {
    data () {
        return {
            authList: [],
            iconList: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            isFold: false
        }
    },
    computed: {
        active () {
            return this.$route.path
        }
    },
    methods: {
        logout () {
            window.sessionStorage.clear()
            this.$router.push( '/login' )
        },

        getMenuList () {
            request( {
                method: 'get',
                url: 'menus'
            } )
            .then( ({ data: response }) => {
                if ( response.meta.status !== 200 ) return this.$toast.error( response.meta.msg )
                this.authList = response.data
            } )
        },

        fold () {
            this.isFold = !this.isFold
        }
    },
    created () {
        this.getMenuList()
    }
}
</script>

<style lang="less" scoped>
    #home {
        height: 100%;

        .home_container {
            height: inherit;
        }
    }

    .el-header {
        background-color: #373d41;
        color: #fff;

        display: flex;
        align-items: center;
        justify-content: space-between;

        .logo {
            display: flex;
            align-items: center;
            img {
                margin-right: 20px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
        transition: width .2s ease-in-out;

        .el-menu {
            border: none;
        }

        .iconfont {
            margin-right: 10px;
        }

        .togger_button {
            line-height: 35px;
            text-align: center;
            background-color: #4a5064;
            color: #fff;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: .2em;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }


</style>
