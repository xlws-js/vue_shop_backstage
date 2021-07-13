<template>
    <div id="login_container">
        <div class="login_box">
            <div class="picture_frame">
                <img src="~assets/img/login_default_img.jpg" alt="">
            </div>
            <el-form ref="loginFormRef" :model="loginFrom" class="login-form" :rules="loginFromRules">
                <el-form-item prop="username">
                    <el-input class="username" prefix-icon="el-icon-s-custom" v-model="loginFrom.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" class="password" prefix-icon="el-icon-lock" v-model="loginFrom.password">
                </el-input>
                </el-form-item>
                <el-form-item class="right">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { request } from 'network/request.js'

export default {
    name: 'Login',
    data() {
        return {
            loginFrom: {
                username: 'admin',
                password: '123456'
            },

            loginFromRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],

                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetForm () {
            this.$refs.loginFormRef.resetFields()
        },

        login () {
            this.$refs.loginFormRef.validate( vaild => {
                if ( !vaild ) return
                request( {
                    method: 'post',
                    url: 'login',
                    params: this.loginFrom
                } )
                .then( ({ data: response }) => {
                    if (  response.meta.status !== 200 ) return this.$toast.error( '登录失败' )
                    this.$toast.success( '登录成功' )
                    // 1、将登陆之后的 token，保存到客户端的 sessionStorage 中
                    // 1.1、项目中除了登录之外的其他 API 接口，必须在登陆之后才能访问
                    // 1.2、token 只应在当前打开期间生效，所以将 token 保存到 sessionStorage 中
                    window.sessionStorage.setItem( 'token', response.data.token )
                    // 2、 通过编程时导航跳转到后台主页，路由地址时 /home
                    this.$router.push( '/home' )
                } )
            } )
        }
    }
}
</script>

<style lang="less" scoped>
    #login_container {
        background-image: linear-gradient(to top, #74b9ff, #0984e3);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: rgba(255, 255, 255, .7);
        border-radius: 20px;
        position: relative;

        .picture_frame {
            height: 130px;
            width: 130px;
            border-radius: 50%;
            overflow: hidden;
            border: 20px solid rgba(255, 255, 255, .4);
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%, -50%);

            img {
                width: 100%;
            }
        }

        .login-form {
            box-sizing: border-box;
            padding: 0 30px;
            margin-top: 100px;

            .right {
                float: right;
            }
        }
    }
</style>
