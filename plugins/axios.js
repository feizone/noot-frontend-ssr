export default function ({ $axios, redirect }) {
    $axios.onRequest(config => {
        console.log(new Date() + 'Making request to ' + config.baseURL + config.url);
    })
    $axios.onResponse(response => response.data);
    $axios.onResponseError(error => {
        const response = error.response;
        const code = response.status;
        const data = response.data;

        // 根据返回的code值来做不同的处理(和后端约定)
        switch (code) {
            case 401:
                redirect('/login')
                break;
            case 400:
                redirect('/login')
                break;
            case 500:
                if (typeof window !== window)
                if (data.message !== null) {
                    Message.error(data.message);
                } else {
                    Message.error("未知错误");
                }
                break;
            default:
                break;
        }
        return data;
    })
}
