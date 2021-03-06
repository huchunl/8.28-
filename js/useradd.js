$(function(){

    //获取编辑部分传递过来的id
    let userId = null;
    let params = window.location.href.queryURLParams();//utils中的接收页面传递参数的方法
    // alert(params)
    // console.log(params)
    if(params.hasOwnProperty("id")){
        userId = params.id
        //实现数据回显
        getBaseInfo()
    }
    //数据回显
   async  function  getBaseInfo(){
        let result = await axios.get("/user/info",{
            params:{userId}
        })
        console.log(result)
        if(result.code ===0){
            result=result.data;
            $('.username').val(result.name);
            result.sex == 0 ? $("#man").prop('checked',true) :$("#woman").prop('checked',true)
            $('.useremail').val(result.email);
            $('.userphone').val(result.phone);
            $('.userdepartement').val(result.departmentId);
            $('userjob').val(result.jobId);
            $('.userdesc').val(result.desc);
            return;
        }
        alert('网络不好稍后再试');
        userId =null;//没有显示成功,就清空userId然后继续执行

    }

    initDepAndJob();
   async function initDepAndJob(){
    let departmentData = await queryDepart();
    let jobData = await queryJob();
    // console.log(departmentData);
    // console.log(jobData)

    if(departmentData.code === 0){
        departmentData=departmentData.data;
        let str=``;
        departmentData.forEach(item=>{
            str+=`<option value="${item.id}">${item.name}</option>`;
        });
        $('.userdepartment').html(str)
    }

    if(jobData.code === 0){
        jobData=jobData.data;
        let str=``;
        jobData.forEach(item=> {
            str+=`<option value="${item.id}">${item.name}</option>`;
        });
        $('.userjob').html(str)
    }
}
//用户名校验
    // $('.username').blur(
        function checkname(){
        let val = $(".username").val().trim();
        if(val.length ===0){
            $('.spanusername').html('用户名不能为空')
            return false;
        }
        //用户名必须是2-10个字
        if(!/^[\u4e00-\u9fa5]{2,10}$/.test(val)){
            $('.spanusername').html('用户名必须是2-10个字');
            return false;
        }
        $('.spanusername').html('用户名ok');
        return true;
    }
    // })
//邮箱验证
    // $('.useremail').blur(
        function checkemail(){
        let val = $(".useremail").val().trim();
        if(val.length ===0){
            $('.spanuseremail').html('邮箱不能为空')
            return false;
        }
        if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)){
            $('.spanuseremail').html('请输入正确的邮箱');
            return false;
        }
        $('.spanuseremail').html('邮箱ok');
            return true;
    }
    // })
//手机验证
    // $('.userphone').blur(
       function checkphone(){
        let val = $(".userphone").val().trim();
        if(val.length ===0){
            $('.spanuserphone').html('手机号不能为空')
            return false;
        }
        if(!/^1[3456789]\d{9}$/.test(val)){
            $('.spanuserphone').html('请输入正确的手机号');
            return false;
        }
        $('.spanuserphone').html('手机号ok');
            return true;
    }
    // })

    $('.username').blur(checkname)
    $('.useremail').blur(checkemail)
    $('.userphone').blur(checkphone)

//提交内容
    $('.submit').click(  async function(){
        if(!checkname() || !checkphone() || !checkemail()){
            alert('输入内容不合法');
            return
        }
        let params ={
            name:$('.username').val().trim(),
            sex:$('#man').prop('checked')? 0:1,
            email:$('.useremail').val().trim(),
            phone:$('.userphone').val().trim(),
            department:$('.userdepartment').val(),
            jobId:$('.userjob').val(),
            desc:$('.userdesc').val().trim()
        }
        // console.log(params)

        //判断是编辑还是新增
        if(userId){
            //编辑
            params.userId = userId
            let result = await axios.post('/user/update',params)
            if(result.code ===0){
                alert('修改员工成功')
                window.location.href = 'userlist.html'
                return
            }
            alert('网络不好稍后再试')
            return
        }
        //实现新增
        let result = await axios.post('/user/add',params)
        if(result.code ===0){
            alert('添加员工成功')
            window.location.href = 'userlist.html'
            return
        }
        alert('网络不好稍后再试')
    })
})