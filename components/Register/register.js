mui.plusReady(function(){
	mui.init();
	
	var timer = null;//定时器
	var num = 60;//倒计时60秒
	var oNext = document.getElementById('next');//下一步按钮
	var oCodeBtn = document.getElementById('codeBtn');//获取验证码按钮
	var oUsermail = document.getElementById('usermail');//邮箱输入框
	var oCode = document.getElementById('code');//验证码输入框
	/*
	 * 下一步
	 * 须验证邮箱与验证码是否与storage里的相同
	 * storage {identifyingMail} {identifyingCode}
	 */
	oNext.addEventListener('tap',function(){
		/*mui.openWindow({
			url:'./regSubmit.html',
			id:'./regSubmit.html'
		});*/
		var _this = this;
		//输入框失去焦点
		oUsermail.blur();
		oCode.blur();
		//隐藏键盘
		plus.key.hideSoftKeybord();
		
		var usermail = oUsermail.value;
		var code = oCode.value;
		var storageMail = plus.storage.getItem('identifyMail') || '';
		var storageCode = plus.storage.getItem('identifyCode') || '';
		console.log(storageCode);
		if(usermail.trim() == "" || code.trim() == ""){
			mui.alert('不能为空!','提示','确定',null,'div');
			return;
		}
		if(storageCode.trim() == ""){
			mui.alert('请先获取验证码!','提示','确定',null,'div');
			return;
		}
		if(usermail != storageMail){
			mui.alert('邮箱不正确!','提示','确定',null,'div');
			return;
		}else if(code.toLowerCase() != storageCode.toLowerCase()){
			mui.alert('验证码不正确!','出错','确定',null,'div');
			return;
		}else{
			mui.openWindow({
				url:'./regSubmit.html',
				id:'./regSubmit.html',
				styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
				    titleNView: {                       // 窗口的标题栏控件
				      titleText:"填写信息",                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
				      titleColor:"#333333",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
				      titleSize:"17px",                 // 字体大小,默认17px
				      backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
				      splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
				        color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
				        height:"1px"                    // 分割线高度,默认值为"2px"
				      },
				      autoBackButton:true
				    }
				}
			});
		}
	});
	
	/*
	 * 获取验证码并存入storage
	 */
	oCodeBtn.addEventListener('tap',function(e){
		e.stopPropagation();
		var _this = this;
		
		var usermail = oUsermail.value;
		var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(usermail);
		if(!reg){
			mui.alert('邮件格式不对!','提示','确定',null,'div');
		}else{
			//开始倒计时
			_this.disabled=true;
			clearInterval(timer);
			tick.bind(_this);//开始倒计时
			timer = setInterval(tick.bind(_this),1000);
			mui.ajax(HTTP_URL+'user/checkUser?t='+Math.random(),{
				data:{"usermail":usermail},
				type:'post',//HTTP请求类型
				dataType:'json',
				crossDomain:true,
				timeout:15000,//超时时间设置为15秒；
				headers:{'Content-Type':'application/json'},
				success:function(data){
					if(data.code===0){
						plus.storage.setItem('identifyMail',usermail);
						plus.storage.setItem('identifyCode',data.identifyCode);
					}else{
						clearInterval(timer);
						_this.disabled = false;
						_this.innerHTML = '获取';
						num = 60;
						mui.toast(data.message);
					}
				},
				error:function(xhr,type,errorThrown){
					mui.alert('获取失败,未知错误!','超时','确定',null,'div');
					clearInterval(timer);
					_this.disabled = false;
					_this.innerHTML = '获取';
					num = 60;
					console.log(xhr,type,errorThrown);
				}
			});
		}
	});
	
	/*
	 * 倒计时
	 * @return {false} 时间到了关闭定时器
	 */
	function tick(){
		if(num == 0){
			this.disabled = false;
			this.innerHTML = '获取';
			num = 60;
			clearInterval(timer);
			return false;
		}
		this.innerHTML = num+'秒';
		num--;
	}
	
	
});