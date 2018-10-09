
var shares = null;

/**
 * 更新分享服务
 * @param {Object} s 分享对象
 */
function updateSerivces() {
    plus.share.getServices(function(ShareService) {
        shares = {};
        for (var i in ShareService) {
            var t = ShareService[i];
            shares[t.id] = t;
        }
        outSet("获取分享服务列表成功");
    }, function(e) {
        outSet("获取分享服务列表失败：" + e.message);
    });
}

/**
 * 分享操作
 */
function shareAction(id, ex, data) {
    var currentShare = shares[id];
    if (!id || !currentShare) {
        outSet("无效的分享服务！");
        return;
    }
    if(!currentShare.nativeClient){
    	outSet("微信客户端未安装！");
    	return;
    }
    if (currentShare.authenticated) {
        outSet("---已授权---");
        shareMessage(currentShare, ex, data);
    } else {
        outSet("---未授权---");
        currentShare.authorize(function() {
            shareMessage(currentShare, ex, data);
        }, function(e) {
            outLine("微信认证授权失败：" + e.code + " - " + e.message);
        });
    }
}
/**
 * 发送分享消息
 */
function shareMessage(currentShare, ex, data) {
	var SURL = HTTP_WWW + '/myapp/public?u='+data.userid+'&l='+data.listid+'&t='+Date.parse(new Date())/1000;
    var msg = {
        href: SURL,
        title: '今日你签到了吗',
        content: '制定一项目标，每日坚持打卡！',
        thumbs: [HTTP_WWW + '/myapp/public/static/logo200x200.jpg'],
        pictures: [HTTP_WWW + '/myapp/public/static/logo200x200.jpg'],
        extra: {
            scene: ex
        }
    };
    currentShare.send(msg, function(e) {
        outSet("分享成功!");
    }, function(e) {
    	console.log(JSON.stringify(e));
    	if(!currentShare.nativeClient){
    		outLine("分享失败,微信客户端未安装!");
    		return;
    	}
        outSet("分享失败!");
        outLine("分享失败,请确定打开获取已安装列表权限!");
    });
}

// 控制台输出日志
function outSet(msg) {
    mui('#sheet1').popover('hide');
    console.log(msg);
}
// 界面弹出吐司提示
function outLine(msg) {
    mui('#sheet1').popover('hide');
    mui.toast(msg);
}