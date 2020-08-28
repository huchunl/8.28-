$(function(){
    
    let $plan = $.Callbacks()//用来实现发布订阅
    $plan.add((power)=>{//订阅 
           console.log(power)
    })
    $plan.add((_,baseInfo)=>{
        console.log(baseInfo)
         $('.baseBox>span').html(`你好,${baseInfo.name || ""}`)
        //  console.log(0000)
    })

    init();
   async function init(){
        let result = await axios.get("/user/login");
        // console.log(result)
        console.log(999)
        if(result.code !=0){
            alert('你尚未登陆！')
            window.location.href="login.html";
            return
        }

        //用户已经登录  发送两个请求
       
        let [power,baseInfo] = await axios.all([
            axios.get("/user/power"),//获取用户权限
            axios.get('/user/info')//获取用户信息
        ])

       baseInfo.code === 0 ? baseInfo=baseInfo.data :null;
       $plan.fire(power,baseInfo)//发布   （必须确保.fire和得到的数据在同一个块这样才可以获得数据并把数据传给事件池）相当于拿到power,baseInfo两个值，然后通过fire同时调用外边事件池里的事件
    }

    //退出登录
    $('.baseBox>a').click( async function(){
      let res = await axios.get('/user/signout');
      if(res.code ==0){
          alert('退出成功');
          window.location.href="login.html";
          return
      }
      alert('退出失败')
    })
})