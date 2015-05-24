/*
please see demoe http://127.0.0.1:8080/demo/action
 */
;
(function($) {
	var tap_click = ("createTouch" in document) ? 'tap' : 'click', data_loading = "action-ajax-loading", errorMsg = "Server error";
	$.fn.ajaxAction = function(options) {
		return this.each(function() {
			new ajaxAction($(this), options);
		});
	}
	$.evalData=function(data){
		if(!data)return;
		try{return window.eval(data);}catch(e){};
	};
	$.isCrossDomain=function(url){
		if(!/^((http|https)?:)?\/\//.test(url))return false
		var lc=window.location,h=lc.protocol+"//"+lc.host+"/";
		if(url.startsWith("//"))url=lc.protocol+url;
		return !url.startsWith(h);
	}
	$.fn.ajaxAction.defaultOpts = {};

	var ajaxAction = function(element, options) {
		this._init(element, options);
	};

	$.extendAction = function(actions) {
		$.extend(ajaxAction.prototype, actions);
	};

	$.extendAction({
		_init : function(element, options) {
			var me = this;
			me.element = element;
			me.opts = $.extend({}, $.fn.ajaxAction.defaultOpts, options);
			$.extend(me,me.opts.actions||{});
			me._ajax();
		},
		_ajax : function() {
			var me = this, ajaxOpts = {
				type : me.element.attr("method") || "GET",
				jsonp : "_callback",
				cache:false,
				url : me.element.attr("data-url")
						|| me.element.attr("href")
						|| me.element.attr("action"),
				success : function(data, status, xhr) {
					me._action(data);
				},
				error : function(xhr, errorType, error) {
					var data = "";
	                if(errorType =="parsererror" && xhr.status=="200" &&xhr.statusText=="OK"&&xhr.responseText!=""){
	                    data = xhr.responseText;
	                }else {
						data = {
							state : 503,
							errorType : errorType,
							message : error || errorMsg,
							action : "error"
						};
					}
					me._action(data);
				}
			};
			ajaxOpts = $.extend(ajaxOpts, me.opts.ajaxOpts);
			var url=ajaxOpts.url;
			if(ajaxOpts.type!="GET")ajaxOpts.dataType=null;
			if (!url || me.element.data(data_loading)
					|| me.element.hasClass("action-ajax-disable")||$.evalData(me.element.attr("data-action-call-before"))===false)
				return;
			if($.isCrossDomain(url)){
				ajaxOpts.dataType="jsonp";
			}
			me.element.data(data_loading, true);
			$.ajax(ajaxOpts);
		},
		_action : function(data) {
			var me = this, callback = me.element
					.attr("data-action-call-back");
			me.element.data(data_loading, false);
			if (typeof data == 'string') {
				data = {
					action : "string",
					data : data
				};
			}
			if (typeof data == "undefined" || !data.action
					|| !me[data.action])
				return;
			//form 
			if(["warn","error"].indexOf(data.action)>=0&&me.element[0].tagName=="FORM"&&me.element.find(".action-fileds-errors").length){
				data={action:"filedsError",data:[{name:"action-fileds-errors",message:data.message||data.data}]};
			}
			$.extend(me, data);
			me[me.action].call(me);
			callback && $.evalData(callback);
		},
		_alert : function(message) {
			var msg=message||this.message;
			msg=msg.replace(/<br\/>/ig,"\n")
			alert(msg);
			message&&$.evalData(this.data);
		},
		info : function() {
			this._alert();
		},
		warn : function() {
			this._alert();
		},
		error : function() {
			this._alert();
		},
		confirm:function(){
			var message = this.message || errorMsg;
			confirm(message)&&$.evalData(this.data);
		},
		filedsError : function() {
			var me = this, form = me.element, errorsText = form
					.find(".action-fileds-errors"), errorFileds = form
					.find(".action-filed-error");
			if (errorsText.length) {
				errorsText.empty();
				$.each(me.data, function() {
					errorsText.append(this.message).append("<br/>");
				});
			} else if (errorFileds.length) {
				$.each(me.data, function() {
					errorFileds.filter("[for=" + this.name + "]").empty()
							.append(this.message);
				});
			} else {
				var msg = "";
				$.each(me.data, function() {
					msg = msg + this.message + "<br/>";
				});
				this._alert(msg);
			}
		},
		redirect : function() {
			var url = this.data || this.message || location.href;
			url && (window.location.href = url);
		},
		topRedirect : function() {
			var url = this.data || this.message || location.href;
			url && (top.location.href = url);
		},
		refresh : function() {
			window.location.reload();
		},
		topRefresh : function() {
			top.location.reload();
		},
		render : function() {
			var me = this;
			$.each(me.data, function() {
				$(this.target).html(this.value);
			});
		},
		html : function() {
			var me = this, items = me.element.attr("data-action-html");
			items = !items ? me.element : $(items);
			items.html(this.data);
		},
		string : function() {
			this.html();
		},
		eval:function(){
			$.evalData(this.data);
		}
	});

	$(function() {
		$(".action-ajax-load").each(function() {
			$(this).ajaxAction();
		});
		$("body").on(tap_click, ".action-ajax-click", function(e) {
			// e.preventDefault();
			$(this).ajaxAction();
			return false;
		});
		$("body").on("submit", ".action-ajax-form", function(e) {
			var form = $(this);
			form.find(".action-fileds-errors").empty();
			form.find(".action-filed-error").empty();
			// e.preventDefault();
			form.ajaxAction({
				ajaxOpts : {
					data : form.serialize()
				}
			});
			return false;
		});
	});

})($)