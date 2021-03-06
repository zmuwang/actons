/*
please see demoe http://127.0.0.1:8080/demo/action
 */
;
(function($) {
	var zindex=10000;
	function buildPosition(dialog,container){
		var w=$(window),dtop=w.scrollTop(),left = Math.floor(container.width() / 2 - dialog.width()
				/ 2), top =  Math.floor(dtop+w.height()/2-dialog.height()/2);
		if(left<0)top=0;
		if(top<dtop)top=dtop;
		return {
			top : top,
			left : left,
			zIndex:zindex++
		};
	}
	function dialog(opts){
		this._init(opts);
	}
	$.actionDialog=function(opts){
		return new dialog(opts);
	};
	$.actionDialog.extend=function(exts){
		$.extend(dialog.prototype,exts);
	};
	$.actionDialog.extend({
		_opts:{
			containerTpl:'body',
			dialogTpl:'<div class="action-dialog-model" style="position:absolute"/>',
			bodyTpl:'<div class="action-dialog-model-body"/>',
			btnsTpl:'<div class="action-dialog-model-btns"/>',
			btnTpl:'<button class="action-dialog-model-btn action-dialog-model-close"/>',
			closeTpl:'<div class="action-dialog-model-close"  style="display:block;position:absolute;top:0;right:0;">x</div>',
			maskTpl:'<div class="" style="display:block;width:100%;height:100%;background:#000;position:absolute;position:fixed;top:0;left:0;"/>',
			btnOkTitle:"确认",
			btnCancelTitle:"取消",
			closeBtnSelect:".action-dialog-model-close",
			showBtnOk:true,
			showBtnCancel:false,
			showBtnClose:false
		},
		_init:function(opts){
			if(typeof opts=="string"){
				opts={message:opts};
			}
			this.opts=$.extend({},this._opts,opts);
			this.container=$(this.opts.containerTpl);
			this.show();
		},
		show:function(){
			var me=this;
			me.mask=$(me.opts.maskTpl).appendTo(me.container).css({zIndex:zindex++,opacity:0.2});
			me.dialog=$(me.opts.dialogTpl).appendTo(me.container);
			var bp=me.dialog;
			while(bp.children().length==1){
				bp=bp.children();
			}
			me.body=$(me.opts.bodyTpl).appendTo(bp);
			me.opts.message&&me.body.html(me.opts.message);
			me.btns=$(me.opts.btnsTpl).appendTo(me.dialog);
			if(me.opts.showBtnOk){
				me.btnOk=$(me.opts.btnTpl).appendTo(me.btns).html(me.opts.btnOkTitle);
			}
			me.opts.showBtnCancel&&$(me.opts.btnTpl).appendTo(me.btns).html(me.opts.btnCancelTitle);
			me.opts.showBtnClose&&$(me.opts.closeTpl).appendTo(me.dialog);
			me.dialog.on($.tap_click,me.opts.closeBtnSelect,function(){
				me.close();
				me.btnOk&&this==me.btnOk[0]&&$.evalData(me.opts.data);
			});
			if(!me.btns.html())me.btns.remove();
			me.dialog.css(buildPosition(me.dialog,me.container)).show();
		},
		close:function(){
			var me=this;
			me.dialog.remove();
			me.mask.remove();
		}
	});

	$.extendAction({
				info : function() {
					var me=this,msg = me.message || errorMsg,container = $("body"), dialog = $('<div class="action-dialog-info" style="position:absolute"><div class="action-dialog-info-body"></div></div>'), infoBody = dialog
							.find(".action-dialog-info-body");
					infoBody.html(msg);
					dialog.appendTo(container).css(buildPosition(dialog,container)).css({opacity:0}).animate({opacity:1},2000,function(){
							dialog.hide().remove();
							$.evalData(me.data);
						});
				},
				_alert:function(message){
					var param={message:message||this.message};
					if(!message)param.data=this.data;
					$.actionDialog(param);
				},
				error : function() {
					this.warn();
				},
				confirm:function(){
					var message = this.message || errorMsg;
					$.actionDialog({message:message,data:this.data,showBtnCancel:true});
				},
				popHtmlFragment : function() {
					new dialog({bodyTpl:this.data,showBtnOk:false,showBtnClose:true});
				},
				popHtmlFragmentUrl : function() {
					var me=this;
					me.element.ajaxAction({
						actions:{
							string : function() {
								new dialog({
									bodyTpl : this.data,
									showBtnOk : false,
									showBtnClose : true
								});
							}
						},
						ajaxOpts:{
							url:me.data
						}
					});
				}
			});
	$(function(){
		$(document).on($.tap_click,".action-dialog-model-close-top",function(){
			
		})
	});
	/*
	$(function(){
		$.actionDialog.extend({
			_opts:{
				containerTpl:'body',
				dialogTpl:'<div class="popup-wrapper popup-wrapper-type-1 ms-popup" id="popup-ms-share-all"  style="position:absolute"><div class="popup popup-normal popup-1 popup-share-all"></div></div>',
				bodyTpl:'<div class="popup-content"/>',
				btnsTpl:'<div class="popup-close-btn"/>',
				btnTpl:' <a href="javascript:void(0)" class="btn btn-orange-line btn-sure action-dialog-model-btn action-dialog-model-close"/>',
				closeTpl:'<a href="javascript:void(0)" class="close">×</a>',
				maskTpl:'<div class="" style="display:block;width:100%;height:100%;background:#000;position:absolute;position:fixed;top:0;left:0;"/>',
				btnOkTitle:"确认",
				btnCancelTitle:"取消",
				closeBtnSelect:".action-dialog-model-close",
				showBtnOk:true,
				showBtnCancel:false,
				showBtnClose:false
			}
		});
		
	});
	*/
})($)