import Cookies from 'js-cookie';

const user = {
    state: {
        info: {},
        token: '',
        menuList: [],
        tokenValid: true,
        whiteApiList: [],
        fetchedMenu: false,
    },
    mutations: {
        cleanInfo(state, routes) {
            state.info = {},
            state.token = '',
            state.menuList = [],
            state.tokenValid = true,
            state.whiteApiList = [],
            state.fetchedMenu = false
        },
        setMenulist(state, routes) {
            state.menuList = routes;
            state.fetchedMenu = true;
            state.tokenValid = true;
            const tmp = [];
            routes.forEach(element => {
                if (element.children && element.children.length > 0) {
                    element.children.forEach(second => {
                        if (second.children && second.children.length > 0) {
                            second.children.forEach(third => {
                                tmp.push({
                                    title: third.title,
                                    url: third.path,
                                    path: second.path,
                                    method: third.method,
                                });
                            })
                        }
                    })
                }
            });
            state.whiteApiList= tmp;
        },
        logout (state, vm) {
            Cookies.remove('access_token');
            state.info = {};
            state.token = '';
            state.menuList = [];
            state.fetchedMenu = false;
            state.tokenValid = true;
        },
        setInfo (state, info) {
            state.info = info;
        },
        setToken (state, token) {
            state.token = token;
            console.log('set token');
         },
         setTokenValid (state, bool) {
             state.tokenValid = bool
         }
    },
};

export default user;
