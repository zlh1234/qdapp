mui.plusReady(function(){
	mui.init();
	/*
	 * 确定提交
	 */
	document.getElementById('queryBtn').addEventListener('tap',function(){
		var _this = this;
		mui(_this).button('loading');
		//隐藏键盘
		plus.key.hideSoftKeybord();
		
		var oldPassword = document.getElementById('oldPassword');
		var password = document.getElementById('password');
		var passwordOk = document.getElementById('passwordOk');
		
		var userid = JSON.parse(plus.storage.getItem('userinfo')).user_id;
		
		if(password.value.trim().length < 6 && oldPassword.value.trim().length < 6){
			plus.nativeUI.alert('密码必须6位以上!', null, '提示', '确定');
			mui(_this).button('reset');
			return
		}
		if(password.value != passwordOk.value){
			plus.nativeUI.alert('两次密码不一致!', null, '提示', '确定');
			mui(_this).button('reset');
			return
		}
		
		mui.ajax(HTTP_URL+'user/updatePass',{
			data:{
				userid:userid,
				oldPass:oldPassword.value,
				newPass:password.value
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:15000,//超时时间设置为10秒；
			success:function(data){
				mui(_this).button('reset');
				mui.toast(data.message);
				if(!data.code){
					oldPassword.value = '';
					password.value = '';
					passwordOk.value = '';
					mui.back();
				}
			},
			error:function(xhr,type,errorThrown){
				mui(_this).button('reset');
				plus.nativeUI.alert('修改失败,服务器错误!', null, '错误', '确定');
			}
		});
	});
});