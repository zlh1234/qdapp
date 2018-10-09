
mui.plusReady(function(){
	mui.init();
	
	//预加载
	var updatePass = mui.preload({
		url:'./updatePass.html',
		id:'updatePass.html',
		styles: {                             
		    titleNView: {
			    titleText:"修改密码",
			    titleColor:"#686868",
			    titleSize:"16px",
			    backgroundColor:"#F7F7F7",
			    splitLine:{
			        color:"#CCCCCC",
			        height:"1px"
			    },
			    autoBackButton:true
		    }
		}
	});
	var userInfo = mui.preload({
		url:'./userInfo.html',
		id:'userInfo.html',
		styles: {                             
		    titleNView: {
			    titleText:"修改个人资料",
			    titleColor:"#686868",
			    titleSize:"16px",
			    backgroundColor:"#F7F7F7",
			    splitLine:{
			        color:"#CCCCCC",
			        height:"1px"
			    },
			    autoBackButton:true
		    }
		}
	});
	
	document.getElementById('version').innerHTML = 'v' + plus.runtime.version;
	window.addEventListener('userLoad',function(e){
		var user = JSON.parse(plus.storage.getItem('userinfo'));
		console.log(JSON.stringify(user));
		var userAvatar = document.getElementById('userAvatar');
		var userName = document.getElementById('userName');
		var userLevel = document.getElementById('level');
		var userDay = document.getElementById('userDay');
		
		//头像
		var avatarURL = "url(../assets/avatar/tx"+user.user_avatar.toString()+".jpg)";
		userAvatar.style.backgroundImage = avatarURL;
		
		//用户名与等级
		var lv = Math.floor(user.user_level/100) + 1;
		userLevel.innerHTML = ' lv' + lv;
		userName.innerHTML = user.user_nickname;
		
		//入驻多少天
		var nowTime = Math.round(new Date() / 1000);
		var regTime = user.user_regtime;
		var joinDay = Math.ceil((nowTime-regTime)/86400);
		userDay.innerHTML = '已入驻'+joinDay+'天';
	});
	
	/*
	 * 注销
	 */
	document.getElementById('logout').addEventListener('tap',function(){
		plus.nativeUI.confirm("你确定要注销吗?", function(e){
			if(e.index == 0){
				plus.storage.removeItem('userinfo');
				var loginPage = plus.webview.getLaunchWebview();
				mui.fire(loginPage,'loginCloseView',{});
				plus.webview.show(loginPage,'slide-in-right');
			}
		},{"title":"注销",
			"buttons":["确认","取消"],
			"verticalAlign":"center"
		});
	});
	
	/*
	 * 修改密码
	 */
	document.getElementById('updatePass').addEventListener('tap',function(){
		plus.webview.show(updatePass,'slide-in-right');
	});
	
	/*
	 * 修改个人资料
	 */
	document.getElementById('updateInfo').addEventListener('tap',function(){
		mui.fire(userInfo,'userInfoLoad',{});
		plus.webview.show(userInfo,'slide-in-right');
	});
	
});