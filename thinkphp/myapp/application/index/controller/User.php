<?php
namespace app\index\controller;
use think\Request;
use think\Controller;
use think\Db;
use util\Util;
class User
{
	public function aa(){
//		print_r($_SERVER['HTTP_HOST']);
		return $_SERVER['HTTP_HOST'];
	}
	/*
	 * 登录
	 */
	public function login()
	{
		$Util = new Util();
		$reqData = Request::instance()->post();
    	$usermail = $reqData['usermail'];
		$password = $Util->customMD5($reqData['password']);
		
		$result = Db::table('users')
					->field('user_id,user_nickname,user_mail,user_avatar,user_regtime,user_level')
					->where(['user_mail'=>$usermail,'user_password'=>$password])
					->find();
		if(empty($result)){
			return json(['code'=>1,'message'=>'邮箱或者密码错误']);
		}else{
			$avatar = $result['user_avatar'];
			$result['user_avatarUrl'] = $_SERVER['HTTP_HOST'] . '/myapp/public/static/avatar/tx'.$avatar.'.jpg';
			return json(['code'=>0,'user'=>$result]);
		}
	}
	
	/*
	 * 检查此邮箱是否被注册
	 */
	public function checkUser()
	{
		$result = 0;
    	$reqData = Request::instance()->post();
    	if(!empty($reqData)){
    		$usermail = $reqData['usermail'];
  		  	$result = Db::table('users')
				->where(['user_mail'=>$usermail])
				->count();
			if($result){
				return json(['code'=>1,'message'=>'此邮箱已被注册!']);
			}else{
				$res = $this -> send($usermail);
				return json($res);
			}
    	}
	}
	
	/*
	 * 注册
	 */
	public function register()
	{
		$Util = new Util();
		$reqData = Request::instance()->post();
		$data = ['user_mail' => $reqData['usermail'],
			'user_avatar' => $reqData['avatar'],
			'user_nickname' => $reqData['nickname'],
			'user_password' => $Util->customMD5($reqData['password']),
			'user_regtime' => time()];
		$res = Db::table('users')->insert($data);
		if($res==1){
			return json(['code'=>0,'message'=>'添加成功']);
		}else{
			return json(['code'=>1,'message'=>'添加失败']);
		}
	}
	
	/*
	 * 找回密码验证码
	 */
	public function forgot()
	{
		$result = 0;
    	$reqData = Request::instance()->post();
    	if(!empty($reqData)){
    		$usermail = $reqData['usermail'];
    		$checkMail = Db::table('users')->where('user_mail',$usermail)->value('user_mail');
    		if($checkMail){
    			$res = $this -> send($usermail);
				return json($res);
    		}else{
    			return json(['code'=>1,'message'=>'此邮箱还未注册!']);
    		}
    	}
	}
	
	/*
	 * 修改密码(忘记密码时)
	 */
	public function updatePwd()
	{
		$Util = new Util();
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$usermail = $reqData['usermail'];
			$password = $Util->customMD5($reqData['password']);
			
			$res = Db::table('users')->where('user_mail',$usermail)->setField('user_password', $password);
			if($res==0){
				$pwd = Db::table('users')->where('user_mail',$usermail)->value('user_password');
				if($pwd == $password){
					return json(['code'=>1,'message'=>'不能与原密码相同!']);
				}else{
					return json(['code'=>1,'message'=>'修改失败,未知错误!']);
				}
			}else{
				return json(['code'=>0,'message'=>'修改成功!']);
			}
		}
	}
	
	
	/*
	 * 发送邮件
	 * @param {usermail} String 目标邮箱
	 * 调用工具类 randCode sendMail
	 */
    public function send($usermail)
    {
    	$Util = new Util();
		$identifyCode = $Util->randCode();//验证码
		$res = $Util -> sendMail($usermail,$identifyCode);
		if($res==1){
			//code 0 成功
			return ['code'=>0,'message'=>'发送成功!','identifyCode'=>$identifyCode];
		}else{
			//code 1 失败
			return ['code'=>1,'message'=>'验证码发送失败,未知错误!'];
		}
    }
	
	/*
	 * 修改个人资料
	 */
	public function updateUserinfo()
	{
//		sleep(1);
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$username = $reqData['username'];
			$userid = $reqData['userid'];
			$userAvatar = $reqData['userAvatar'];
			$res = Db::table('users')->where('user_id',$userid)->setField(['user_nickname'=>$username,'user_avatar'=>$userAvatar]);
			if($res==0){
				return json(['code'=>1,'message'=>'修改失败!']);
			}else{
				return json(['code'=>0,'message'=>'修改成功!']);
			}
		}
	}
	
	/*
	 * 修改密码
	 */
	public function updatePass()
	{
		$Util = new Util();
		$reqData = Request::instance()->post();
		if(!empty($reqData)){
			$userid = $reqData['userid'];
			$oldPass = $Util->customMD5($reqData['oldPass']);
			$newPass = $Util->customMD5($reqData['newPass']);
			$selectOldPass = Db::table('users') 
								->where('user_id',$userid)
								->where('user_password',$oldPass)
								->find();
			if(!empty($selectOldPass)){
				$updateRes = Db::table('users')
								->where('user_id',$userid)
								->update(['user_password'=>$newPass]);
				if($updateRes){
					return json(['code'=>0,'message'=>'修改成功!']);
				}else{
					return json(['code'=>1,'message'=>'修改失败!']);
				}
			}else{
				return json(['code'=>1,'message'=>'原密码不正确!']);
			}
		}
	}
}

?>