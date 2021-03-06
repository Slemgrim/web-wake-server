(function (fn){

    var instance = this,
        $submitButtons = document.querySelectorAll('.submit'),
        $form = document.querySelector('#wakeupForm'),
        $clockList = document.querySelectorAll('.clock');

    var init = function(){
        clickBindings();
        setInterval(updateClock, 1000);
    };

    var clickBindings = function(){
        for(var i = 0; i < $submitButtons.length; i++){
            addEvent($submitButtons[i], 'click', onSubmitClick);
        }
    }

    var updateClock = function(){
        for(var i = 0; i < $clockList.length; i++){
            var clockTime = $clockList[i].getAttribute('data-wakeup');
            $clockList[i].setAttribute('data-wakeup', clockTime - 1);
            if(clockTime <= 0){
                location.reload(true);
            }
        }
    }

    var addEvent = function(obj, type, fn) {
        if (obj.addEventListener)
            obj.addEventListener(type, fn, false);
        else if (obj.attachEvent)
            obj.attachEvent('on' + type, function() { return fn.apply(obj, [window.event]);});
    }

    var onSubmitClick = function(evt){
        var sleeperKey =  this.value;
           var data = 'csrf=' + document.querySelector('input[name=csrf]').value +
                   '&sleeper=' + sleeperKey +
                   '&action=send-view';

        request('index.php', function(){}, data);
        initClock(sleeperKey);
        showBottom(sleeperKey);
    }

    var initClock = function(sleeperKey){
        $clock = document.querySelector('#' + sleeperKey + ' .clock');
        console.log($clock);

        clock = new Clock($clock);


    }

    var showBottom = function(sleeperKey){
        var $sleeper = document.querySelector('#' + sleeperKey);
        $sleeper.classList.add('showBottom');
    }

    init();

})('webwake');

(function (fn){

    var fallbackData = null;

    this.request = function(url, callback, postData, dataType) {
        var request = getXMLHTTPObject();

        if(!request) return;

        if(postData && postData.length == '') {
            postData = false;
        }

        var method = (postData) ? 'POST' : 'GET';

        request.open(method, url, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (postData) {
            request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        }

        request.onreadystatechange = function () {
            if (request.readyState != 4) {
                return;
            }

            if (request.status != 200 && request.status != 304 && request.status != 0) {
                console.error('HTTP error ' + request.status);
                return;
            }

            var response = request.responseText;

            if(dataType === 'json') {
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    return;
                }
            }
            if(callback){
                callback(response, url, request);
            }
        }

        if (request.readyState == 4) {
            return;
        }

        request.send(postData);

        return request;
    };

    this.requestJson = function(url, callback, postData) {
        return this.request(url, callback, postData, 'json');
    };

    var getXMLHTTPObject = function () {
        var xmlhttp = false;
        for (var i = 0; i < XMLHttpFactory.length; i++) {
            try {
                xmlhttp = XMLHttpFactory[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    };

    var XMLHttpFactory = [
        function () { return new XMLHttpRequest() },
        function () { return new ActiveXObject("Msxml2.XMLHTTP") },
        function () { return new ActiveXObject("Msxml3.XMLHTTP") },
        function () { return new ActiveXObject("Microsoft.XMLHTTP") }
    ];

})('ajax');

clock = function($el){

    var $clock = $el,
        angle;

}