$(function(){
    init();
    let $plan = $.Callbacks()//用来实现发布订阅
    $plan.add((power)=>{//订阅 "userhandle|departhandle|jobhandle|customerall"
           console.log(power)
           let str = ``;
           //默认显示客户管理
           if(power.includes("customerall")){
            str +=`
             <div class="itemBox" text="客户管理">
                 <h3><i class="iconfont icon-yuangong"></i>客户管理</h3>
                 <nav class="item">
                     <a href="page/customerlist.html" target="iframeBox">我的客户</a>
                     <a href="page/customerlist.html" target="iframeBox">客户列表</a>
                     <a href="page/customeradd.html" target="iframeBox">新增客户</a>
                 </nav>
             </div>
             `
            }
            $('.menuBox').html(str)

           $("#zuzhi").click(function(){
               str=``;
              
            $(this).addClass("active").siblings().removeClass('active')
            if(power.includes("userhandle")){
           str +=`
            <div class="itemBox" text="员工管理">
				<h3><i class="iconfont icon-yuangong"></i>员工管理</h3>
				<nav class="item">
					<a href="page/userlist.html" target="iframeBox">员工列表</a>
					<a href="page/useradd.html" target="iframeBox">新增员工</a>
				</nav>
			</div>
            `
           }
            if(power.includes("departhandle")){
            str +=`
             <div class="itemBox" text="部门管理">
                 <h3><i class="iconfont icon-yuangong"></i>部门管理</h3>
                 <nav class="item">
                     <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
                     <a href="page/departmentadd.html" target="iframeBox">新增部门</a>
                 </nav>
             </div>
             `
            }
             if(power.includes("jobhandle")){
                str +=`
                 <div class="itemBox" text="职位管理">
                     <h3><i class="iconfont icon-yuangong"></i>职位管理</h3>
                     <nav class="item">
                         <a href="page/joblist.html" target="iframeBox">职位列表</a>
                         <a href="page/jobadd.html" target="iframeBox">新增职位</a>
                     </nav>
                 </div>
                 `
             }
             $('.menuBox').html(str)
             //判断用户是否有权限
             let text = $(this).html().trim();
             //意思是点击了但是power中没有这个权限
             if((text === "客户管理") && !/customerall/.test(power) || (text ==="组织结构") && !/(userhandle|departhandle|jobhandle)/.test(power)){
                  alert('没有访问权限!');
                return
             }
             
           })
          
           $('#kehu').click(function(){
            str=``;
            $(this).addClass("active").siblings().removeClass('active')
               if(power.includes("customerall")){
                str +=`
                 <div class="itemBox" text="客户管理">
                     <h3><i class="iconfont icon-yuangong"></i>客户管理</h3>
                     <nav class="item">
                         <a href="page/customerlist.html" target="iframeBox">我的客户</a>
                         <a href="page/customerlist.html" target="iframeBox">客户列表</a>
                         <a href="page/customeradd.html" target="iframeBox">新增客户</a>
                     </nav>
                 </div>
                 `
                }

                $('.menuBox').html(str)
                let text = $(this).html().trim();
             if((text === "客户管理") && !/customerall/.test(power) || (text ==="组织结构") && !/(userhandle|departhandle|jobhandle)/.test(power)){
                  alert('没有访问权限!');
                return
             }
           })
            
    })
    //控制iframe的默认src
    $plan.add((power)=>{
        let url = "page/customerlist.html";
        if(power.includes("customerall")){
            $(".iframeBox").attr('src',url)
        }
    })
    $plan.add((_,baseInfo)=>{
        console.log(baseInfo)
         $('.baseBox>span').html(`你好,${baseInfo.name || ""}`)
        //  console.log(0000)
    })

    
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
        power.code === 0? power=power.power:null;
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