import axios from "axios";

export function request ( config ) {
    const instance = axios.create( {
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 5000
    } )

    // 请求拦截
    instance.interceptors.request.use( config => {
        // 为请求对象，添加 Token 验证的 Authorization 字段
        config.headers.Authorization = window.sessionStorage.getItem( 'token' )
        return config
    } )

    return instance( config )
}
