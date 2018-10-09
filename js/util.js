

/*
 * 转两位
 */
function toDouble(num){
	if(num < 10) return '0' + num;
	return num
}

/*
 * 获取当前时间
 */
function getTime(str){
	var oDate = new Date();
	var year = oDate.getFullYear();
	var month = oDate.getMonth()+1;
	var date = oDate.getDate();
	var hours = oDate.getHours();
	var minutes = oDate.getMinutes();
	if(str=='datetime'){
		var datetime = year + '-' + toDouble(month) + '-' + toDouble(date) + ' ' + toDouble(hours) + ':' + toDouble(minutes);
		return datetime
	}else if(str=='date'){
		var date = year + '-' + toDouble(month) + '-' + toDouble(date);
		return date
	}else if(str=='time'){
		var time =toDouble(hours) + ':' + toDouble(minutes);
		return time
	}else{
		return '请输入正确的参数!'
	}
}


/*
 * 日期时间戳
 */
function timestamp(sDate){
	var stamp = sDate + ' 23:59';
	var d = new Date(stamp);
	return parseInt(d.getTime())/1000;
}
