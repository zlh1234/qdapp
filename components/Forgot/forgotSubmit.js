mui.plusReady(function(){
	mui.init();
	
	//如果验证码存在就删除
	plus.storage.removeItem('forgotCode');
	
	/*
	 * 确定提交
	 */
	document.getElementById('queryBtn').addEventListener('tap',function(){
		var _this = this;
		mui(_this).button('loading');
		//隐藏键盘
		plus.key.hideSoftKeybord();
		
		var usermail = plus.storage.getItem('forgotMail');
		var password = document.getElementById('password');
		var passwordOk = document.getElementById('passwordOk');
		
		if(password.value.trim().length < 6 || passwordOk.value.trim().length < 6){
			plus.nativeUI.alert('不能为空格且须大于6位!', null, '提示', '确定');
			mui(_this).button('reset');
			return
		}
		if(password.value != passwordOk.value){
			plus.nativeUI.alert('两次密码不一致!', null, '提示', '确定');
			mui(_this).button('reset');
			return
		}
		mui.ajax(HTTP_URL+'user/updatePwd?t='+Math.random(),{
			data:{
				"usermail":usermail,
				"password":password.value.trim()
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:15000,//超时时间设置为10秒；
			success:function(data){
				mui(_this).button('reset');
				if(data.code===0){
					mui.toast('修改成功');
					password.value = '';
					passwordOk.value = '';
					//删除邮箱
					plus.storage.removeItem('forgotMail');
					plus.webview.close('forgot.html','none');
					var loginPage = plus.webview.getLaunchWebview();
					plus.webview.show(loginPage,'pop-in');
				}else{
					mui.toast(data.message);
				}
			},
			error:function(xhr,type,errorThrown){
				mui(_this).button('reset');
				plus.nativeUI.alert('修改失败,服务器错误!', null, '错误', '确定');
			}
		});
		
	});
})