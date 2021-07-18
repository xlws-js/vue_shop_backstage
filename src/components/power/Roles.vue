<template>
    <div id="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
                </el-col>
            </el-row>

            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="[ 'border-bottom', index1 == 0 ? 'border-top' : '' , 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag @close="removeRightById( scope.row, item1.id )" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[index2 == 0 ? '' : 'border-top', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag @close="removeRightById( scope.row, item2.id )" closable type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag @close="removeRightById( scope.row, item3.id )" closable type="warning" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="285">
                    <template slot-scope="scope">
                        <el-button @click="editRoleInfo( scope.row.id )" icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
                        <el-button @click="deleteRoleInfo( scope.row.id )" icon="el-icon-delete" size="mini" type="danger">删除</el-button>
                        <el-button @click="showSetRoleDialog( scope.row )" icon="el-icon-setting" size="mini" type="warning">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加用户弹框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addRoleVisible"
            width="30%"
            @close="resetForm">
            <el-form ref="addRoleFormRef" :model="addroleInfoForm" label-width="80px" :rules="roleInfoRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addroleInfoForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addroleInfoForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="AddRoleInfoValidateAndSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户弹框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="editRoleVisible"
            width="30%"
            @close="$refs.editRoleFormRef.resetFields()">
            <el-form ref="editRoleFormRef" :model="editRoleInfoForm" label-width="80px" :rules="roleInfoRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleInfoForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleInfoForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="EditRoleInfoValidateAndSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog
            title="权限分配"
            :visible.sync="setRightsDialogVisible"
            width="30%"
            @close="setRightDialogClosed">
            <el-tree
                :data="setRightsInfo"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defkeys"
                ref="treeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rightsInfoSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { request } from 'network/request.js'

export default {
    name: 'Roles',
    data () {
        return {
            rolesList: [],
            addRoleVisible: false,
            addroleInfoForm: {
                roleName: '',
                roleDesc: ''
            },
            roleInfoRules: {
                roleName: [
                    { required: true, message: '角色名不能为空', trigger: 'blur' }
                ],

                roleDesc: [
                    { required: true, message: '角色描述不能为空', trigger: 'blur' }
                ]
            },
            editRoleVisible: false,
            editRoleInfoForm: {},
            setRightsDialogVisible: false,
            setRightsInfo: [],
            defaultProps: {
                label: 'authName',
                children: 'children'
            },
            defkeys: [],
            roleId: ''
        }
    },
    created () {
        this.getRolesList()
    },
    methods: {
        async getRolesList () {
            let { data: response } = await request({
                method: 'get',
                url: 'roles'
            })

            if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
            this.rolesList = response.data
        },

        removeRightById ( role, rightId ) {
            this.$confirm( '此操作将永久删除用户权限', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            } )
            .then( async () => {
                let { data: response } = await request({
                    method: 'delete',
                    url: `roles/${ role.id }/rights/${ rightId }`
                })

                if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
                role.children = response.data
                this.$message.success( '删除成功' )
            } )
            .catch( () => {
                this.$message.info( '已取消删除' )
            } )
        },

        resetForm () {
            this.$refs.addRoleFormRef.resetFields()
        },

        AddRoleInfoValidateAndSubmit () {
            this.$refs.addRoleFormRef.validate( async valid => {
                if ( !valid ) return

                let { data: response } = await request({
                    method: 'post',
                    url: 'roles',
                    data: this.addroleInfoForm
                })

                if ( response.meta.status !== 201 ) return this.$message.error( response.meta.msg )
                this.$message.success( '添加角色成功' )
                this.getRolesList()
                this.addRoleVisible = false
            } )

        },

        async editRoleInfo ( id ) {
            let { data: response } = await request({
                method: 'get',
                url:`roles/${ id }`
            })

            if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
            this.editRoleInfoForm = response.data
            this.editRoleVisible = true
        },

        EditRoleInfoValidateAndSubmit () {
            this.$refs.editRoleFormRef.validate( async valid => {
                if ( !valid ) return
                let { data: response } = await request({
                    method: 'put',
                    url: `roles/${ this.editRoleInfoForm.roleId }`,
                    data: {
                        roleName: this.editRoleInfoForm.roleName,
                        roleDesc: this.editRoleInfoForm.roleDesc
                    }
                })

                if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
                this.$message.success( '修改成功' )
                this.editRoleVisible = false
            } )
        },

        deleteRoleInfo ( id ) {
            this.$confirm( '此操作将永久产出用户信息，是否继续！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            } )
            .then( async () => {
                let { data: response } = await request({
                    method: 'delete',
                    url: `roles/${ id }`
                })

                if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
                this.getRolesList()
                this.$message.success( '删除成功' )
            } )
            .catch( () => {
                this.$message.info( '已取消删除' )
            } )
        },

        async showSetRoleDialog ( role ) {
            this.roleId = role.id
            let { data: response } = await request({
                method: 'get',
                url: `rights/tree`
            })
            if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
            this.setRightsInfo = response.data

            this.getLeafKeys( role, this.defkeys )

            this.setRightsDialogVisible = true
        },

        getLeafKeys ( node, arr ) {
            if ( !node.children ) {
                return arr.push( node.id )
            }

            node.children.forEach( item => {
                this.getLeafKeys( item, arr )
            } )
        },

        setRightDialogClosed () {
            this.defkeys.length = 0
        },

        async rightsInfoSubmit () {
            const idStr = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ].join( "," )

            let { data: response } = await request({
                method: 'post',
                url: `roles/${ this.roleId }/rights`,
                data: {
                    rids: idStr
                }
            })

            if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
            this.$message.success( '权限配置成功' )
            this.getRolesList()
            this.setRightsDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 15px 6px 15px 0;
    }

    .border-top {
        border-top: 1px solid #ccc;
    }

    .border-bottom {
        border-bottom: 1px solid #ccc;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>
