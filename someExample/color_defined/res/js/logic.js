/*-------------------------------------------------------
这个文件主要处理各种按钮的事件和校验，请求逻辑,还有几个辅助函数
定制一般不需要改这个文件
---------------------------------------------------------*/
//全局变量(g_前缀,这些做定制时都不能变)
var g_pstrength,//修改密码时用的密码强度，由initPstrength初始化
	g_url = "../login.php";
	
Array.prototype.indexOf = function(o, from){
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len : 0;
        for (; from < len; ++from){
            if(this[from] === o){
                return from;
            }
        }
        return -1;
    }
//html编码
function htmlEncode(value){
	return !value?value:String(value).replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
}	

// 简写方法
function $id(id){
	return document.getElementById(id);
}

//转换json
function json_decode(str){
	var json = null;
	try{
		json = eval("(" + str + ')'); 
	}catch(e){}
	return json;
}

//获取url参数
function getUrlParam(val){
	var reg = new RegExp("(^|\\?|&)"+ val +"=([^&#]*)(\\s|&|$|#)", "i");
	if (reg.test(location.href)) return unescape(RegExp.$2); 
	return "";
}


	
//---------------校验代码------------->>

//初始化修改密码强度变量(不用改动)
function initPstrength(){
	$.ajax({
		url: "/passwordstrength",
		type : "GET",
		success: function(resp){
			var json= json_decode(resp);
			if(json){
				g_pstrength = json;
			}else{
				alert("修改密码强度信息格式不正确");
			}
		},
		error : function(o){
			alert("无法获取修改密码强度信息，网络异常");
		}
	})
}

//修改密码的提示方法
function setChangePwdTips(msg){
	js_alert("mode_changePwd", msg);
}
//修改密码的提示方法
function setSmsTips(msg){
	js_alert("mode_sms", msg);
}
//修改密码的提示方法
function setPasswordTips(msg){
	js_alert("mode_password", msg);
}

//密码登录的校验
function pwdValidtor(){
	var user = $id("password_name"),
		checked = $id("password_disclaimer")?$id("password_disclaimer").checked:false,
		pwd = $id("password_pwd");

	if((user.value.length <= 0) || (pwd.value.length <= 0)){
		valid = false;
		setPasswordTips("用户账户和密码不能为空！");
		return false;
	}else if(user.value.length > 95){
		setPasswordTips("用户账户长度不能超过95个字节！");
		return false;
	}else if(window.g_hasDisclaimer && !checked){
		setPasswordTips("请先阅读免责声明，并勾选!");
		return false;
	}
	setPasswordTips("");
	return false;
}

//获取验证码时的校验,主要检查手机号格式
function getSmsCodeValidtor(){
	var user = $id("sms_name"),
		Regx = /^[0-9]*$/;

	if(user.value.length <= 0){
		setSmsTips("手机号码不能为空！");
		return false;
	}else if(user.value.length != 11){
		setSmsTips("手机号码长度有误（标准为11位数字）！");
		return false;
	}else if(!Regx.test(user.value)){
		setSmsTips("手机号码不能含有非数字字符！");
		return false;
	}else if(user.value.substring(0,1) != 1){
		setSmsTips("手机号码第一位应该是数字'1'！");
		return false;
	}
	setSmsTips("");
	return false;
}

//短信认证时的校验
function smsValidtor(){
	if(!getSmsCodeValidtor())return false;
	var pwd = $id("sms_pwd").value;
	var checked = $id("sms_disclaimer")?$id("sms_disclaimer").checked:false;
	if(pwd === ""){
		setSmsTips("验证码不能为空！");
		return false;
	}
	if(window.g_hasDisclaimer && !checked){
		setSmsTips("请先阅读免责声明，并勾选!");
		return false;
	}
	setSmsTips("");
	return false;
}

