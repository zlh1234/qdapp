
mui.plusReady(function(){
	mui.init();
	window.addEventListener('loginCloseView',function(){
		var allWeb = plus.webview.all();
		for (var i = 0;i<allWeb.length;i++) {
			if(allWeb[i].id !='H53EE7709'){
				plus.webview.hide(allWeb[i],'slide-out-right',0);
			}
		}
	});
	
	var oLogo = document.querySelector('.logo');
	var timerID = null;
	plus.screen.lockOrientation("portrait-primary");
	var home_loaded_flag = false;
	var homePage = mui.preload({
		url:'../Home/home.html',
		id:'home.html'
	});
	homePage.addEventListener("loaded",function () {
		home_loaded_flag = true;
	});
	var toMain = function() {
		var userinfo = plus.storage.getItem('userinfo') || '';
		timerID = setInterval(function () {
			if(home_loaded_flag && userinfo != ''){
				clearInterval(timerID);
				mui.fire(homePage, 'homeLoad', null);
				plus.webview.show(homePage,'slide-in-right');
			}
		},20);
	};
	toMain();
	
	//关闭 splash
	setTimeout(function() {
		clearInterval(timerID);
		plus.navigator.closeSplashscreen();
	}, 600);
	
	window.addEventListener('resize', function() {
		oLogo.style.visibility = document.body.clientHeight > 440 ? 'visible' : 'hidden';
	}, false);
	
	//再按一次退出应用
	var backButtonPress = 0;
	mui.back = function(event) {
		backButtonPress++;
		if (backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
		return false;
	};
	
	/*
	 * 登录按钮
	 */
	document.getElementById('loginBtn').addEventListener('tap',function(){
		var oUsermail = document.getElementById('usermail');
		var oPassword = document.getElementById('password');
		//是否校验成功
		var check = true;
		//按钮实例
		var _this = this;
		
		//输入框失去焦点
		oUsermail.blur();
		oPassword.blur();
		//隐藏键盘
		plus.key.hideSoftKeybord();
		//按钮开启loading
		mui(_this).button('loading');
		//校验表单是否为空
		mui(".mui-input-row input").each(function() {
			if(!this.value || this.value.trim() == "") {
			    mui.toast(this.getAttribute('data-type') + "不允许为空")
			    mui(_this).button('reset');
			    check = false;
			    return false;
			}
		});
		//校验通过
		if(check){
			mui.ajax(HTTP_URL+'user/login?t='+Math.random(),{
				data:{
					"usermail":oUsermail.value,
					"password":oPassword.value
				},
				type:'post',//HTTP请求类型
				crossDomain:true,
				timeout:15000,//超时时间设置为10秒；
				headers:{'Content-Type':'application/json'},
				success:function(data){
					mui(_this).button('reset');
					if(data.code===0){
						//记住密码
						var d = data.user;
//						d.password = oPassword.value;
						plus.storage.setItem('userinfo',JSON.stringify(d));
						//打开详情页面
						mui.fire(homePage,'homeLoad',{
							userid:d.user_id
						});
						plus.webview.show(homePage,'slide-in-right');
						oUsermail.value = '';
						oPassword.value = '';
					}else{
						mui.toast(data.message);
					}
				},
				error:function(xhr,type,errorThrown){
					mui(_this).button('reset');
					mui.toast('未知错误!');
					console.log(xhr,type,errorThrown);
				}
			});
		}
	});
	
	/*
	 * 注册按钮
	 */
	document.getElementById('regBtn').addEventListener('tap',function(){
		mui.openWindow({
			url:'../Register/register.html',
			id:'register.html',
			styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
			    titleNView: {                       // 窗口的标题栏控件
			      titleText:"注册",                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
			      titleColor:"#686868",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
			      titleSize:"16px",                 // 字体大小,默认17px
			      backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
			      splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
			        color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
			        height:"1px"                    // 分割线高度,默认值为"2px"
			      },
			      autoBackButton:true
			    }
			},
			waiting:{
		    	autoShow:true,//自动显示等待框，默认为true
		    	title:'正在加载...',//等待对话框上显示的提示内容
		    }
		});
	});
	
	/*
	 * 忘记密码
	 */
	document.getElementById('forgot').addEventListener('tap',function(){
		mui.openWindow({
			url:'../Forgot/forgot.html',
			id:'forgot.html',
			styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
			    titleNView: {                       // 窗口的标题栏控件
			      titleText:"找回密码",                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
			      titleColor:"#686868",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
			      titleSize:"16px",                 // 字体大小,默认17px
			      backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
			      splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
			        color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
			        height:"1px"                    // 分割线高度,默认值为"2px"
			      },
			      autoBackButton:true
			    }
			},
			waiting:{
		    	autoShow:true,//自动显示等待框，默认为true
		    	title:'正在加载...',//等待对话框上显示的提示内容
		    }
		});
	});
	
	
});