$(function(){
    //复选框
    let checkList = null;
    //显示部门
    initDepartment()
    async function initDepartment(){
        let result = await queryDepart();
        if(result.code === 0){
            let str = ``;
            result.data.forEach(item => {
                str+=`<option value="${item.id}">${item.name}</option>`
            });
            $('.selectBox').html(str)
        }
    }
    //显示列表
    showUsesrlist();
    async function showUsesrlist(){
        console.log('55555')
        let params = {
            departmentId:$('.selectBox').val(),
            search:$('.searchInp').val().trim()
        }
        let result = await axios.get('/user/list',{params})
        console.log(result)
        if(result.code !=0) return;
        let str= ``;
        result.data.forEach(item=>{
            // console.log(item)
            // let {
            //     id,name,sex,email,phone,department,job,desc
            // } = item;
            // console.log(typeof item);
            str+=`<tr>
            <td class="w3"><input type="checkbox" userid = ${item.id}></td>
            <td class="w10">${item.name}</td>
            <td class="w5">${item.sex == 0? '男':'女'}</td>
            <td class="w10">${item.department}</td>
            <td class="w10">${item.job}</td>
            <td class="w15">${item.email}</td>
            <td class="w15">${item.phone}</td>
            <td class="w20">${item.desc}</td>
            <td class="w12" userid=${item.id}>
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
                <a href="javascript:;">重置密码</a>
            </td>
        </tr>

            `
            $('tbody').html(str)

            //给复选框赋值
            checkList = $('tbody').find('input[type = "checkbox"]')
        })
    }
    //根据条件显示员工列表
    searchHandle();
    function searchHandle(){
        $(".selectBox").change(showUsesrlist);
        $('.searchInp').on('keydown',e=>{
            // console.log("ppppp")
            if(e.keyCode === 13){//回车
                showUsesrlist();
            }
        })
    }

    //实现编辑,删除，重置密码
    delegate()
   function delegate(){
        $('tbody').on('click','a', async function(e){
            let target = e.target,
                tag = target.tagName,
                text = target.innerHTML.trim();
                // console.log(text)
                if(tag ==="A"){
                   //当前标签的父元素的userid属性
                let userId = $(target).parent().attr('userid')
                if(text === "编辑"){
                 //跳转页面到添加页面 并传递参数
                 window.location.href = `useradd.html?id=${userId}`
                    return
                }
                if(text === "删除"){
                    // console.log('pppp')
                    let flag = confirm("你确定要删除么？")
                    if(!flag) return;
                    let result = await axios.get("/user/delete",{
                        params:{userId}
                    })
                    if(result.code === 0){
                        
                        $(target).parent().parent().remove();
                        alert("删除成功");
                        //删除成功后给复选框重新赋值
                         checkList = $('tbody').find('input[type = "checkbox"]')
                        return;
                    }
                    return;
                }
                if(text === "重置密码"){
                    let flag = confirm("你确定要重置么？")
                    if(!flag) return;
                    let result = await axios.post("/user/resetpassword",{
                        userId
                    })
                    if(result.code === 0){
                        alert("重置密码成功，请告诉你的员工");
                        return;
                    }
                    return;
                }
            }
        })
    }

    //复选框的选中
    //全选反选
    selectHandle()
    function selectHandle(){
        $('#checkAll').click(function(){
            let checked = $("#checkAll").prop('checked')//checked的值为true or false
            checkList.prop("checked",checked)
        })
        //当所有小框框都选中让全选的框也选中
    $('tbody').on('click',"input",function(e){
        if(e.target.tagName ==="INPUT"){
            let flag = true;
            newCheckout = Array.from(checkList)//把伪数组转化为数组 
            newCheckout.forEach(item=>{
                if(!$(item).prop('checked')){
                    flag=false;
                }
                $("#checkAll").prop('checked',flag)
            })
        }
    })

    }

    
    //批量删除
    $(".deleteAll").click(function(e){
        let arr =[];
        [].forEach.call(checkList,item=>{
            if($(item).prop('checked')){
                // console.log($(item))
                arr.push($(item).attr('userid'))
            }
        })
        // console.log(arr);
        if(arr.length ==0){
            alert("你需要选中数据");
            return
        }
        //开始删除
        let flag = confirm("你确定要删除这些用户吗");
        if(!flag) return; //删除时点击取消

        //删除部分 利用递归
        let index = -1;
        async function deleteUser(){
            let userId = arr[++index];
            if(index>=arr.length){//递归函数的出口
                alert("已经成功删除员工");
                showUsesrlist();
                return;
            }

            let result = await axios.get("/user/delete",{
                params:{userId}
            })
            if(result.code !=0){
                alert("删除失败");
                return;
            }
            deleteUser()  
        }
        deleteUser()
    })
})