(function($) {
    $.extend({
        checkdom: function (options) {
            var init = false;
            if($('body').data('checkdom')){
                init=true;
                return true;
            }
        
            var defaults = { attachElement: false, auto: false, exclude: '' };
            
            var deprecatedTags = {
                'dir': 'UL',
                'menu':'UL',
                'applet': 'OBJECT',
                'embed': 'OBJECT',
                'isindex': 'INPUT',
                'basefont': 'CSS',
                'center': 'CSS',
                'font': 'CSS',
                'strike': 'CSS',
                's': 'CSS',
                'i': 'CSS',
                'u': 'CSS'
            }
            
            var deprecatedAtt = {
                'alink': 'CSS',
                'align': 'CSS',
                'background': 'CSS',
                'color': 'CSS',
                'compact': 'CSS',
                'face': 'CSS',
                'border': 'CSS',
                'language': 'type',
                'link': 'CSS',
                'noshade': 'CSS',
                'nowrap': 'CSS',
                'start': 'CSS',
                'version': 'CSS',
                'vlink': 'CSS'
            }
            
            if (options) {
                $.extend(defaults, options);
            }
            
            var uid = 0;
            
            var opts = defaults;
            
            var methods = {
                showError: function(){
                    $('body').addClass('debuging');
                },
                hideError: function(){
                    $('body').removeClass('debuging');
                },
                checkid: function(){
                    var $ids = $('[id]');
                    var bucket = new Object();
                    $ids.each(function(){
                        var thisid = $(this).attr('id');
                        bucket[thisid] = (bucket[thisid])? bucket[thisid] + 1 : 1;
                    });
                    $.each(bucket,function(index,value){
                        if(value>1)methods.addError('id',index, value+' elements with  ID #'+index);
                    })
                },
                checkImgAlt: function(){
                    $('img').each(function(){
                        if(! $(this).attr('alt') ){
                            methods.addError('imgalt',$(this), 'IMG: No ALT attribute');
                        }
                    });
                },
                checkImgDimension: function(){
                    $('img').each(function(){
                        if((!$(this).attr('height')) || (! $(this).attr('width')) ){
                            methods.addError('dimension',$(this), 'IMG: No width/height attributes','warning');
                        }
                    });
                },
                checkATitle: function(){
                    $('a').each(function(){
                        if(! $(this).attr('title') ){
                            methods.addError('atitle',$(this), 'A: No Title attribute', 'warning');
                        }
                    });
                },
                checkH1: function(){
                    if($('h1').length > 1)methods.addError('h1',$('h1'), 'H1: '+$('H1').length+' Tags in one page');
                },
                checkH2: function(){
                    if($('h2').length > 5)methods.addError('h2',$('h2'), 'H2: '+$('H2').length+' Tags in one page', 'warning');
                },
                checkH3: function(){
                    if($('h3').length > 10)methods.addError('h3',$('h3'), 'H2: '+$('H3').length+' Tags in one page', 'warning');
                },
                checkDeprecated: function(){
                    $.each(deprecatedTags,function(index,val){
                        if($(index).length > 0)methods.addError('deptag',$(index), index+' tag is deprecated', 'warning');
                    });
                    $.each(deprecatedAtt,function(index,val){
                        if($('['+index+']').length > 0){
                            methods.addError('depatt',$('['+index+']'), index+' attribute is deprecated', 'warning');
                        }
                    });
                },
                addError: function(type, element, msg, fatal){
                    if(!msg)msg = 'Something \'s wrong';
                    if(!fatal) fatal = 'error';
                    if(typeof element !== "object") var element = $('[id='+element+']');
                    if(element.length > 0){
                        element.each(function(){
                            if(opts.exclude && $(this).closest(opts.exclude).length > 0)return true;
                            uid++;
                            var $wrapper;
                            var $ele;
                            if(!$(this).data('error')){
                                $ele = $('<div class="chkdom_type_'+type+' chkdom_wrapper chkdom_'+fatal+'" id="chkdom_error_'+uid+'">'+'</div>');
                                $(this).data('error',uid);
                                
                                $wrapper = $('<ul class="chkdom_type_'+type+' chkdom_errorwrapper" id="chkdom_wrapper_'+uid+'"></ul>');
                               
                                $ele.append( $wrapper );
                            }else{
                                $ele = $('#chkdom_error_'+$(this).data('error'));
                                $wrapper = $('.chkdom_errorwrapper', $ele);
                            }
                            
                            var $errormsg = $('<li class="chkdom_type_'+type+' chkdom_msg_'+fatal+'">'+msg+'</li>');
                            $wrapper.append($errormsg);
                            
                            var pos;
                            if(opts.attachElement){
                                $(this).addClass('chkdom_box_'+fatal);
                                pos = $(this).position();
                                $wrapper.css({ top: (pos.top), left: pos.left});
                                $(this).after($wrapper);
                                $(this).hover(function(){ 
                                    if($('body').hasClass('debuging'))$('#chkdom_wrapper_'+$(this).data('error')).show(); 
                                },function(){
                                    $('#chkdom_wrapper_'+$(this).data('error')).hide(); 
                                });
                            }else{
                                pos = $(this).offset();
                                $ele.css({ top: pos.top, left: pos.left, height: $(this).innerHeight(), width: $(this).innerWidth() });
                                $('body').append($ele);
                            }
                        });
                    }
                },
                triggerAll: function(){
                    if(!init)methods.genError();
                    if($('body').hasClass('debuging')){
                        methods.hideError();
                        thecookie = setCookie('debugging',0,1);
                    }else{
                        methods.showError();
                        thecookie = setCookie('debugging',1,1);
                    }
                },
                init: function(){
                    if(!$('body').data('checkdom')){
                    
                        $('body').data('checkdom', true);
                        
                        var $option = $('<ul id="chkdom_optionbox"></ul>');
                        $option.append('<li id="chkdom_comeagain"> &bull; </li>');
                        $('body').append($option);
                        
                        $('#chkdom_comeagain').click(function(){
                            methods.triggerAll();
                        });
                        
                        $(document).bind('keydown', function(e){
                            if(e.keyCode==69){
                                methods.triggerAll();
                            }
                        });
                        
                        var styles = 
                            '.debuging .chkdom_box_error{ background: rgba(255,0,0,.3);border: 1px solid #FF0000; }\
                            .debuging .chkdom_box_warning{ background: rgba(255,255,0,.3);border: 1px solid #FFFF00; }\
                            .chkdom_wrapper { font-size: 12px; font-family: sans-serif;pointer-events: none; }\
                            .debuging .chkdom_wrapper { pointer-events:auto; }\
                            .chkdom_error,.chkdom_warning{position: absolute; top:0;left:0;z-index:9;-moz-box-sizing: border-box;-webkit-box-sizing: border-box; box-sizing: border-box;overflow:visible;}\
                            .chkdom_errorwrapper{ display: none; color: #FFF; background: #000; z-index:999; padding: 5px 10px;position: absolute; margin: 0; border-radius: 5px; top:0;left:0; }\
                            .debuging .chkdom_errorwrapper li{  text-transform:capitalize; list-style:disc; margin: 0 0 0 1em; padding: 0; display:list-style; width:200px;font-size: 12px;font-family: sans-serif; text-align:left; line-height: 1.2em; }\
                            .debuging .chkdom_msg_error{ color: #ff3439; }\
                            .debuging .chkdom_msg_warning{ color: #f2d731; }\
                            .debuging .chkdom_wrapper:hover .chkdom_errorwrapper{ display: block; }\
                            .debuging .ele_error, .debuging .ele_warning{ -moz-box-sizing: border-box;-webkit-box-sizing: border-box; box-sizing: border-box; }\
                            .debuging .chkdom_error{background: rgba(255,0,0,.3);border: 1px solid #FF0000;display: block;}\
                            .debuging .chkdom_warning{background: rgba(255,255,0,.3);border: 1px solid #FFFF00;display: block; }\
                            .chkdom_hidden{ display:none !important; }\
                            #chkdom_optionbox{ display:block; position: fixed; background: #000; width: 10px; height: 10px; top: 0; right: 0;color: #FFF;padding: 5px; margin: 0;z-index:999; }\
                            #chkdom_optionbox li{ display: none; }\
                            .debuging #chkdom_optionbox{ display:none; position: fixed; background: #000; width: 150px; height: 195px; top: 0; right: 0;color: #FFF;padding: 5px; margin: 0;z-index:999; }\
                            .debuging  #chkdom_optionbox li{ display: block; }\
                            #chkdom_optionbox label {font-size: 12px;}\
                            .debuging #chkdom_optionbox{display: block;}\
                            #chkdom_optionbox li{ list-style: none; padding: 0; margin: 0;font-size: 12px;line-height:14px;font-family:sans-serif;}\
                            #chkdom_hide{ margin: 10px; }\
                            li#chkdom_comeagain{ background:auto;border:auto; display: block; color:#FFF; text-align: center; font-size:25px;line-height:10px;width: 100%;height:100%; cursor:pointer }\
                            .debuging li#chkdom_comeagain{ display: none; }';
                        $('head').append('<style>'+styles+'</style>');
                    }
                },
                genError: function(){
                    if(!init){
                        init = true;
                        
                        methods.checkid();
                        methods.checkATitle();
                        methods.checkImgAlt();
                        methods.checkH1();
                        methods.checkH2();
                        methods.checkH3();
                        methods.checkImgDimension();
                        methods.checkDeprecated();
                        
                        var $option = $('#chkdom_optionbox');
                        $option.append('<li><label><input type="checkbox" value="id" checked="checked" /> Duplicate ID</label></li>');
                        $option.append('<li><label><input type="checkbox" value="atitle" checked="checked" /> A Tags Title</label></li>');
                        $option.append('<li><label><input type="checkbox" value="imgalt" checked /> IMG Tags ALT</label></li>');
                        $option.append('<li><label><input type="checkbox" value="dimension" checked="checked" /> IMG Tags no W/H</label></li>');
                        $option.append('<li><label><input type="checkbox" value="h1" checked="checked" /> H1 more than 1 tag</label></li>');
                        $option.append('<li><label><input type="checkbox" value="h2" checked="checked" /> H2 more than 5 tags</label></li>');
                        $option.append('<li><label><input type="checkbox" value="h3" checked="checked" /> H3 more than 10 tags</label></li>');
                        $option.append('<li><label><input type="checkbox" value="deptag" checked="checked" /> Deprecated Tags</label></li>');
                        $option.append('<li><label><input type="checkbox" value="depatt" checked="checked" /> Deprecated Attributes</label></li>');
                        $option.append('<li><button type="button" id="chkdom_hide">Hide all the things!</button> </li>');
                        
                        $('#chkdom_hide').click(function(){
                            methods.triggerAll();
                        });
                                          
                        $('input', $option).change(function(){
                            if($(this).prop('checked')){
                                $('.chkdom_type_'+$(this).val()).removeClass('chkdom_hidden');
                            }else{
                                $('.chkdom_type_'+$(this).val()).addClass('chkdom_hidden');
                            }
                            return true;
                        });
                    }
                }
            }
            
            methods.init();
            var thecookie = getCookie('debugging');
            if(thecookie == 1 || opts.auto){ if(!init)methods.genError(); methods.showError(); }
            else if(thecookie == null)thecookie = setCookie('debugging',0,1);
        
            function setCookie(name,value,days) {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    var expires = "; expires="+date.toGMTString();
                }
                else var expires = "";
                document.cookie = name+"="+value+expires+"; path=/";
                return getCookie(name);
            }
            
            function getCookie(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            }
            
            function deleteCookie(name) {
                setCookie(name,"",-1);
            }
        }
    });
})(jQuery);