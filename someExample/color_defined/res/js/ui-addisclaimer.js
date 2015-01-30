/*--------------------------------------------------
这个文件主要处理ui上的效果,布局初始化等，一般定制可能会
改这个文件
----------------------------------------------------*/

//全局变量
var g_tabs = (getUrlParam("tabs") || "sms").split("|"),
	g_isAd = true;//是否带广告
/*
	初始化tab状态,处理是一个tab还是多个tab的页面布局,
	这个函数只会运行一次(根据不同的布局可自行修改下面代码)
*/
function initTabs(){
	var tabs = g_tabs,html=[],cls = ["n1","n2"];			
	for(i=0,l=tabs.length;i<l;i++){
		if(tabs[i] === "sms"){
			html.push('<li id="sms_title" onClick="activateTab(\'sms\')" style="display:none;" class="'+cls[i]+'"><span>'+g_smsTabTitle+'</span></li>');
		}else{
			html.push('<li id="password_title" onClick="activateTab(\'pwd\')" class="'+cls[i]+'" style="display:none;"><span>'+g_accountTabTitle+'</span></li>');
			html.push('<li id="changePwd_title" onClick="activateTab(\'changePwd\')" class="'+cls[i]+'" style="display:none;"><span>'+g_accountTabTitle+'</span></li>');
		}
	}
	html.push('<li id="logout_title" class="n1 float_bg" style="display:none;"><span>登录成功</span></li>');
	$("#tabtitle").html(html.join(''));
}

/*
	实现mode_password显示密码认证的方法，
	mode_sms显示短信认证的方法，主要提供给activateTab使用,
	这个函数只会运行一次(根据不同的布局可自行修改下面代码)
*/
function initChangeTabMethod(){
	var mode_password, mode_sms,mode_changePwd;
	mode_password = function () {
		$("#sms_title").removeClass("float_bg");
		$("#changePwd_title").hide();
		$("#password_title").show();
		$("#password_title").addClass("float_bg");
		
		$("#mode_sms").hide();
		$("#mode_changePwd").hide();
		$("#mode_password").show();
		$(".username .focus").focus();
	}
	
	mode_sms = function () {
		$("#sms_title").addClass("float_bg");
		$("#changePwd_title").removeClass("float_bg");
		$("#password_title").removeClass("float_bg");
		
		$("#mode_password").hide();
		$("#mode_changePwd").hide();
		$("#mode_sms").show();
		$(".phone .focus").focus();
	}
	
	mode_changePwd = function(){
		$("#sms_title").removeClass("float_bg");
		$("#changePwd_title").show();
		$("#password_title").hide();
		$("#changePwd_title").addClass("float_bg");
		$id("changePwd_name").readOnly = false;
		
		$("#mode_sms").hide();
		$("#mode_password").hide();
		$("#mode_changePwd").show();
		$(".username .focus").focus();
	}
	
	window.mode_password = mode_password;
	window.mode_sms = mode_sms;
	window.mode_changePwd = mode_changePwd;
}

//显示免责声明
function showDisclaimer(){
	var h = $(document).height();
	$('#statement').height(h);
	$('#statement').fadeIn('fast');
}

function hideDisclaimer(){
	$('.uplayer').fadeOut('fast');
}

//激活tab页
function activateTab(tab){
	switch (tab){
		case "sms":
			mode_sms();
		break;
		case "changePwd":
			mode_changePwd();
		break;
		default:
			mode_password();
		break;
	}
}

//激活登录，修改密码，注销页面(根据不同的布局可自行修改下面代码)
function activatePage(type,username,isByUrl){
	$("#mode_logout").hide();
	$("#mode_changePwd").hide();
	$("#mode_password").hide();
	$("#mode_sms").hide();
	
	if(type === "logout")
	{
		$("#logout_title").show();
		$("#sms_title").hide();
		$("#password_title").hide();
		$("#changePwd_title").hide();
	}else{
		$("#logout_title").hide();
		$("#sms_title").show();
	}

	switch (type)
	{
		case "logout" : 
			$("#mode_logout").show();
			if(username){
				$("#logout_name").html(htmlEncode(username));
			}
			break;
		case "changePwd" : 
			$("#sms_title").removeClass("float_bg");
			$("#password_title").hide();
			$("#changePwd_title").show();
			$("#changePwd_title").addClass("float_bg");
			$("#mode_changePwd").show();
			if(username){
				$("#changePwd_name").val(username);
				$("#changePwd_name").siblings('label').css('opacity',0);
				if(!isByUrl){
					$id("changePwd_name").readOnly = true;
					$("#changePwd_first").html("首次登陆必须先修改初始密码。");
				}
				return;
			}
			$("#changePwd_first").html("");
			$id("changePwd_name").readOnly = false;
			break;
		default : 
			$("#password_title").show();
			activateTab(g_tabs[0]);
	}
}

function initAd(){
	/*广告图片*/
	if(!window.g_ismobile){
		$("#slideContainer").bslider({
			width: 632,
			height: 392,
			delay: 3000,
			autofit: false,
			items:window.g_adItems,
			pager: 'both'
		});
		return;
	}

	$("#slideContainer").bslider({
		delay: 3000,
		autofit: true,
		items:window.g_adItems,
		pager: 'arrow'
	});
	
}

//初始化页面，这个函数只会运行一次(定制不用改动)
function initPage(){
	initChangeTabMethod();
	var type = getUrlParam("type");
	initTabs();
	var username = getUrlParam("username");
	activatePage(type,username,true);
	//初始化查看流量信息的url
	$id("flux").href = "https://"+document.domain+"/cgi-bin/showflux.cgi";
	//initPstrength();
	if(window.g_adItems){
		initAd();
	}
	if(window.g_hasDisclaimer)
	{
		$(".disclaimerdiv").show();
	}
}

