(function($){
$.fn.dayuwscroll = function(param){
	var o = $.extend({
		parent_ele:'#t1',
		list_btn:'#tabT04',
		pre_btn:'#left',
		next_btn:'#right',
		path: 'left',
		auto:true,
		time:5000,
		num:1,
		gd_num:1,
		waite_time:1000
	},param);

	var target_ele = $(this).selector;
	var $left = $(o.pre_btn);
	var $right = $(o.next_btn);
	var $con = $(target_ele).find('li');
	var curr = 0;
	var len = $con.length;
	var count_page = Math.ceil(len / o.gd_num);
	var out_width = $con.outerWidth(true);
	var out_height = $con.outerHeight(true);
	var clear_time = null;
	var wait_time = null;
	var first_click = true;
	var wrapbox_w = out_width * o.num;
	var scrollbox_w = wrapbox_w * count_page;
	//$con.clone().appendTo(target_ele);


	function init(){
		$(o.parent_ele).css({'width':wrapbox_w+'px','height':out_height+'px','overflow':'hidden'});
		$(target_ele).css({'width':scrollbox_w+'px','height':out_height+'px'});
		if(o.auto){
			auto_play();
		}
		scroll_mousehover();
	}

	function auto_play(){
		switch(o.path){
			case 'left':
				clear_time = window.setInterval(function(){left__click();},o.time);
				break;
			case 'right':
				clear_time = window.setInterval(function(){right_click();},o.time);
				break;
			default :
				clear_time = window.setInterval(function(){left__click();},o.time);
				break;
		}
	}

	function list_btn_style(i){
		$(o.list_btn+' li').removeClass('cur');
		$(o.list_btn+' li').eq(i).addClass('cur');
	}

	function goto_curr(page){
		if(page > count_page){
			curr = 0;
			$(o.parent_ele).scrollLeft(0);
			$(o.parent_ele).animate({scrollLeft:wrapbox_w},500);
		}else{
			var sp = (page + 1) * wrapbox_w;
			if($(o.parent_ele).is(':animated')){
				$(o.parent_ele).stop();
				$(o.parent_ele).animate({scrollLeft:sp},500);
			}else{
				$(o.parent_ele).animate({scrollLeft:sp},500);
			}

			curr = page + 1;
		}
	}

	$(o.list_btn+' li').click(function(){
		var curLiIndex = $(this).index();
		list_btn_style(curLiIndex);
		curr = curLiIndex -1;

		goto_curr(curr);
	})

	function left__click(){
	
		window.clearInterval(clear_time);
		window.clearTimeout(wait_time);

		curr++;

		if(curr >= count_page ){
			curr = 0;
		}

		var curLiIndex = curr;
		list_btn_style(curLiIndex);

		if (first_click) {
			curr = curLiIndex - 1;
			first_click = false;
		} else {
			curr = curLiIndex - 1;
		}

		goto_curr(curr);

		if(o.auto){
			wait_time = setTimeout(function(){auto_play()},o.waite_time);
		}
	}

	$left.bind('click',left__click)

	function right_click(){
		window.clearInterval(clear_time);
		window.clearTimeout(wait_time);

		curr--;
		if(curr  < 0 ){
			curr = count_page - 1;
		}else if ( curr == (count_page- 1)){
			curr = 0;
		}
		var curLiIndex = curr;
		list_btn_style(curLiIndex);

		curr = curLiIndex -1;


		goto_curr(curr);

		if(o.auto){
			wait_time = setTimeout(function(){auto_play()},o.waite_time);
		}
	}

	function scroll_mousehover(){
		$con.mouseover(function(){
			window.clearInterval(clear_time);
			window.clearTimeout(wait_time);
		});
		$con.mouseout(function(){
			if(o.auto){
				wait_time = setTimeout(function(){auto_play()},o.waite_time);
			}
		})
	}

	$right.bind('click',right_click);

	return init();
}
})(jQuery)



var time=new Date();
time=time.getTime();
var userAgent = navigator.userAgent.toLowerCase();
jQuery.browser = {
    version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
    safari: /webkit/.test(userAgent),
    //opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    //mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
    chrome: /chrome/.test(userAgent)
};

jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.fn.gallery = function(config) {
    var _self = this;
    var defaults = {};
    var opts = $.extend(defaults, config);

    var clickable = true;
    var changing = false;
    var interval;
    var no_click;
    var positions = {
        // current: {zIndex: 100, top: "1px",  left: "200px" },
        // left: {zIndex: 50, top: "20px", left: "0" },
        // right: {zIndex: 25,  top: "20px", left: "459px" },
		// none: {zIndex: 0,  top: "20px", left: "200px" }

        current: {zIndex: 100, top: "0px",  left: "140px" },
        left: {zIndex: 50, top: "10px", left: "0" },
        right: {zIndex: 25,  top: "10px", left: "332px" },
        none: {zIndex: 0,  top: "10px", left: "140px" }
    };
    // var currentD = {width:"599px",height:"353px" };
    // var backD = { width:"527px", height:"310px" };

    var currentD = {width:"419px",height:"247px" };
    var backD = { width:"367px", height:"217px" };


    var $current = {
        li: $(config.current[0]),
        img: $(config.current[1])
    };
    var $left = {
        li: $(config.left[0]),
        img: $(config.left[1])
    };
    var $right = {
        li: $(config.right[0]),
        img: $(config.right[1])
    };
     var $none = {
        li: $(config.none[0]),
        img: $(config.none[1])
    };
    var go = function(target, jqueryCssJson, callback) {
        setTimeout(function() {
            if(jqueryCssJson.zIndex) {
                target.css("z-index", jqueryCssJson.zIndex+1);
            }

        }, config.duration/4 * 2);
        setTimeout(function() {
            target.animate(jqueryCssJson, config.duration || 1000, callback);
        }, config.actionTime || 50);
    };

    var setBlur = function(target) {
        var src = target.img.attr("src");
        if(src.indexOf("blur") != -1) {
            return;
        }
        src = src.substr(0, src.lastIndexOf("."));
		src+=".png"+"?version="+time;
        target.img.attr("src", src);
    };

    var setClear = function(target) {
        var src = target.img.attr("src");
        if(src.indexOf("blur") == -1) {
            return;
        }
        src = src.substr(0, src.lastIndexOf("_"));
		src+=".jpg"+"?version="+time;
        target.img.attr("src", src);
    };

    var toLeft = function(callback) {
	 $active = $('.btn  a.active').next();
         if ( $active.length === 0) { //If paging reaches the end...
         	$active = $('.btn  a:first'); //go back to first
                                //alert($active.length);
          }
          $(".btn a").removeClass('active'); //Remove all active class
          $active.addClass('active'); //Add active class (the $active is declared in the rotateSwitch function)
        if(!clickable) return;
        clickable = false;

	go($left.li, positions.none);
       	go($none.li, positions.right);
        go($right.li, positions.current);
	go($current.li, positions.left);


        go($current.img, backD, function() {
            setBlur($current);
        });
        go($left.img, backD, function() {
            setBlur($left);
        });
		go($none.img, backD, function() {
            setBlur($none);
        });

        go($right.img, currentD, function() {

            setClear($right);
			$temp = $none;
			$none = $left;
			$left = $current ;
			$current = $right;
			$right = $temp;
			callback();
            clickable = true;
        });
    };

    var toRight = function(callback) {
	 $active1 = $('.btn  a.active').prev();
          if ( $active1.length === 0) { //If paging reaches the end...
            $active1 = $('.btn  a:last'); //go back to first
              }
            $(".btn a").removeClass('active'); //Remove all active class
            $active1.addClass('active'); //Add active class (the $active is declared in the rotateSwitch function)
        if(!clickable) return;
        clickable = false;
        go($current.li, positions.right);
        go($right.li, positions.none);
		go($none.li, positions.left);
        go($left.li, positions.current);
        go($current.img, backD, function() {
            setBlur($current);
        });
        go($right.img, backD, function() {
            setBlur($current);
        });
		go($none.img, backD, function() {
            setBlur($current);
        });
        go($left.img, currentD, function() {
            setClear($left);
            $temp = $current;
            $current = $left;
	    $left = $none;
	    $none = $right;
            $right = $temp;
            callback();
            clickable = true;
        });
    };


    var clearEvents = function() {
        $current.img.unbind("click");
        $left.img.unbind("click");
        $right.img.unbind("click");
	$none.img.unbind("click");
	$(".btn1").unbind("click");
	$(".btn2").unbind("click");
	$(".btn3").unbind("click");
	$(".btn4").unbind("click");
    };

function start(){
 interval = autoGo();
}
function is_start(){
        if(no_click){
                clearTimeout(no_click);
                no_click = setTimeout(start, 1000);
        }else{
                no_click = setTimeout(start, 1000);
        }

}
    var bindEvent = function() {

        $left.img.bind("click", function(){
	    stopAutoGo();
            if(config.start) {
                config.start();
            }
		clearEvents();
            toRight(function() {
                bindEvent();
            });
            if(config.end) {
                setTimeout(config.end, config.duration || 1000);
            }
		is_start();
        });
        $right.img.bind("click", function() {
	    stopAutoGo();
            if(config.start) {
                config.start();
            }
		clearEvents();
            toLeft(function() {
                bindEvent();
            });
            if(config.end) {
                setTimeout(config.end, config.duration || 1000);
            }
		 is_start();
        })


function Rightmove(){
	if(config.start) {
             config.start();
                }
              toLeft(function() {
              clearEvents();
	    //  setTimeout(bindEvent, 350);
            // bindEvent();
                });
         if(config.end) {
             setTimeout(config.end, 2);
               }

}
function Leftmove(){
        if(config.start) {
             config.start();
                }
              toRight(function() {
             clearEvents();
	     // setTimeout(bindEvent, 350);
             // bindEvent();
                });
         if(config.end) {
             setTimeout(config.end, 2);
               }
}
function Rightmove1(){
        if(config.start) {
             config.start();
                }
              toLeft(function() {
              clearEvents();
            //  setTimeout(bindEvent, 350);
             bindEvent();
                });
         if(config.end) {
             setTimeout(config.end, 2);
               }
 is_start();

}
function Leftmove1(){
        if(config.start) {
             config.start();
                }
              toRight(function() {
             clearEvents();
             // setTimeout(bindEvent, 350);
              bindEvent();
                });
         if(config.end) {
             setTimeout(config.end, 2);
               }
		 is_start();
}
function is_bind(){
	if($(".btn2").data("events")["click"] ){
	}


}

	$(".btn1").bind("click",function(){
		stopAutoGo();
	//	is_bind();
		$active = $('.btn  a.active');
		var leg = $active.attr("rel")-1;
		if(leg==1){
			Leftmove1();
		}else if(leg==2){
			 clearEvents();
			Leftmove();
			setTimeout(Leftmove1, 700);
		}else if(leg ==3){
			 Rightmove1();
		}
	})
	$(".btn2").bind("click",function(){
		stopAutoGo();
		  $active = $('.btn  a.active');
                var leg = $active.attr("rel");
                if(leg==3){
                        Leftmove1();
                 }else  if(leg==4){
			 clearEvents();
			Leftmove();
                        setTimeout(Leftmove1, 700);
                }else if(leg==1){
                         Rightmove1();
                }
        })
	$(".btn3").bind("click",function(){
		stopAutoGo();
		$active = $('.btn  a.active');
                var leg = $active.attr("rel");
                if(leg==2){
                        Rightmove1();
                 }else if(leg== 1){
				 clearEvents();
				Rightmove();
                                setTimeout(Rightmove1, 700);
                }else if(leg ==4){
                         Leftmove1();
                }
        })
	$(".btn4").bind("click",function(){
		stopAutoGo();
		$active = $('.btn  a.active');
                var leg = $active.attr("rel");
                if(leg==3){
                        Rightmove1();
                }else if(leg== 2){
			 clearEvents();
                        Rightmove();
			setTimeout(Rightmove1, 700);
                }else if(leg == 1){
                         Leftmove1();
                }
        })
    };



    bindEvent();

    var autoGo = function(callback) {
        if(changing) return;
        changing = true;
        interval = setInterval(function() {
            if(config.start) {
                config.start();
            }
            toLeft(function() {
                clearEvents();
                bindEvent();
            });
            if(config.end) {
                setTimeout(config.end, config.duration || 1000);
            }
        }, config.changeTimeout || 3000);
        if(callback) callback();
        return interval;
    };

    function stopAutoGo() {
        if(interval) {
            clearInterval(interval);
        }
        $current.img.unbind("mouseover");
        changing = false;
    }

    if(config.autoChange) {
        $(config.stopTarget).bind("mouseenter", function(e) {
            stopAutoGo();
        });
        $(config.stopTarget).bind("mouseleave", function(e) {
            interval = autoGo();
        });

        interval = autoGo();
    }

};



