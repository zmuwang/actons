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
			dialogTpl:'<div class="action-info-dialog" style="position:absolute"/>',
			msgTpl:'<div class="action-info-dialog-body"/>',
			btnsTpl:'<div class="action-info-dialog-btns"/>',
			btnTpl:'<button class="action-info-dialog-btn"/>',
			maskTpl:'<div style="display:block;width:100%;height:100%;background:#000;position:absolute;position:fixed;top:0;left:0;"/>',
			btnOkTitle:"确认",
			btnCancelTitle:"取消",
			showCancelBtn:false
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
			me.msg=$(me.opts.msgTpl).appendTo(me.dialog).html(me.opts.message);
			me.btns=$(me.opts.btnsTpl).appendTo(me.dialog);
			me.btnOk=$(me.opts.btnTpl).appendTo(me.btns).html(me.opts.btnOkTitle).on(tap_click,function(){
				me.close();
				$.evalData(me.opts.data);
			});
			me.opts.showCancelBtn&&$(me.opts.btnTpl).appendTo(me.btns).html(me.opts.btnCancelTitle).on(tap_click,function(){
				me.close();
			});
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
					var me=this,msg = me.message || errorMsg,container = $("body"), dialog = $('<div class="action-info-dialog" style="position:absolute"><div class="action-info-dialog-body"></div></div>'), infoBody = dialog
							.find(".action-info-dialog-body");
					infoBody.html(msg);
					dialog.appendTo(container).css(buildPosition(dialog,container)).show(2000,function(){
							dialog.hide().remove();
							$.evalData(me.data);
						});
				},
				warn:function(){
					var message = this.message || errorMsg;
					new dialog({message:message,data:this.data});
				},
				error : function() {
					this.warn();
				},
				confirm:function(){
					var message = this.message || errorMsg;
					new dialog({message:message,data:this.data,showCancelBtn:true});
				}
			});
})($)