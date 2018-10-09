mui.plusReady(function(){
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	updateSerivces();//获得分享服务
	var vm = new Vue({
		el:'.wrap',
		data:{
			isPunch:false,//是否已签到
			isLoading:false,
			listinfo:{},//当前点击list的信息
			currData:[],//当前list签到信息
			userid:'',
			okText:'已签到'//已签到或已完成
		},
		mounted:function(){
			var _this = this;
			mui.init({
				swipeBack:true
			});
			mui('.mui-scroll-wrapper').scroll({
				deceleration: deceleration,
			});
		},
		created:function(){
			var _this = this;
			window.addEventListener('detailLoad',function(e){
				_this.currData = [];
				var d = {
					listId : e.detail.listId,
					listName : e.detail.listName,
					listStarttime : e.detail.listStarttime,
					listEndtime : e.detail.listEndtime,
					listRemark : e.detail.listRemark
				}
				_this.userid = JSON.parse(plus.storage.getItem('userinfo')).user_id
				_this.listinfo = d;
				_this.loadData(e.detail.listId);
			});
		},
		methods:{
			/*
			 * 加载签到数据
			 * @param {_id} Int 当前点击list id
			 */
			loadData:function(_id){
				var _this = this;
				_this.isPunch = false;
				_this.isLoading = true;
				mui.ajax(HTTP_URL+'lists/selectDetail?t='+Math.random(),{
					data:{
						listId:_id
					},
					dataType:'json',//服务器返回json格式数据
					type:'get',//HTTP请求类型
					timeout:15000,//超时时间设置为10秒；
					success:function(data){
						_this.listinfo.status = data.status;
						if(data.code==0){
//							console.log(JSON.stringify(data));
//							console.log(JSON.stringify(_this.listinfo));
							var marktime = parseInt(data.data[0].marktime);
							var dayStart = parseInt(data.timestamp.dayStart);
							var dayEnd = parseInt(data.timestamp.dayEnd);
							//判断今日是否签到
							if(marktime < dayEnd && marktime > dayStart){
								_this.isPunch = true;//今儿已签到
								_this.okText = '已签到';
							}
							_this.currData = data.data;
						}else{
							_this.isPunch = false;
							_this.currData = [];
						}
						if(data.status){
							_this.isPunch = true;//项目已完成
							_this.okText = '已结束';
						}
						_this.isLoading = false;
					},
					error:function(xhr,type,errorThrown){
						_this.isLoading = false;
						console.log(xhr,type,errorThrown);
					}
				});
			},
			//查看备注
			alertRemark:function(){
				var _this = this;
				plus.nativeUI.alert(_this.listinfo.listRemark, null, '备注', '确定');
			}, 
			//删除项目
			deleteList:function(){
				var _this = this;
				plus.nativeUI.confirm("你确定要删除吗?", function(e){
					if(e.index == 0){
						var userid = _this.userid;
						_this.isLoading = true;
						mui.ajax(HTTP_URL+'lists/deleteList?t='+Math.random(),{
							data:{
								userid:userid,
								listid:_this.listinfo.listId
							},
							dataType:'json',//服务器返回json格式数据
							type:'post',//HTTP请求类型
							timeout:15000,//超时时间设置为10秒；
							success:function(data){
								_this.isLoading = false;
								var homePage = plus.webview.getWebviewById('home.html');
								mui.fire(homePage,'homeLoad',{'id':'home'});
								mui('.sharePopover').popover('toggle');
								mui.back();
							},
							error:function(xhr,type,errorThrown){
								console.log(xhr,type,errorThrown);
								plus.nativeUI.alert('服务器错误', null, '出错', '确定');
								_this.isLoading = false;
							}
						});
					}
				}, {"title":"删除",
					"buttons":["确认","取消"],
					"verticalAlign":"center"
				});
			},
			//删除签到记录
			deleteDetail:function(detailId,i){
				var _this = this;
				var t = _this.currData[i].marktime;
				plus.nativeUI.confirm("你确定要删除吗?", function(e){
					if(e.index == 0){
						_this.isLoading = true;
						mui.ajax(HTTP_URL+'lists/deleteDetail?t='+Math.random(),{
							data:{
								userid:_this.userid,
								detailId:detailId
							},
							dataType:'json',//服务器返回json格式数据
							type:'post',//HTTP请求类型
							timeout:15000,//超时时间设置为10秒；
							success:function(data){
								if(data.code==0){
									_this.loadData(_this.listinfo.listId);
									_this.updateStatus(t,1);
								}else{
									mui.toast(data.message);
									_this.isLoading = false;
								}
							},
							error:function(xhr,type,errorThrown){
								console.log(xhr,type,errorThrown);
								plus.nativeUI.alert('服务器错误', null, '出错', '确定');
								_this.isLoading = false;
							}
						});
					}
				}, {"title":"删除",
					"buttons":["确认","取消"],
					"verticalAlign":"center"
				});
			},
			//更新完成状态
			updateStatus:function(marktime,isDel){
				var _this = this;
				var listId = _this.listinfo.listId;
				var endtime = _this.listinfo.listEndtime;
				mui.ajax(HTTP_URL+'lists/updateStatus?t='+Math.random(),{
					data:{
						listId:listId,
						endtime:endtime,
						marktime:marktime,
						isDel:isDel
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:15000,//超时时间设置为10秒；
					success:function(data){
						console.log(data);
						var o = _this.listinfo;
						o.status = data.data;
						_this.listinfo = o;
					},
					error:function(xhr,type,errorThrown){
						console.log(xhr,type,errorThrown);
						plus.nativeUI.alert('服务器错误', null, '出错', '确定');
						_this.isLoading = false;
					}
				});
			},
			//点击签到
			punch:function(){
				var _this = this;
				_this.isLoading = true;
				var listId = _this.listinfo.listId;
				mui.ajax(HTTP_URL+'lists/markDetail?t='+Math.random(),{
					data:{
						userid:_this.userid,
						listId:listId,
						listendtime:_this.listinfo.listEndtime
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:15000,//超时时间设置为10秒；
					success:function(data){
						if(data.code==0){
							_this.loadData(listId);
							_this.updateStatus(data.marktime,0);
						}else{
							_this.isLoading = false;
							plus.nativeUI.alert(data.message, null, '提示', '确定');
						}
					},
					error:function(xhr,type,errorThrown){
						console.log(xhr,type,errorThrown);
						plus.nativeUI.alert('服务器错误', null, '出错', '确定');
						_this.isLoading = false;
					}
				});
			},
			//分享按钮 朋友圈
			shareQuan:function(){
				var data = {
					userid:this.userid,
					listid:this.listinfo.listId
				};
				shareAction("weixin", "WXSceneTimeline",data);
			},
			//分享按钮 好友
			shareYou:function(){
				var data = {
					userid:this.userid,
					listid:this.listinfo.listId
				};
				shareAction("weixin", "WXSceneSession",data);
			}
		}
	});
});