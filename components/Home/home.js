
mui.plusReady(function(){
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
	
	//滚动区域
	var deceleration = mui.os.ios?0.003:0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration:deceleration
	});
	
	//预加载用户界面
	var userPage = mui.preload({
		url:'../User/user.html',
	    id:'user.html'
	});
	
	//预加载添加界面
	var addPage = mui.preload({
		url:'../Add/add.html',
		id:'add.html',
		styles:{
			hardwareAccelerated:true
		}
	});
	
	//预加载详情界面
	var detailPage = mui.preload({
		url:'../Detail/detail.html',
		id:'detail.html'
	});
	var vm = new Vue({
		el:'#wrapper',
		data:{
			tips:'正在加载...',
			list:[],
			nowpage:1,
			filterItem:['全部','进行中','已结束'],
			type:0,
			isLoading:false,
			userid:''
		},
		mounted:function(){
			var _this = this;
			mui.init({
				keyEventBind: {
					backbutton: false  //关闭back按键监听
				},
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						style:'circle',
						color:'#2BD009',
						height:'50px',
						range:'80px',
						offset:'46px',
						callback: _this.pulldownRefresh
					},
					up: {
						height:50,
						contentrefresh: '正在加载...',
						callback: _this.pullupRefresh
					}
				}
			});
			_this.onloadfn();
		},
		methods:{
			/*
			 * 页面创建时加载时 加载列表
			 * @param {u} Object 用户信息
			 */
			onloadfn:function(){
				var _this = this;
				_this.list = [];
				console.log('home load')
				setTimeout(function(){
					var user = JSON.parse(plus.storage.getItem('userinfo')) || null;
					if(user){
						_this.userid = user.user_id;
						var d = {userid:user.user_id,nowpage:_this.nowpage};
						_this.loadData(d);
					}
				},60);
			},
			toUser:function(){
				mui.fire(userPage,'userLoad',{
					_id:'user'
				});
				plus.webview.show(userPage,'slide-in-right');
				
			},
			toAdd:function(){
				plus.webview.show(addPage,'slide-in-bottom');
			},
			toDetail:function(v){
				mui.fire(detailPage,'detailLoad',{
				    listId:v.list_id,
					listName:v.list_name,
					listStarttime:v.list_starttime,
					listEndtime:v.list_endtime,
					listRemark:v.list_remark
				});
				plus.webview.show(detailPage,'slide-in-right');
			},
			/*
			 * 选择类别
			 * @param {i} 0-全部 1-进行中 2-已完成
			 */
			filterList:function(i){
				var _this = this;
				_this.type = i;
				_this.isLoading = false;//开启loading
				_this.nowpage = 1;
				_this.list = [];
				mui('#topPopover').popover('hide');//隐藏弹出菜单
				mui('#pullrefresh').pullRefresh().refresh(true);//重置上拉加载
				switch(i){
					case 0:
						var d = {"userid":_this.userid,"nowpage":_this.nowpage};
						_this.loadData(d);
					break;
					
					case 1:
						//status 0 为进行中
						var d = {"userid":_this.userid,"nowpage":_this.nowpage,"status":0};
						_this.loadData(d);
					break;
					
					case 2:
						//status 1 为已结束
						var d = {"userid":_this.userid,"nowpage":_this.nowpage,"status":1};
						_this.loadData(d);
					break;
				}
			},
			/*
			 * 加载数据
			 * @param {d} object 要发送的数据
			 */
			loadData:function(d){
				var _this = this;
				_this.tips = '正在加载...';
				mui.ajax(HTTP_URL+'lists/selectList?t='+Math.random(),{
					data:d,
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:15000,//超时时间设置为10秒
					success:function(data){
						_this.isLoading = false;
						if(data.code==0){
							_this.list = data.data;
						}else{
							_this.tips = '暂时没有数据!';
						}
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//关闭刷新
						mui('#pullrefresh').pullRefresh().refresh(true);//重置上拉加载
					},
					error:function(xhr,type,errorThrown){
						plus.nativeUI.alert('服务器错误!', null, '错误', '确定');
						_this.tips = '服务器错误!';
						console.log(xhr,type,errorThrown);
						_this.isLoading = false;
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//关闭刷新
						mui('#pullrefresh').pullRefresh().refresh(true);//重置上拉加载
					}
				});
			},
			//下拉刷新
			pulldownRefresh:function(){
				var _this = this;
				_this.nowpage = 1;
				switch(_this.type){
					case 0:
						var d = {"userid":_this.userid,"nowpage":_this.nowpage};
						_this.loadData(d);
					break;
					
					case 1:
						var d = {"userid":_this.userid,"nowpage":_this.nowpage,"status":0};
						_this.loadData(d);
					break;
					
					case 2:
						var d = {"userid":_this.userid,"nowpage":_this.nowpage,"status":1};
						_this.loadData(d);
					break;
				}
			},
			//上拉加载
			pullupRefresh:function(){
				var _this = this;
				_this.nowpage += 1;
				var d = {};
				//指定类别加载
				switch(_this.type){
					case 0://全部
						d = {"userid":_this.userid,"nowpage":_this.nowpage};
					break;
					case 1://进行中
						d = {"userid":_this.userid,"nowpage":_this.nowpage,"status":0};
					break;
					case 2://已完成
						d = {"userid":_this.userid,"nowpage":_this.nowpage,"status":1};
					break;
				}
				mui.ajax(HTTP_URL+'lists/selectList?t='+Math.random(),{
					data:d,
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:15000,//超时时间设置为10秒；
					success:function(data){
						if(data.code==0){
							var n = data.data.length;
							mui.toast('已加载'+n+'条记录');
							_this.list = _this.list.concat(data.data);
							mui('#pullrefresh').pullRefresh().endPullupToRefresh((data.data.length < 10));
						}else{
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						}
					},
					error:function(xhr,type,errorThrown){
						plus.nativeUI.alert('服务器错误!', null, '错误', '确定');
					}
				});
			},
			/*
			 * 切换筛选菜单的状态
			 */
			openPopover:function(){
				mui('#topPopover').popover('toggle',document.getElementById("openPopover"));
			}
		}
	});
	
	window.addEventListener('homeLoad',function(e){
		vm.type = 0;
		vm.onloadfn();
	});
});