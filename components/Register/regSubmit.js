mui.plusReady(function(){
	var vm = new Vue({
		el:'#regSubmit',
		data:{
			actIndex:1,
			list:[{
					data:[{
							src:'../assets/avatar/tx1.jpg',
							_id:1
						},
						{
							src:'../assets/avatar/tx2.jpg',
							_id:2
						},
						{
							src:'../assets/avatar/tx3.jpg',
							_id:3
						},
						{
							src:'../assets/avatar/tx4.jpg',
							_id:4
						}
					]
				},
				{
					data:[{
							src:'../assets/avatar/tx5.jpg',
							_id:5
						},
						{
							src:'../assets/avatar/tx6.jpg',
							_id:6
						},
						{
							src:'../assets/avatar/tx7.jpg',
							_id:7
						},
						{
							src:'../assets/avatar/tx8.jpg',
							_id:8
						}
					]
				}
			]
		}
	});
	
	mui.init();
	plus.storage.removeItem('identifyCode');
	
	var mask = mui.createMask();//callback为用户点击蒙版时自动执行的回调；
	var oSelectAvatar = document.getElementById('avatarWrap');//头像选择块

	/*
	 * 点击头像 显示头像选择
	 */
	document.getElementById('myAvatar').addEventListener('tap',function(){
		mask.show();//显示遮罩
		oSelectAvatar.className = 'avatarWrap avatarShow';
	});
	/*
	 * 点击要选择的头像
	 */
	mui('.selectAvatar').on('tap','.imgWrap',function(){
		var current = this.getAttribute('data-index');
		vm.actIndex = current;
		mask.close();
		oSelectAvatar.className = 'avatarWrap';
	});
	/*
	 * 关闭按钮
	 */
	document.getElementById('close').addEventListener('tap',function(){
		mask.close();
		oSelectAvatar.className = 'avatarWrap';
	});
	
	/*
	 * 注册按钮
	 */
	document.getElementById('registerBtn').addEventListener('tap',function(){
		var _this = this;
		mui(_this).button('loading');
		//隐藏键盘
		plus.key.hideSoftKeybord();
		var usermail = plus.storage.getItem('identifyMail');
		var avatar = vm.actIndex;
		var nickname = document.getElementById('nickname');
		var password = document.getElementById('password');
		var passwordOk = document.getElementById('passwordOk');
		if(nickname.value.trim() == "" || password.value.trim() == "" || passwordOk.value.trim() == ""){
			mui.alert('不能为空!','提示','确定',null,'div');
			mui(_this).button('reset');
			return
		}
		if(password.value != passwordOk.value){
			mui.alert('两次密码不一致!','提示','确定',null,'div');
			mui(_this).button('reset');
			return
		}
		mui.ajax(HTTP_URL+'user/register?t='+Math.random(),{
			data:{
				"usermail":usermail,
				"avatar":avatar,
				"nickname":nickname.value,
				"password":password.value.trim()
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			crossDomain:true,
			timeout:15000,//超时时间设置为15秒；
			success:function(data){
				mui(_this).button('reset');
				if(data.code===0){
					mui.toast('注册成功!');
					nickname.value = '';
					password.value = '';
					vm.actIndex = 1;
					//删除验证码和邮箱
					plus.storage.removeItem('identifyMail');
					mui.openWindow({
						url:'../Login/login.html',
						id:'login.html'
					});
				}else{
					mui.alert(data.message,'提示','确定',null,'div');
				}
			},
			error:function(xhr,type,errorThrown){
				mui(_this).button('reset');
				mui.alert('注册失败,服务器错误!','错误','确定',null,'div');
			}
		});
	});
	


});