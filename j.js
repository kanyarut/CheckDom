if (typeof jQuery == 'undefined') { 
    jq = document.createElement('script');
    jq.type='text/javascript';
    document.body.appendChild(jq);
    jq.src='http://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js';
}
loadPlugin();

function loadPlugin(){
    if(typeof jQuery == 'undefined'){
        setTimeout('loadPlugin()',300);
    }else{
        s = document.createElement('script');
        s.type='text/javascript';
        document.body.appendChild(s);
        s.src='http://nblue.github.com/CheckDom/checkdom.jquery.js';
        
        initPlugin();
    }
}
function initPlugin(){
    if (!$.checkdom) {
        setTimeout('initPlugin()',300);
    }else{
        $.checkdom({auto: true});
    }
}