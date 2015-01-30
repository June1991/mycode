/*********************

������ʵ��dialog��Ļ�������

********************/
;(function($){	
	var _showDialog = function(){
		/*��λ������*/
		var left = ($(document).width() - $(this).outerWidth(true)) / 2;  
		var top = ($(document).height() - $(this).outerHeight(true)) / 2; 
		$(this).css({position : 'absolute', top : top, left : left}) ;
		$(this).show();
		$("#dlg-shadelayer").show();
	}
	var _hideDialog = function(){
		$(this).hide();
		$("#dlg-shadelayer").hide();
	};
	
	var Dialog = window.Dialog = function(){
		 return {init:_init};
	};	
	var _init = function(callback,args){
		/*�������ֲ�*/
		$(".dlg-model:first").before("<div id='dlg-shadelayer' style='display:none;'></div>");
		$("#dlg-shadelayer").width($(document).width()).height($(document).height()); 
		

		$(".dlg-model").each(function(index){
			var DlgId = $(this).attr("id");
			var Dlg = document.getElementById(DlgId);
			$(this).hide();
			//���title
			var title =  $(Dlg).attr("data-title")?$(Dlg).attr("data-title"):"untitled";
			var titleHtml = "<div class='dlg-title'><h3>"+ title + "</h3><span class='dlg-close-icon'>x</span></div>";
			$(Dlg).prepend(titleHtml);
				
			$(Dlg).delegate(".dlg-done,.dlg-close-icon","click",function(){
				_hideDialog.call(Dlg);
			});
				
			if(callback){
				callback.call(Dlg,index,Dlg,args);
			}
		});
		$("[dlg-id]").each(function(){
			var DlgId = $(this).attr("dlg-id");
			var Dlg = document.getElementById(DlgId);
			if(null == Dlg) return;
			
			$(this).bind("click",function(){
				_showDialog.call(Dlg);
			});
		});	
	};	
	
		
})(jQuery);
var Dialog = Dialog();