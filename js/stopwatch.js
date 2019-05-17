
function stopwatch (){

    var sec = 0;
    var min = 0;
    var start = null;

    var format = d3.format("02d");


    var r = function() {




    };

    r.reset = function() {
        sec = 0;
        min = 0;
        var start = null;

        return r;
    };

    r.step = function(seconds) {
        var _min = Math.floor(seconds / 60);
        var _sec = seconds % 60;

        min += _min;
        sec += _sec;

        return r;
    };

    function step(timestamp) {
        if (!start) start = timestamp;
        var seconds = Math.floor((timestamp - start)/10);

        console.log(seconds)

        var _min = Math.floor(seconds / 60);
        var _sec = seconds % 60;

        min = _min;
        sec = _sec;

        d3.select(".stopwatch").text(r.value());
        // console.log(progress);

        window.requestAnimationFrame(step);
    }

    r.start = function() {
        if (!start) window.requestAnimationFrame(step);


        return r;
    };


    r.value = function() {
        return format(min) + ":" + format(sec);
    };



    return r;
}




