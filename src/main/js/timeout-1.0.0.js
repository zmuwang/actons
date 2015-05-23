; (function($) {
	$.fn.timeout=function(){
		return this.each(function(){
            var $this = $(this),
            $text = $this.find(".action-time-text"),
            times = $this.attr("data-action-time-out-times") * 1;
            $text.html(buildTime(times));
            var ami = window.setInterval(function() {
                if (times <= 0) {
                    clearInterval(ami);
                    $this.removeClass("action-time-out");
                    $this.find(".action-time-out-class-remove").each(function() {
                        var $change = $(this);
                        $change.removeClass($change.attr("data-action-time-out-class-remove"));
                    });
                    $this.find(".action-time-out-class-add").each(function() {
                        var $change = $(this);
                        $change.addClass($change.attr("data-action-time-out-class-add"));
                    });
                    $this.find(".action-time-out-text-change").each(function() {
                        var $change = $(this);
                        $change.html($change.attr("data-action-time-out-text-change"));
                    });
                    $this.find(".action-time-out-show").each(function() {
                        var $change = $(this);
                        $change.show();
                    });
                    $this.find(".action-time-out-hide").each(function() {
                        var $change = $(this);
                        $change.hide();
                    });
                    $this.find(".action-time-out-state-change").each(function() {
                        var $change = $(this),
                        disable = this.disabled;
                        if (disable) $change.removeAttr("disabled");
                        else $change.attr("disabled", "disabled");
                    });
                    return;
                }
                times = times - 1000;
                $this.attr("data-action-time-out-times",times)
                $text.html(buildTime(times));
            },
            1000);
            function buildTime(t) {
            	if(t<0)return;
                var d=Math.floor(t/1000/60/60/24);
                var h=Math.floor(t/1000/60/60%24);
                var m=Math.floor(t/1000/60%60);
                var s=Math.floor(t/1000%60);
                format=$this.attr("data-action-time-out-format")||"HH:mm:ss";
                if(format.indexOf("dd")<0){
                	h=d*24+h;
                }else if(d==0&&format.indexOf("[dd")>=0){
                	format=format.replace(/\[dd.*\]/,"");
                }
                format=format.replace("[","").replace("]","");
                h = h < 10 ? "0" + h: h;
                m = m < 10 ? "0" + m: m;
                s = s < 10 ? "0" + s: s;
                return format.replace("ss",s).replace("mm",m).replace("HH",h).replace("dd",d);
            }    			
		});
	};
	
    $(function() {
        $(".action-time-out").timeout();
    });
})($);