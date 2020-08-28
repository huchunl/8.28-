
axios.defaults.baseURL = "http://localhost:8888";
//数据以表单的格式提交
axios.defaults.headers['Content-Type']='application/x-www-form-urlencoded';

//提交的表单内容格式规整
axios.defaults.transformRequest = function(data){
    if(!data) return data;
    let result = "";
    for(let attr in data){
        if(!data.hasOwnProperty(attr)) break ;
        result += `&${attr}=${data[attr]}`;
    }
    return result.substring(1)
}

//配置相应拦截器
axios.interceptors.response.use(response=>{
    return response.data;
},reason=>{
    console.log(reason)

    return Promise.reject(reason)
})