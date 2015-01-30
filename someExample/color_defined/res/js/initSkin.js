(function ($){
	var win = window,
		link = null;
	win.curColor = null;
	win.curType = null;
	var colors = ['#B23232', '#009883', '#6CBF40', '#3387CC','#7948A2'], 
		style_name = ["red","green","olivine","blue","purple"];//系统颜色值映射。
	function addSheetFile(path){ 
		var fileref=document.createElement("link") 
		fileref.rel="stylesheet"; 
		fileref.type="text/css"; 
		fileref.href=path; 
		fileref.media="screen"; 
		var headobj=document.getElementsByTagName('head')[0]; 
		headobj.appendChild(fileref); 
		return fileref;
	} 
	/**
	 * @description 这里系统的模板用css，而自定义采用style.
	 */
	function selectColor(color, type){
		if ($("#sfSkin")){
			$("#sfSkin").remove();
		}
		if (link) {
			$(link).remove();
		}
		if (type == "system") {
			var prefix = "../share/addisclaimer-tpl/res/",
				css_name = style_name[colors.indexOf(color)],
				pc = prefix +"pc_colors_"+css_name+".css",
				pc_css = '<link href="'+pc+'" rel="stylesheet" type="text/css"/>',
				mobile = prefix + "mobile_colors_" + css_name+".css",
				mobile_css = '<link href="'+mobile+'" rel="stylesheet" type="text/css"/>';
			
			$("#mobileStyle").val(mobile_css);
			$("#pcStyle").val(pc_css);
			link = addSheetFile(pc);
		} else {
			$('body').SFColorSkins({
				mainColor: color,
				url: 'skin.xml',
				page: 'PC.html'
			});
		}
		curColor = color;
		curType = type;
		selectObj.sfColorObj.setColor(color);
	}
	function getJsonValue(){
		var v = {
			color : curColor,
			type : curType,
			pcStyle : $("#pcStyle").val(),
			mobileStyle : $("#mobileStyle").val()
		};
		return v;
	}
	function setJsonValue(v){
		selectObj.sfColorObj.toggleCard('list');
		selectColor(v.color,v.type);
	}
	win.getJsonValue = getJsonValue;
	win.setJsonValue = setJsonValue;
	function getParams(val){
		var reg = new RegExp("(^|\\?|&)"+ val +"=([^&#]*)(\\s|&|$|#)", "i");
		if (reg.test(location.href)) return unescape(RegExp.$2); 
		return ""; 
	}
	//这个函数必须在全部东西都加载后再调用
	function initSkin(){
		var color = getParams("color") || "#1588e5";
		var type = getParams("type") || "system";
		setJsonValue({color:"#"+color,type:type});
	}
	/**
	 * 初始化广告
	 * @method initAd
	 */
	function initAd(){
		/*广告图片*/
		var slide = $("#slideContainer");
		if (slide){
			slide.bslider({
				width: 632,
				height: 392,
				delay: 3000,
				autofit: false,
				items:PAGECONFIG.adItems,
				pager: 'both'
			});
		}
	}
	var selectObj;
	$(document).ready(function(){
		selectObj = $('#pickr');
		selectObj.sfColorPickr({
			samples: colors,
			callback: function(c, i) {
				curColor = c;
				selectColor(c, i< colors.length ? "system" :"custom");
			}
		});
		initSkin();
		//var cmpid = getParams("cmpid");
		$("#okbtn").on("click",function(){
			if(window.opener){
				/*var cmp = window.opener.Ext.getCmp(cmpid);
				if(cmp){
					cmp.setJsonValue(getJsonValue(),"copy");
				}*/
				window.opener.TransfromBgColor(getJsonValue());
			}
			window.opener=null;window.open('','_self');
			window.close();
		});
		$("#cancelbtn").on("click",function(){
			window.opener=null;window.open('','_self');
			window.close();
		});
	});
})(jQuery)