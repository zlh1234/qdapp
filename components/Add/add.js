mui.plusReady(function(){
	var dtPicker = new mui.DtPicker({type:'date'});//日期选择器
	
	var listname = document.getElementById('listname');//名称
	var listremark = document.getElementById('listremark');//备注
	
	var endStatus = document.getElementById('endStatus');//开关状态显示
	var dataContent = document.getElementById('dataContent');//结束时间块显示隐藏
	var endDate = document.getElementById('endDate');//结束时间显示
	
	var dataSwitchBtn = document.getElementById('dataSwitch');//开关按钮
	var selectDateBtn = document.getElementById('selectDate');//选择按钮
	var createBtn = document.getElementById('create');//创建按钮
	var aaaBtn = document.getElementById('aaa');
	var loading = document.getElementById('loading');//加载
	var endtimestamp = 0;//记录结束时间戳
	
	/*
	 * 开关按钮
	 */
	dataSwitchBtn.addEventListener('tap',function(){
		var isActive = this.classList.contains("mui-active");
		if(isActive){
			//打开状态
			endStatus.innerHTML = '';
			var t = getTime('date');
			endDate.innerHTML = t;
			endtimestamp = timestamp(t);
		   	dataContent.style.height = '40px';
		}else{
			//关闭状态 
			endtimestamp = 0;
			endStatus.innerHTML = '无';
		   	dataContent.style.height = '0px';
		}
	});
	
	/*
	 * 选择日期
	 */
	selectDateBtn.addEventListener('tap',function(){
		dtPicker.show(function (v) {
	        var endtime = v.y.value + '-' + v.m.value + '-' + v.d.value;
	        var d = timestamp(endtime);
	        endtimestamp = d;
	        endDate.innerHTML = endtime;
	   	});
	});
	
	/*
	 * 创建按钮
	 */
	createBtn.addEventListener('tap',function(){
		var userinfo = JSON.parse(plus.storage.getItem('userinfo'));
		var md = {
			"userid":userinfo.user_id,
			"listname":listname.value,
			"listremark":listremark.value,
			"listendtime":endtimestamp
		};
		if(listname.value.trim() == ""){
			mui.toast('名称不能为空!');
		}else{
			loading.className = "loading show";
			mui.ajax(HTTP_URL+'lists/addList?t='+Math.random(),{
				data:md,
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:15000,//超时时间设置为10秒；
				success:function(data){
					loading.className = "loading";
					mui.toast('添加成功');
					var is = document.getElementById('dataSwitch').classList.contains("mui-active");
					listname.value = '';
					listremark.value = '';
					endtimestamp = 0;
					dataContent.style.height = '0px';
					if(is) mui("#dataSwitch").switch().toggle();
					
					var homePage = plus.webview.getWebviewById('home.html');
					mui.fire(homePage,'homeLoad',{'id':'home'})
					mui.back();
				},
				error:function(xhr,type,errorThrown){
					console.log(xhr,type,errorThrown);
					loading.className = "loading";
					plus.nativeUI.alert('服务器错误!', null, '错误', '确定');
				}
			});
		}
	});
});