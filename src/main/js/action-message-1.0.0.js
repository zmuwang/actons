/*
please see demoe http://127.0.0.1:8080/demo/action
 */
;
(function($) {
	var zindex=10000,tap_click = ("createTouch" in document) ? 'tap' : 'click';
	function buildPosition(dialog,container){
		var dtop=document.body.scrollTop,left = Math.floor(container.width() / 2 - dialog.width()
				/ 2), top =  Math.floor(dtop+$(window).height()/2-dialog.height()/2);
		if(left<0)top=0;
		if(top<dtop)top=dtopdtop;
		return {
			top : top,
			left : left,
			zIndex:zindex++
		};
	}
	function dialog(opts){
		this._init(opts);
	}
	$.extend(dialog.prototype,{
		_opts:{
			containerTpl:'body',
			dialogTpl:'<div class="action-dialog-model" style="position:absolute"/>',
			bodyTpl:'<div class="action-dialog-model-body"/>',
			btnsTpl:'<div class="action-dialog-model-btns"/>',
			btnTpl:'<button class="action-dialog-model-btn"/>',
			closeTpl:'<div class="action-dialog-model-close"  style="display:block;position:absolute;top:0;right:0;">x</div>',
			maskTpl:'<div style="display:block;width:100%;height:100%;background:#000;position:absolute;position:fixed;top:0;left:0;"/>',
			btnOkTitle:"确认",
			btnCancelTitle:"取消",
			showBtnOk:true,
			showBtnCancel:false,
			showBtnClose:false
		},
		_init:function(opts){
			this.opts=$.extend({},this._opts,opts);
			this.container=$(this.opts.containerTpl);
			this.show();
		},
		show:function(){
			var me=this;
			me.mask=$(me.opts.maskTpl).appendTo(me.container).css({zIndex:zindex++,opacity:0.2});
			me.dialog=$(me.opts.dialogTpl).appendTo(me.container);
			me.body=$(me.opts.bodyTpl).appendTo(me.dialog);
			me.opts.message&&me.body.html(me.opts.message);
			me.btns=$(me.opts.btnsTpl).appendTo(me.dialog);
			me.opts.showBtnOk&&$(me.opts.btnTpl).appendTo(me.btns).html(me.opts.btnOkTitle).on(tap_click,function(){
				me.close();
				$.evalData(me.opts.data);
			});
			me.opts.showBtnCancel&&$(me.opts.btnTpl).appendTo(me.btns).html(me.opts.btnCancelTitle).on(tap_click,function(){
				me.close();
			});
			me.opts.showBtnClose&&$(me.opts.closeTpl).appendTo(me.dialog).on(tap_click,function(){
				me.close();
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
					new dialog(param);
				},
				error : function() {
					this.warn();
				},
				confirm:function(){
					var message = this.message || errorMsg;
					new dialog({message:message,data:this.data,showBtnCancel:true});
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
})($)