/*回到首页*/
$.scrollUp = function (options) {

    // Settings
    var settings = {
        scrollName: 'scrollUp', // Element ID
        topDistance: '300', // Distance from top before showing element (px)
        topSpeed: 300, // Speed back to top (ms)
        animation: 'fade', // Fade, slide, none
        animationInSpeed: 200, // Animation in speed (ms)
        animationOutSpeed: 200, // Animation out speed (ms)
        scrollText: '返回顶部', // Text for element
        activeOverlay: false // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    };

    // Load settings
    if (options) {
        var settings = $.extend(settings, options);
    }

    // Shorthand setting names
    var sn = '#' + settings.scrollName,
        an = settings.animation,
        os = settings.animationOutSpeed,
        is = settings.animationInSpeed,
        td = settings.topDistance,
        st = settings.scrollText,
        ts = settings.topSpeed,
        ao = settings.activeOverlay;

    // Create element
    $('<a/>', {
        id: settings.scrollName,
        href: '#top',
        title: st,
        text: st
    }).appendTo('body');

    // Minium CSS to make the magic happen
    $(sn).css({
        'display':'none',
        'position': 'fixed',
        'z-index': '2147483647'
    })

    // Active point overlay
    if (ao) {
        $("body").append("<div id='"+ settings.scrollName +"-active'></div>");
        $(sn+"-active").css({ 'position': 'absolute', 'top': td+'px', 'width': '100%', 'border-top': '1px dotted '+ao, 'z-index': '2147483647' })
    }

    // Scroll funtion
    $(window).scroll(function(){

        // Fade animation
        if (an === "fade") {
            $( ($(window).scrollTop() > td) ? $(sn).fadeIn(is) : $(sn).fadeOut(os) );
        }

        // SlideUp animation
        else if (an === "slide") {
            $( ($(window).scrollTop() > td) ? $(sn).slideDown(is) : $(sn).slideUp(os) );
        }

        // No animation
        else {
            $( ($(window).scrollTop() > td) ? $(sn).show(0) : $(sn).hide(0) );
        }

    });

    // Back to the top
    $(sn).click( function(event) {
        $('html, body').animate({scrollTop:0}, ts);
        return false;
    });

}; // End scrollUp function