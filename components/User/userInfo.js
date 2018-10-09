mui.plusReady(function(){
	var vm = new Vue({
		el:'#userinfo',
		data:{
			actIndex:'',//当前选择的头像下标
			username:'',
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
	window.addEventListener('userInfoLoad',function(){
		vm.actIndex = JSON.parse(plus.storage.getItem('userinfo')).user_avatar;
		vm.username = JSON.parse(plus.storage.getItem('userinfo')).user_nickname;
	});
	var mask = mui.createMask();//callback为用户点击蒙版时自动执行的回调；
	var oSelectAvatar = document.getElementById('avatarWrap');//头像选择块

	/*
	 * 点击头像 显示头像选择
	 */
	document.getElementById('updateAvatar').addEventListener('tap',function(){
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
		console.log(vm.actIndex);
	});
	/*
	 * 关闭按钮
	 */
	document.getElementById('close').addEventListener('tap',function(){
		mask.close();
		oSelectAvatar.className = 'avatarWrap';
	});
	
	/*
	 * 确定保存
	 */
	document.getElementById('query').addEventListener('tap',function(){
		var _this = this;
		//按钮开启loading
		mui(_this).button('loading');
		var userid = JSON.parse(plus.storage.getItem('userinfo')).user_id;
		if(userid){
			var avatar = vm.actIndex;
			var username = vm.username;
			mui.ajax(HTTP_URL+'user/updateUserinfo?t='+Math.random(),{
				data:{
					userid:userid,
					username:username,
					userAvatar:avatar
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:15000,//超时时间设置为10秒
				success:function(data){
					mui(_this).button('reset');
					var userinfo = JSON.parse(plus.storage.getItem('userinfo'));
					userinfo.user_avatar = avatar;
					userinfo.user_avatarUrl = HTTP_WWW + '/myapp/public/static/avatar/tx'+avatar+'.jpg';
					userinfo.user_nickname = username;
					plus.storage.setItem('userinfo',JSON.stringify(userinfo));
					var userPage = plus.webview.getWebviewById('user.html');
					mui.fire(userPage,'userLoad',{
						_id:'user'
					});
					mui.back();
				},
				error:function(xhr,type,errorThrown){
					mui(_this).button('reset');
					plus.nativeUI.alert('服务器错误!', null, '错误', '确定');
					console.log(xhr,type,errorThrown);
				}
			});
		}
	});
});