<template>
    <div id="rights">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="rightsList" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
                        <el-tag v-else-if="scope.row.level == 2" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { request } from 'network/request.js'

export default {
    data () {
        return {
            rightsList: [],
            type: 'list'
        }
    },
    created () {
        this.getRightsList()
    },
    methods: {
        async getRightsList () {
            let { data: response } = await request({
                method: 'get',
                url: `rights/${ this.type }`,
            })

            if ( response.meta.status !== 200 ) return this.$message.error( response.meta.msg )
            this.rightsList = response.data
            console.log( this.rightsList );
        }
    }
}
</script>

<style lang="less" scoped>

</style>
