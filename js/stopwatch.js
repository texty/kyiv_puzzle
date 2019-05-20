
function stopwatch (){

    var format = d3.format("02d");
    
    var sec = 0
        , min = 0
        , active_timer = null
        , progress
        , _onTick = function() {}
        , colon = true
        ;

    var step_size = 500;

    var r = function() {

    };

    r.stop = function() {
        if (active_timer) clearInterval(active_timer);
        
        sec = 0;
        min = 0;

        return r;
    };

    function step() {
        progress += step_size;
        var seconds = Math.floor(progress / 1000);

        min = Math.floor(seconds / 60);
        sec = seconds % 60;

        colon = !colon;

        if (_onTick) _onTick({min: min, sec: sec, value: r.value()})
    }

    r.start = function() {
        if (!active_timer) {
            progress = 0;
            active_timer = setInterval(step, step_size);
        }

        return r;
    };

    r.value = function() {
        return format(min) + (colon ? ":" : " ") + format(sec);
    };
    
    r.onTick = function(_) {
        if (!arguments.length) return _onTick;
        _onTick = _;
        return r;
    };

    return r;
}




