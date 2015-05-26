/*
please see demoe http://127.0.0.1:8080/demo/action
 */
;
(function($) {
	var tap_click = ("createTouch" in document) ? 'tap' : 'click',
		attrActionValidRule="data-action-valid-rule",
		attrActionValidMsg="data-action-valid-msg",
		clzFiledError="action-vaild-error",
		selectErrorFiled=".action-filed-error";
	var methods={
			required: function( value, element, param ) {
				return $.trim( value ).length > 0;
			},
			email: function( value, element ) {
				return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
			},
			url: function( value, element ) {
				return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value );
			},
			date: function( value, element ) {
				return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
			},
			number: function( value, element ) {
				return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
			},
			digits: function( value, element ) {
				return /^\d+$/.test( value );
			},
			minlength: function( value, element, param ) {
				return value.length >= param*1;
			},
			maxlength: function( value, element, param ) {
				return value.length <= param*1;
			},
			min: function( value, element, param ) {
				return value*1 >= param*1;
			},
			max: function( value, element, param ) {
				return value*1 <= param*1;
			},
			equalTo: function( value, element, param ) {
				return value === $( param ).val();
			},
			reg:function( value, element, param ){
				return new RegExp(param).test(value);
			}
	},
	messages={
			required: "请输入内容",
			email: "请输入EMAIL.",
			url: "请输入URL.",
			date: "请输入日期.",
			number: "请输入数字",
			digits: "请输入数字（正数）.",
			equalTo: "请输入相同的值",
			maxlength: "请输入至多{0}个字符",
			minlength: "请输入至少{0}个字符",
			max: "请输入不大于{0}的数",
			min:"请输入不小于{0}的数",
			reg:"请输入合法的字符"
	};
	var filedVaild=function(filed){
		this.filed=$(filed);
		return this;
	}
	$.extend(filedVaild.prototype,{
		vaild:function(){
			var me=this,filed=me.filed,rule=filed.attr(attrActionValidRule),v=true;
			if(!rule||filed.attr('readonly') || filed.attr('disabled'))return v;
			this.clean();
			$.each(rule.split(";"),function(){
				if(!$.trim(this).length)return;
				var ps=this.split(":"),m=ps[0],ret=methods[m].call(window,me.val(),filed,ps[1]);
				if(ret===false){
					var msg=filed.attr(attrActionValidMsg+"-"+m)||filed.attr(attrActionValidMsg)||messages[m].replace("{0}",ps[1]);
					me.show(msg);
					v=ret;
					return false;
				}
			});
			return v;			
		},
		val:function (){
			return this.filed.val();
		},
		show:function(msg){
			this.filed.parent().find(selectErrorFiled).html(msg);
			this.filed.addClass(clzFiledError);
		},
		clean:function(){
			this.filed.parent().find(selectErrorFiled).empty();
			this.filed.removeClass(clzFiledError);
		}
	});
	$.actionValid=function(form){
		var f=$(form),fileds=f.find( "input, select, textarea"),ret=true;
		fileds.each(function(){
			!(new filedVaild(this).vaild())&&(ret=false);
		});
		return ret;
	};
	$(function(){
		$("body").on("blur", ".action-valid-filed", function(e) {
			new filedVaild(this).vaild();
		});
	});
})($)