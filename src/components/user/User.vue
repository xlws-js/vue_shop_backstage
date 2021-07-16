<template>
    <div id="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input @clear="clearInput" clearable placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="adminList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch @change="userStateChange( scope.row )" v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click="showEditDialog( scope.row.id )" size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button @click="isDelete( scope.row.id )" size="mini" type="danger" icon="el-icon-delete"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="resetForm">
            <el-form ref="addFormRef" :model="addUserInfoForm" label-width="80px" :rules="UserInfoRules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserInfoForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addUserInfoForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserInfoForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserInfoForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userInfoValidate">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="30%"
            @click="editDialogClose">
            <el-form ref="editFormRef" :model="editUserInfo" label-width="80px" :rules="UserInfoRules">
                <el-form-item label="用户名">
                    <el-input disabled v-model="editUserInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editUserInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfoValidateAndSubmit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { request } from 'network/request.js'

export default {
    data () {
        const validateEmail = ( rule, value, callback ) => {
            let regEamil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

            regEamil.test( value ) ? callback() : callback( new Error( '邮箱格式错误' ) )
        }

        const validateMobile = ( rule, value, callback ) => {
            let regMobile = /^(0|86|17952)?(13[0-9]|15[12356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

            regMobile.test( value ) ? callback() : callback( new Error( '电话号码格式错误' ) )
        }

        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            adminList: [],
            total: 0,
            addDialogVisible: false,
            addUserInfoForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            UserInfoRules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在 3 到 10 之间', trigger: 'blur' }
                ],

                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码长度在 6 到 16 位之间', trigger: 'blur' }
                ],

                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],

                mobile: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { validator: validateMobile, trigger: 'blur' }
                ]
            },
            editDialogVisible: false,
            editUserInfo: {}
        }
    },
    created () {
        this.getUsersMsaages()
    },
    methods: {
        getUsersMsaages () {
            request( {
                method: 'get',
                url: 'users',
                params: this.queryInfo
            } )
            .then( ({data: response}) => {
                if ( response.meta.status !== 200 ) return this.$toast.error( '获取管理员列表失败' )
                this.adminList = response.data.users
                this.total = response.data.total
            } )
        },

        handleSizeChange ( newSize ) {
            this.queryInfo.pagesize = newSize
            this.getUsersMsaages()
        },

        handleCurrentChange ( newPage ) {
            this.queryInfo.pagenum = newPage
            this.getUsersMsaages()
        },

        async userStateChange ( userInfo ) {
            let { data: response } = await request({
                method: 'put',
                url: `users/${ userInfo.id }/state/${ userInfo.mg_state }`
            })

            if ( response.meta.status !== 200 ) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$toast.error( '用户状态修改失败' )
            }

            this.$toast.success( '状态更新成功' )
        },

        searchUser () {
            // 搜索用户，并获取信息
            this.getUsersMsaages()
        },

        clearInput () {
            // 清空搜索框，并重新获取数据
            this.getUsersMsaages()
        },

        resetForm () {
            // 清空表单
            this.$refs.addFormRef.resetFields()
        },

        userInfoValidate () {
            // 添加用户对话框
            this.$refs.addFormRef.validate( async valid => {
                if ( !valid ) return
                // 添加用户的网路请求
                let { data: response } = await request({
                    method: 'post',
                    url: 'users',
                    data: this.addUserInfoForm
                })

                if ( response.meta.status !== 201 ) return this.$toast.error( response.meta.msg )
                this.$toast.success( '数据添加成功' )
                this.addDialogVisible = false
                this.getUsersMsaages()
            } )
        },

        async showEditDialog ( id ) {
            // 编辑对话框

            console.log( id );
            let { data: response } = await request({
                method: 'get',
                url: `users/${ id }`
            })

            if ( response.meta.status !== 200 ) return this.$toast.error( response.meta.msg )
            this.editUserInfo = response.data
            this.editDialogVisible = true
        },

        editDialogClose () {
            // 对话框关闭 还原数据
            this.$refs.editFormRef.resetFileds()
        },

        editUserInfoValidateAndSubmit () {
            this.$refs.editFormRef.validate( async valid => {
                if ( !valid ) return

                let { data: response } = await request({
                    method: 'put',
                    url: `users/${ this.editUserInfo.id }`,
                    data: {
                        email: this.editUserInfo.email,
                        mobile: this.editUserInfo.mobile
                    }
                })

                if ( response.meta.status !== 200 ) return this.$toast.error( response.meta.msg )
                this.$toast.success( '数据修改成功' )
                this.getUsersMsaages()
                this.editDialogVisible = false
            } )
        },

        isDelete ( id ) {
            this.$confirm( '此操作将永久删除用户信息，是否继续', '提示', {
                confirmButtonText: '确定',
                confirmButtonText: '取消',
                type: 'warning'
            } )
            .then( async () => {
                let { data: response } = await request({
                    method: 'delete',
                    url: `users/${ id }`
                })
                if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
                this.$message.success('删除成功')
                this.getUsersMsaages()
            } )
            .catch( () => {
                this.$message.info('已取消删除')
            } )
        }
    }
}
</script>

<style lang="less" scoped>
    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
</style>
