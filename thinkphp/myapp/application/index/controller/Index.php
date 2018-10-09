<?php
namespace app\index\controller;
use think\Request;
use think\Controller;
use think\Db;
class Index extends Controller
{
    public function index()
    {
    	$userid = input('get.u/d');
    	$listid = input('get.l/d');
		if($userid && $listid){
			$res = Db::table('users')->alias('a')
				->field('a.user_nickname,a.user_avatar,a.user_level,a.user_regtime,b.status,c.list_name,c.list_starttime,c.list_endtime')
				->join('listmeta b','a.user_id = b.user_id')
				->join('lists c','b.list_id = c.list_id')
				->where('a.user_id',$userid)
				->where('b.list_id',$listid)
				->find();
			$count = Db::table('detailed')
				->where('list_id',$listid)
				->count();
			if(!empty($res)){
				$data = [
					'nickname'=>$res['user_nickname'],
					'avatar'=>$_SERVER['HTTP_HOST'].'/myapp/public/static/avatar/tx'.$res['user_avatar'].'.jpg',
					'leavl'=>(int)($res['user_level'] / 100 + 1),
					'listname'=>$res['list_name'],
					'regtime'=>(int)((time()-$res['user_regtime'])/86400 + 1),
					'startTime'=>$this->tt($res['list_starttime']),
					'endTime'=>$this->tt($res['list_endtime']),
					'status'=>$res['status'] ? '已结束' : '进行中',
					'count'=>$count,
					'favicon'=>$_SERVER['HTTP_HOST'].'/myapp/public/static/favicon.ico',
					'android'=>$_SERVER['HTTP_HOST'].'/myapp/public/static/2wm.png',
					'iphone'=>$_SERVER['HTTP_HOST'].'/myapp/public/static/appstore.png'
				];
//				print_r($data);
				return $this->fetch('share',['d'=>$data]);
			}
		};
		return '发生错误！';
    }
    public function tt($t)
    {
    	$r = date('Y-m-d H:i',$t);
    	return $r;
    }
}
