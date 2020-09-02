$(function(){
    let lx ='my';
    let limit = 10;
    let page = 1;
    let totalpage = 1;
    let total = 0;
    let params = window.location.href.queryURLParams();
    params.lx ? lx = params.lx :null;//params.lx为true时执行前半段，false时为空
    // console.log(lx)//此时lx只有my all两种情况，过滤掉了undefind
    showCustomerList();
    async function showCustomerList(){
        let result =await axios.get('/customer/list',{
            params:{
                lx,
                type:$(".selectBox").val(),
                search:$('.searchInp').val().trim(),
                limit,
                page
            }
        })
        //渲染页面
        if(result.code != 0) {return alert('网络不给力，稍后再试')};
        
        // console.log(result)
        //获取总条数 页数
        totalpage = parseInt(result.totalPage)
        total = parseInt(result.total)

        result = result.data;
        let str = ``;
        result.forEach(item => {
            // console.log(item)
            let{
                id,
                name,
                sex,
                email,
                phone,
                QQ,
                weixin,
                type,
                address,
                userName,
            } =item;

            str += `
            <tr>
				<td class="w8">${name}</td>
				<td class="w5">${sex == 0? '男':'女'}</td>
				<td class="w10">${email}</td>
				<td class="w10">${phone}</td>
				<td class="w10">${weixin}</td>
				<td class="w10">${QQ}</td>
				<td class="w5">${type}</td>
				<td class="w8">${userName}</td>
				<td class="w20">${address}</td>
				<td class="w14" customerId ="${id}">
					<a href="javascript:;">编辑</a>
					<a href="javascript:;">删除</a>
					<a href="visit.html?id=${id}">回访记录</a>
				</td>
			</tr>
            `
        })
        $('tbody').html(str)
        if(totalpage>1){
            // console.log("mmmm")
            str=``;
            page >1 ?str += `<a href="javascript:;">上一页</a>` :null;
            str +=`<ul class="pageNum">`;
            for(let i = 1 ;i<=totalpage;i++){
                str +=`<li class="${i==page? 'active':''}">${i}</li>`;
            }
            str +=`</ul>`
            page <totalpage ? str += `<a href="javascript:;">下一页</a>`:null;
            $('.pageBox').html(str)
        }

        
        
    }
    //实现分页
    $('.pageBox').click(e=>{
        let target = e.target,
            tag = target.tagName,//可以获得标签
            text = target.innerHTML,//可以获得内容
            temp = page;

            if(tag ==="A"){
                //实现上一页下一页
                if(text === "上一页"){temp--;}
                if(text === "下一页"){temp++;}
            }
            if(tag =="LI"){
                temp = parseInt(text)//LI标签中的内容也就是当前页数
            }
            //  让page的值发生变化   调用函数显示内容
            temp !==page ?(page = temp,showCustomerList()):null;//有多个内容时，：前边或者后边需要加括号包起来
    });

    //顶层筛选
    handle()
    function handle(){
        $('.selectBox').change(showCustomerList);
        $('.searchInp').on('keydown',e=>{
            // console.log("ppppp")
            if(e.keyCode === 13){//回车
                showUsesrlist();
            }
        })
    }
})