//修改新密码的时候，对密码强度的修改
function validatePasswordStrength() {
    if (g_pstrength && g_pstrength.enable) {
        var user = $id("user").value.toLowerCase();
        var pwd  = $id("password").value;
		var pwd1 = $id("newpassword1").value;
        if (g_pstrength.noequalname) {
            if (user && pwd1 == user) {
                setChangePwdTips("密码不能等于用户名");
                return false;
            }
        }
        if (g_pstrength.noequalold) {
            if (pwd && pwd1 == pwd) {
                setChangePwdTips("新密码不能与旧密码相同");
                return false;
            }
        }
        if (g_pstrength.limit.enable && g_pstrength.limit.minlen > 1) {
            if (pwd1.length < g_pstrength.limit.minlen) {
                setChangePwdTips("密码最小长度为" + g_pstrength.limit.minlen + "个字符");
                return false;
            }
        }
        if (g_pstrength.must.enable) {
            if (g_pstrength.must.num && pwd1.search(/\d/) == -1) {
                setChangePwdTips("密码必须包含数字");
                return false;
            }
            if (g_pstrength.must.alph && pwd1.search(/[A-Za-z]/) == -1) {
                setChangePwdTips("密码必须包含字母");
                return false;
            }
            if (g_pstrength.must.special && pwd1.search(/[!@#\$%\^&\*\(\)]/) == -1) {
                setChangePwdTips("密码必须包含特殊字符（shift+数字）");
                return false;
            }
        }
        return true;
    } else {
		return true;	
	}
}

//修改密码时的校验
function changePwdValidtor(){
	var user = $id("changePwd_name"),
		password = $id("changePwd_oldPwd"),
		pwd1 = $id("changePwd_newPwd"),
		pwd2 = $id("changePwd_newPwd2");
	if(user.value.length <= 0){
		setChangePwdTips("用户名不能为空！");
		return false;
	}else if(user.value.length > 95)
	{
		setChangePwdTips("用户名长度不能超过95个字节！");
		return false;
	} else  if(pwd1.value.length >= 40 || pwd1.value.length ===0){
		setChangePwdTips("密码不能为空且长度必须小于40个字符！");
		return false;
	} else  if(pwd1.value !== pwd2.value){
		setChangePwdTips("确认密码不一致！");
		return false;
	} 
    //密码强度校验
	if (validatePasswordStrength() === false){
		return false;
	} 
	setChangePwdTips("");
	return false;
}

//<<---------------校验代码-------------

//---------------按钮事件和请求的绑定(定制一般不用改动)------------->>
	
//密码登录，密码登录按钮事件
function onPwdLogin(){
	if(!pwdValidtor())return;
	var params = {
		opr:'pwdLogin',//smsLogin表示短信认证登录,pwdLogin表示密码认证登录
		userName : $id("password_name").value,
		pwd : $id("password_pwd").value,
		rememberPwd : $id("rememberPwd").checked ? '1':'0'
	};
	loginRequest(params,"mode_password",$id("password_submitBtn"));
}

//修改密码，确定按钮事件
function onChangePwd(){
	if(!changePwdValidtor())return;
	var params = {
		opr:'changePwd',
		userName:$id("changePwd_name").value,
		oldPwd:$id("changePwd_oldPwd").value,
		newPwd:$id("changePwd_newPwd").value
	};
	changePwdRequest(params,"mode_changePwd",$id("changePwd_submitBtn"))
}

//获取验证码，点击获取验证码按钮事件
function onGetSmsCode(){
	if(!getSmsCodeValidtor())return;
	var params = {
		opr:'getSmsCode',
		userName : $id("sms_name").value
	};
	getSmsCodeRequest(params,"mode_sms",$id("sms_getCodeBtn"));
}

//短信登录，点击短信登录按钮事件
function onSmsLogin(){
	if(!smsValidtor())return;
	var params = {
		opr:'smsLogin',
		userName : $id("sms_name").value,
		pwd : $id("sms_pwd").value
	};
	loginRequest(params,"mode_sms",$id("sms_submitBtn"));
}

function onLogout(){
	logoutRequest({opr:'logout'},'mode_logout',$id('logout_submitBtn'))
}



//通用ajax请求，会转成json参数给到successFn
function $ajax(params,formid,successFn,btn)
{
	function error(msg){
		if(btn){
			btn.disabled = false;
			btn.value = btn.orgValue;
		}
		js_alert(formid, msg);
	}
	$.ajax({
		url: g_url,
		data: params,
		type : "POST",
		success: function(resp){
			var json= json_decode(resp);
			if(json){
				successFn(json);
			}else{
				error("响应数据格式不正确");
			}
		},
		error : function(o){
			error("网络异常");
		}
	})
}

//通用登录请求
function loginRequest(params,formid,btn){
	//成功后干啥
	function fn(o){
		btn.disabled = false;
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			return;
		}

		var action = o.action,interval,i = 3;
		switch (action)
		{
			case "changePwd":
				activatePage('changePwd',o.userName);
			break;
			case "location":
				btn.disabled = true;
				js_alert(formid, "认证成功，<b>"+(i)+"</b> 秒后将跳转到上次访问的页面。");
				interval = setInterval(function (){
				if (i > 0) {
					js_alert(formid, "认证成功，<b>"+(i--)+"</b> 秒后将跳转到上次访问的页面。");
				} else {
					clearInterval(interval);
					js_alert(formid, "");
					window.location = o.location;
				}
			},1*1000);
			break;
			case "logout":
				activatePage('logout',o.userName);
			break;
		}
	}
	btn.orgValue = btn.value;
	btn.value = "请稍后...";
	btn.disabled = true;
	
	$ajax(params,formid,fn,btn);
}

//获取短信验证码的请求
function getSmsCodeRequest(params,formid,btn){
	//成功后干啥
	function fn(o){
		if(!o.success){
			js_alert(formid, o.msg);
			btn.value = "重新获取";
			btn.disabled = false;
			return;
		}
		js_alert(formid, "短信验证码发送成功");
		var i = 10,
		interval = setInterval(function (){
			if (i > 0) {
				i--;
				btn.value = "重新获取("+i+")";
				btn.disabled = true;
			} else {
				clearInterval(interval);
				btn.value = "重新获取";
				btn.disabled = false;
			}
		},1*1000);
	}
	
	btn.orgValue = btn.value;
	btn.value = "请稍后...";
	btn.disabled = true;
	$ajax(params,formid,fn,btn);
}

//修改密码的请求
function changePwdRequest(params,formid,btn){
	//成功后干啥
	function fn(o){
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			btn.disabled = false;
			return;
		}
		var i = 3;
		js_alert(formid, "修改密码成功，<b>"+(i)+"</b> 秒后将返回登录页面。");
		var interval = setInterval(function (){
			if (i > 0) {
				js_alert(formid, "修改密码成功，<b>"+(i--)+"</b> 秒后将返回登录页面。");
			} else {
				clearInterval(interval);
				btn.disabled = false;
				js_alert(formid, "");
				activatePage('login');
			}
		},1*1000);
	}
	
	btn.orgValue = btn.value;
	btn.value = "请稍后...";
	btn.disabled = true;
	$ajax(params,formid,fn,btn);
}

//注销请求
function logoutRequest(params,formid,btn)
{
	//成功后干啥
	function fn(o){
		btn.value = btn.orgValue;
		if(!o.success){
			js_alert(formid, o.msg);
			btn.disabled = false;
			return;
		}
		var i = 3;
		js_alert(formid, "注销成功，<b>"+(i)+"</b> 秒后将返回登录页面。");
		var interval = setInterval(function (){
			if (i > 0) {
				js_alert(formid, "注销成功，<b>"+(i--)+"</b> 秒后将返回登录页面。");
			} else {
				clearInterval(interval);
				btn.disabled = false;
				js_alert(formid, "");
				activatePage('login');
			}
		},1*1000);
	}
	
	btn.orgValue = btn.value;
	btn.value = "请稍后...";
	btn.disabled = true;
	$ajax(params,formid,fn,btn);
}
//<<---------------按钮事件和请求的绑定-------------