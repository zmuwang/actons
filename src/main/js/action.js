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

	$.fn.ajaxAction.defaultOpts = {};

	var ajaxAction = function(element, options) {
		this._init(element, options);
	};

	$.extend(ajaxAction, {
		prototype : {
			_init : function(element, options) {
				var me = this;
				me.element = element;
				me.opts = $.extend({}, $.fn.ajaxAction.defaultOpts, options);
				me._ajax();
			},
			_ajax : function() {
				var me = this, ajaxOpts = {
					type : me.element.attr("method") || "GET",
					dataType : "jsonp",
					jsonp : "_callback",
					url : me.element.attr("data-url")
							|| me.element.attr("href")
							|| me.element.attr("action"),
					success : function(data, status, xhr) {
						me._action(data);
					},
					error : function(xhr, errorType, error) {
						var data = "";
						if (errorType == "parsererror" && xhr.status == "200"
								&& xhr.statusText == "OK"
								&& xhr.responseText != "") {
							data = xhr.responseText;
						} else {
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
				if (!ajaxOpts.url || me.element.data(data_loading)||me.element.hasClass("action-ajax-disable"))
					return;
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
				$.extend(me, data);
				me[me.action].call(me);
				callback && eval(callback);
			},
			_alert : function(message) {
				alert(message);
			},
			info : function() {
				this.error();
			},
			warn : function() {
				this.error();
			},
			error : function() {
				var message = this.message || errorMsg;
				this._alert(message);
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
						msg = msg + this.message + "\n";
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
				location.reload();
			},
			topRefresh : function() {
				top.location.reload();
			},
			popWin : function() {

			},
			openIframe : function() {

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
			}
		}
	});

	$(function() {
		$(".action-ajax-load").each(function() {
			$(this).ajaxAction();
		});
		$("body").on(tap_click, ".action-ajax-click", function(e) {
			e.preventDefault();
			$(this).ajaxAction();
			return false;
		});
		$("body").on("submit", ".action-ajax-form", function(e) {
			var form = $(this);
			form.find(".action-fileds-errors").empty();
			form.find(".action-filed-error").empty();
			e.preventDefault();
			form.ajaxAction({
				ajaxOpts : {
					data : form.serialize()
				}
			});
			return false;
		});
	});

})($)