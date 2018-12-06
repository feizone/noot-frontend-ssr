import { Message } from 'iview';
import urlCompare from 'path-to-regexp'

const commonApi = [{
    url: '/api/v1/account/info',
    method: 'GET',
}, {
    url: '/api/v1/permission/menu',
    method: 'GET'
}, {
    url: '/api/v1/passport/token',
    method: 'POST'
}, {
    url: '/api/v1/business/record/total',
    method: 'GET'
},{
    url: '/api/v1/business/user/record/del',
    method: 'POST'
}]
export default function ({ $axios, store, route }) {
    function checkApiPathValid(url, method, func) {
        let flag = false;
        store.state.user.whiteApiList.concat(commonApi).forEach(item => {
            const parse = urlCompare(item.url);
            if (parse.exec(url) && method === item.method) {
                flag = true;
            }
        })
        if (flag) {
            return Promise.resolve(func)
        } else {
            const message = `无此操作权限,请联系管理员开启权限`;
            if (typeof window !== 'undefined') {
                Message.error(message);
            }
            return Promise.reject({ message });
        }
    }
    $axios.defaults.timeout = 15000;
    const getRequest = (url, params) => {
        const token = store.state.user.token;
        $axios.defaults.headers.get['Content-Type'] = 'application/json';
        $axios.defaults.headers.get['Authorization'] = `Bearer ${token}`;
        return checkApiPathValid(url, 'GET', $axios.get(url, { params: { ...params }}));
    };

    const postRequest = (url, params) => {
        const token = store.state.user.token;
        $axios.defaults.headers.post['Content-Type'] = 'application/json';
        $axios.defaults.headers.post['Authorization'] = `Bearer ${token}`;
        return checkApiPathValid(url, 'POST', $axios.post(url, { ...params }));
    };

    const putRequest = (url, params) => {
        const token = store.state.user.token;
        $axios.defaults.headers.put['Content-Type'] = 'application/json';
        $axios.defaults.headers.put['Authorization'] = `Bearer ${token}`;
        console.log(params);
        return checkApiPathValid(url, 'PUT', $axios.put(url,{ ...params }));
    };

    const deleteRequest = (url, params) => {
        const token = store.state.user.token;
        $axios.defaults.headers.delete['Content-Type'] = 'application/json';
        $axios.defaults.headers.delete['Authorization'] = `Bearer ${token}`;
        return checkApiPathValid(url, 'DELETE', $axios.delete(url, { ...params }));
    };

    $axios.api = {
        login: (params) => {
            return postRequest('/api/v1/passport/token', params)
        },
        userInfo: (params) => {
            return getRequest('/api/v1/account/info', params)
        },
        regist: (params) => {
            return postRequest('/api/v1/account/register', params)
        },
        initCaptcha: (params) => {
            return getRequest('/api/v1/common/captcha/init', params)
        },
        sendSms: (phone, params) => {
            getRequest(`/common/captcha/sendSms/${phone}`, params)
        },
        smsLogin: (params) => {
            return postRequest('/api/v1/user/smsLogin', params)
        },
        userInfoEdit: (params) => {
            return postRequest('/api/v1/user/edit', params)
        },
        changePass: (params) => {
            return postRequest('/api/v1/user/modifyPass', params)
        },
        getUserListData: (params) => {
            return getRequest('/api/v1/permission/user/admin', params)
        },
        getAllUserData: (params) => {
            return getRequest('/api/v1/user/getAll', params)
        },
        addUser: (params) => {
            return postRequest('/api/v1/permission/user/admin', params)
        },
        editUser: (params) => {
            return putRequest('/api/v1/permission/user/admin', params)
        },
        userUpdatePassword: (params) => {
            return putRequest('/api/v1/user/password', params)
        },
        enableUser: (id, params) => {
            return putRequest(`/permission/user/admin/enable/${id}`, params)
        },
        disableUser: (id, params) => {
            return putRequest(`/permission/user/admin/disable/${id}`, params)
        },
        deleteUser: (ids, params) => {
            return deleteRequest(`/permission/user/admin/${ids}`)
        },
        initDepartment: (params) => {
            return getRequest('/api/v1/permission/department/by/parent/0', params)
        },
        loadDepartment: (id, params) => {
            return getRequest(`/permission/department/by/parent/${id}`, params)
        },
        addDepartment: (params) => {
            return postRequest('/api/v1/permission/department', params)
        },
        editDepartment: (params) => {
            return putRequest('/api/v1/permission/department', params)
        },
        deleteDepartment: (ids, params) => {
            return deleteRequest(`/department/delByIds/${ids}`, params)
        },
        searchDepartment: (params) => {
            return getRequest('/api/v1/department/search', params)
        },
        getAllRoleList: (params) => {
            return getRequest('/api/v1/permission/role/all', params)
        },
        getRoleList: (params) => {
            return getRequest('/api/v1/permission/role', params)
        },
        // 添加角色
        addRole: (params) => {
            return postRequest('/api/v1/permission/role', params)
        },
        // 编辑角色
        editRole: (params) => {
            return putRequest('/api/v1/permission/role', params)
        },
        // 设为或取消注册角色
        setDefaultRole: (params) => {
            return putRequest('/api/v1/permission/role/default', params)
        },
        // 分配角色权限
        editRolePerm: (params) => {
            return postRequest('/api/v1/permission/role/menu', params)
        },
        // 分配角色数据权限
        editRoleDep: (params) => {
            return postRequest('/api/v1/permission/role/department', params)
        },
        // 删除角色
        deleteRole: (ids) => {
            return deleteRequest(`/permission/role/${ids}`)
        },
        // 获取全部权限数据
        getAllPermissionList: (params) => {
            return getRequest('/api/v1/permission/menu/all', params)
        },
        // 
        getMenuList: (params) => {
            return getRequest('/api/v1/permission/menu', params)
        },
        // 添加权限
        addPermission: (params) => {
            return postRequest('/api/v1/permission/menu', params)
        },
        // 编辑权限
        editPermission: (params) => {
            return putRequest('/api/v1/permission/menu', params)
        },
        // 删除权限
        deletePermission: (ids) => {
            return deleteRequest(`/api/v1/permission/menu/${ids}`)
        },
        // 搜索权限
        searchPermission: (params) => {
            return getRequest('/api/v1/permission/menu/search', params)
        },
        userRecordList: (params) => {
            return getRequest('/api/v1/business/user/record', params);
        },
        recordTotal: (params) => {
            return getRequest('/api/v1/business/record/total', params);
        },
        deleteRecord: (params) => {
            return postRequest('/api/v1/business/user/record/del', params);
        }
    }
}
