/**
 * The Clock
 * @author andyw@circle, chris.pook@circle
 */
(function() {

    var duration = 600;
    var tension  = 500;
    var friction = 15;
    var interval = null;

    var clockTime = {
        hours:   0,
        minutes: 0,
        seconds: 0
    };

    // if / when window is not active, stop the animation - otherwise it
    // causes some pretty strange behaviour when the window is re-focused
    $(window).on("blur focus", function(e) {
        
        var prevType = $(this).data("prevType");

        if (prevType != e.type) {   //  reduce double fire issues
            switch (e.type) {
                case "blur":
                    clearInterval(interval);
                    interval = null;
                    break;
                case "focus":
                    if (!interval)
                        interval = setInterval(updateTheClock, 1000);
                    break;
            }
        }

        $(this).data("prevType", e.type);
    
    });

    var updateTheClock = function() {

        // what's the time?
        var theTime = new Date();

        var hours   = theTime.getHours();
        var minutes = theTime.getMinutes();
        var seconds = theTime.getSeconds();

        if (minutes != clockTime.minutes) {

            var hourRotation = (hours * 30) + (minutes * 0.5);
            if (!hourRotation)
                hourRotation = 360;

            if (!minutes && !seconds)
                minutes = 60;

            $('#hour-hand').velocity({
                rotateZ: [hourRotation, [tension, friction]]
            }, {
                duration: duration,
                complete: function() {
                    // if midnight, move back to zero with no animation, once initial animation is complete
                    if (hourRotation == 360 && !seconds) {
                        $('#hour-hand').velocity({
                            rotateZ: 0
                        }, {
                            duration: 1
                        }).velocity('finish');
                    }
                }
            });

            clockTime.hours = hours;

            $('#minute-hand').velocity({
                rotateZ: [minutes * 6, [tension, friction]]
            }, {
                duration: duration,
                complete: function() {
                    // if at the top of the hour, move back to zero with no animation, once initial animation is complete
                    if (minutes == 60) {
                        $('#minute-hand').velocity({
                            rotateZ: 0
                        }, {
                            duration: 1
                        }).velocity('finish');
                    }
                }
            })
            clockTime.minutes = minutes;
        }

        if (seconds != clockTime.seconds) {

            if (!seconds)
                seconds = 60;

            $('#second-hand').velocity({
                rotateZ: [seconds * 6, [tension, friction]]
            }, {

                duration: duration,
                complete: function() {
                    // if at the top of the minute, move back to zero with no animation, once initial animation is complete
                    if (seconds == 60) {
                        $('#second-hand').velocity({
                            rotateZ: 0
                        }, {
                            duration: 1
                        }).velocity('finish');
                    }

                }

            });
            clockTime.seconds = seconds;

        }

    };

    updateTheClock();

    if (!interval)
        interval = setInterval(updateTheClock, 1000);

})();