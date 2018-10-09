<?php
namespace app\index\controller;
use think\Request;
use think\Controller;
use think\Db;
use util\Util;

class Lists
{
	/*
	 * 添加项目
	 */
	public function addList(){
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$userid = $reqData['userid'];
			$listname = $reqData['listname'];
			$listremark = $reqData['listremark'];
			$listendtime = $reqData['listendtime'];
			$listData = [
				'list_name'=>$listname,
				'list_starttime'=>time(),
				'list_endtime'=>$listendtime,
				'list_remark'=>$listremark
			];
			$insertRes = Db::table('lists')->insertGetId($listData);
			$listmetaData = [
				'user_id'=>$userid,
				'list_id'=>$insertRes
			];
			$res = Db::table('listmeta')->insert($listmetaData);
			
			if($res){
				return json(['code'=>0,'message'=>'添加成功']);
			}else{
				return json(['code'=>1,'message'=>'添加失败']);
			}
		}
	}
	
	/*
	 * 删除list
	*/
	public function deleteList()
	{
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$userid = $reqData['userid'];
			$listid = $reqData['listid'];
			$res1 = Db::table('listmeta')->where('user_id',$userid)->where('list_id',$listid)->delete();
			$res2 = Db::table('lists')->where('list_id',$listid)->delete();
			$res3 = Db::table('detailed')->where('list_id',$listid)->delete();
			if($res1 && $res2 ){
				return json(['code'=>0,'message'=>'删除成功']);
			}else{
				return json(['code'=>1,'message'=>'删除失败']);
			}
		};
	}
	
	/*
	 * 删除签到记录
	 */
	public function deleteDetail()
	{
		$Util = new Util();
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$userid = $reqData['userid'];
			$detailId = $reqData['detailId'];
			$timestamp = $Util->timestamp();
			$res = Db::table('detailed')->where('detailed_id',$detailId)->delete();
			if($res){
				$lv = Db::table('users')->where('user_id',$userid)->value('user_level');
				if($lv != 0){
					Db::table('users')->where('user_id',$userid)->update(['user_level'=>$lv-10]);
				}
				return json(['code'=>0,'timestamp'=>$timestamp,'message'=>'删除成功']);
			}else{
				return json(['code'=>1,'message'=>'删除失败']);
			}
		}
	}
	
	/*
	 * 查询列表
	 */
	public function selectList(){
//		sleep(1);
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$uid = $reqData['userid'];
			$nowpage = $reqData['nowpage']-1;//当前页
	        $pageSize = 10;//一页多少数据
	        $startLine = $nowpage*$pageSize;
	        $status = isset($reqData['status']) ? true : false;
	        $res = [];
	        if(!$status){//查询全部
	        	$res = Db::table('lists')->alias('a')
					->field('a.list_id,a.list_name,a.list_starttime,a.list_endtime,a.list_remark')
					->join('listmeta b','a.list_id = b.list_id')
					->where('b.user_id',$uid)
					->order('list_starttime desc')->limit($startLine,$pageSize)->select();
	        }else{//筛选
	        	$res = Db::table('lists')->alias('a')
					->field('a.list_id,a.list_name,a.list_starttime,a.list_endtime,a.list_remark')
					->join('listmeta b','a.list_id = b.list_id')
					->where('b.user_id',$uid)
					->where('b.status',$reqData['status'])
					->order('list_starttime desc')->limit($startLine,$pageSize)->select();
	        }
	        if(!empty($res)){
	        	$data = [];
				foreach($res as $v){
					$v['list_starttime'] = date('Y-m-d H:i',$v['list_starttime']);
					if($v['list_endtime']!=0){
						if(time() > $v['list_endtime']){
							//如果当前时间大于结束时间 标记已完成
							Db::table('listmeta')->where('list_id',$v['list_id'])->update(['status' => 1]);
							$v['status'] = 1;
						}
						$v['list_endtime'] = date('Y-m-d H:i',$v['list_endtime']);
					}
					$data[] = $v;
				}
				return json(['code'=>0,'data'=>$data]);
	        }else{
				return json(['code'=>1,'message'=>'暂时还没数据!']);
	        }
		};
	}
	
	/*
	 * 查询签到信息
	 */
	public function selectDetail()
	{
		sleep(1);
		$Util = new Util();
		$reqData = Request::instance()->get();
		if(!empty($reqData)){
			$listId = $reqData['listId'];
			$res = Db::table('detailed')
					->where('list_id',$listId)
					->order('marktime desc')
					->select();
			$status = Db::table('listmeta')
					->field('status')
					->where('list_id',$listId)
					->find();
			if(!empty($res)){
				$data = [];
				foreach($res as $v){
					$v['marktimeString'] = date('Y-m-d H:i',$v['marktime']);
					$data[] = $v;
				}
				$timestamp = $Util->timestamp();
				return json(['code'=>0,'timestamp'=>$timestamp,'data'=>$data,'status'=>$status['status']]);
			}else{
				return json(['code'=>1,'message'=>'暂时还没数据!','status'=>$status['status']]);
	        }
		}
	}
	
	/*
	 * 签到
	 */
	public function markDetail()
	{
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$userid = $reqData['userid'];
			$listId = $reqData['listId'];
			$listendtime = $reqData['listendtime'];
			$endtime = strtotime($listendtime);
			$marktime = time();
			if($listendtime != 0 && $marktime > $endtime){
				return json(['code'=>1,'message'=>'项目已截止!']);
			}else{
				$res = Db::table('detailed')
					->insert(['list_id'=>$listId,'marktime'=>$marktime]);
				if($res){
					$lv = Db::table('users')->where('user_id',$userid)->value('user_level');
					Db::table('users')->where('user_id',$userid)->update(['user_level'=>$lv+10]);
					return json(['code'=>0,'marktime'=>$marktime,'message'=>'签到成功']);
				}else{
					return json(['code'=>1,'message'=>'签到失败']);
				}
			}
		}
	}
	
	/*
	 * 更新状态
	 */
	public function updateStatus()
	{
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$listId = $reqData['listId'];
			$marktime = $reqData['marktime'];
			$endtime = $reqData['endtime'];
			$isDel = $reqData['isDel'];
			if($endtime != 0){
				$dEnd = strtotime($endtime);//一天结束的时间
				$d = date('Y-m-d',$dEnd);//当前日期
				$dStart = strtotime($d.' 00:00');//一天开始的时间
				$stu = 0;//默认进行中
				if($marktime > $dStart && $marktime < $dEnd){
					//如果签到时间是在结束的那天就修改成已完成
					$stu = 1;
					if($isDel){
						$stu = 0;//如果是删除的话，就改为进行中
					}
					$res = Db::table('listmeta')
							->where('list_id',$listId)
							->setField('status', $stu);
					if($res){
						return json(['code'=>0,'message'=>'状态修改成功','data'=>$stu]);
					}else{
						return json(['code'=>1,'message'=>'状态修改失败','data'=>$stu]);
					}
				}else{
					return json(['code'=>1,'message'=>'无需修改']);
				}
			}else{
				return json(['code'=>1,'message'=>'结束时间为0']);
			}
		}
	}
}
?>