$(document).ready(function(){initPage();}); 

//下面这块主要处理输入框，按钮，提示信息的样式变化(不用动)
(function ($) {
	function js_alert(divid, msg) {
		var msg_box = $("#"+divid + " .login_box_msg");
		if (msg == "") {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.hide();
			} else {
				msg_box.slideUp();
			}
			
		} else {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.show();
			} else {
				msg_box.slideDown();
			}
			
		}
		msg_box.find("dd").html(msg);
	}
	
	window.js_alert = js_alert;
	
	// JavaScript Document
	$(document).ready(function(){
		login_operate();
		btn();
		//输入框大小写提示
		$(":password").keypress(detectCapsLock);
		//输入框回车提交
		$("input").keyup(onInputKeyUp);
	});

	//重置手机号码框宽度
	function resizePhoneWidth() {
		// 获取窗高度口宽度用到BODY
		if (window.innerWidth)
			winWidth = window.innerWidth;
		else if ((document.body) && (document.body.clientWidth))
			winWidth = document.body.clientWidth;
		// 通过深入Document内部对body进行检测，获取窗口大小
		if (document.documentElement && document.documentElement.clientHeight
				&& document.documentElement.clientWidth) {
			winWidth = document.documentElement.clientWidth;
		}
		$('.mobile .login_box .phone').width(winWidth - 180);

	};	
		
	//输入框
	function login_operate() {
		if(window.g_ismobile){//重置手机号码框宽度
			$(window).resize(function() {
				resizePhoneWidth();
			});
			resizePhoneWidth();
		}
		var li = $(".login_operate ul li");
		var input = $(".login_operate ul li.password input");
		var li_hover = "li_hover";
		var li_press = "li_press";
		var phone_input = $(".phone input");
		var sms_input = $(".sms input");
		var username_input = $(".username input");
		var password_input = $(".password input");
		var password_input_new = $(".password_new input");
		var password_input_n = $(".password_n input");

		/*聚焦*/
		$(".focus").focus();
		/*选中*/
		$(input).click(function(){
			$(this).select();
		});
		
		//提示
		var inputs = $('.input');
		
		inputs.bind('focus',function(){
			$(this).siblings('label').css('opacity',$.trim(this.value)=='' ? 0.5 : 0);
		}).bind('keydown',function(){
			$(this).siblings('label').css('opacity',0);
		}).bind('blur',function(){
			$(this).siblings('label').css('opacity',$.trim(this.value)=='' ? 1 : 0);
		});
		setTimeout(function (){
			$.each(inputs, function (index, item){
				if ($.trim(this.value) !== ''){
					$(item).siblings('label').css('opacity',0);
				}
			});
		}, 800);
				
		if(!/(Mobile|Android|Windows Phone)/.test(navigator.userAgent))
		{
			/*悬停与聚焦后效果*/
			li.hover(function(){
				$(this).addClass(li_hover);
			  },function(){
				$(this).removeClass(li_hover);
			});
		}
		$(".sms_go").hover(function(){
			$(this).removeClass(li_hover);
		  });
		
		$(phone_input).focus(function(){
			$(".phone").addClass(li_press);
			  });
		$(phone_input).blur(function(){
			$(".phone").removeClass(li_press);
			  });
			  
		$(sms_input).focus(function(){
			$(".sms").addClass(li_press);
			  });
		$(sms_input).blur(function(){
			$(".sms").removeClass(li_press);
			  });
			  
		$(username_input).focus(function(){
			$(".username").addClass(li_press);
			  });
		$(username_input).blur(function(){
			$(".username").removeClass(li_press);
			  });
			  
		$(password_input).focus(function(){
			$(".password").addClass(li_press);
			  });
		$(password_input).blur(function(){
			$(".password").removeClass(li_press);
			  });
			  
		$(password_input_new).focus(function(){
			$(".password_new").addClass(li_press);
			  });
		$(password_input_new).blur(function(){
			$(".password_new").removeClass(li_press);
			  });
			  
		$(password_input_n).focus(function(){
			$(".password_n").addClass(li_press);
			  });
		$(password_input_n).blur(function(){
			$(".password_n").removeClass(li_press);
			  });
			  	   
	};
	//按钮
	function btn() { 
		var btn = $(".login_btn");
		$(btn).hover(function(){
			$(this).addClass("login_btn_hover");
		  },function(){
			$(this).removeClass("login_btn_hover");
		});
		$(btn).mousedown(function(){
			$(this).addClass("login_btn_press");
		});
		$(btn).mouseup( function (){
			$(this).removeClass("login_btn_press");
		});	
	}; 
	/*检测大写锁定*/
	function detectCapsLock(ae){
		var uO = ae.keyCode || ae.charCode, Uc = ae.shiftKey;
		if ((uO >= 65 && uO <= 90 && !Uc) || (uO >= 97 && uO <= 122 && Uc)) {
			$(".shiftKey").slideDown();
		} else if ((uO >= 97 && uO <= 122 && !Uc)
				|| (uO >= 65 && uO <= 90 && Uc)) {
			$(".shiftKey").slideUp();
		} else {
			$(".shiftKey").slideUp();
		}
	};
	//处理输入框回车事件
	function onInputKeyUp(e){
		if (e.keyCode === 13 ){//enter事件
			var submitBtn = $("#"+this.id.split("_")[0]+"_submitBtn");
			if (submitBtn && submitBtn.length>0){//sms可见 
				submitBtn.click(); 
				return false;
			}
		}
	}
})(jQuery);