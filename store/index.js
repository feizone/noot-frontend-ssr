import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import util from '~/libs/util';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 状态
      
    },
    mutations: {
        // 改变方法
    },
    actions: {
        async nuxtServerInit({ commit }, { req, app, route, redirect }) {
            const currentPath = route.path;
            const cookieName = 'access_token';
            const stringCookie = decodeURI(req.headers.cookie);
            if (!stringCookie || stringCookie.indexOf('access_token') === -1) {
                store.commit('logout');
                if (currentPath !== '/login') {
                    return redirect('/login')
                } else {
                    return false;
                }
            }
            const strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
            let token = unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
            store.commit('setToken', token);
            
            if (route.query.validToken) return;
            let res = await app.$axios.api.userInfo();
            if (res.message !== 'success') {
                if (currentPath !== '/login') {
                    store.commit('setTokenValid', false);
                    return redirect('/login');
                }
            } else {
                store.commit('setInfo', res.data);
                store.commit('setTokenValid', true);
                res = await app.$axios.api.getMenuList();
                let menuData = res.data || [];
                const constRoutes = [];
                util.initRouterNode(constRoutes, menuData);
                store.commit('setMenulist', constRoutes.filter(item => item.children.length > 0));

                let tagsList = [];
                store.state.app.routers.map((item) => {
                    if (item.children.length <= 1) {
                        tagsList.push(item.children[0]);
                    } else {
                        tagsList.push(...item.children);
                    }
                });
                store.commit('setTagsList', tagsList);
                return redirect('/business/home');
            }
        }
    },
    modules: {
        app,
        user
    }
});

export default () => store;