var $story = $('.story');
var $earth = $('.earth');

$(window).on('scroll', function () {
    _.each(breakpoints, function (breakpoint) {
        if (window.pageYOffset > breakpoint.start && !breakpoint.isActive) {
            breakpoint.triggerOn && breakpoint.triggerOn();
            breakpoint.isActive = true;
        }

        if (window.pageYOffset < breakpoint.start && breakpoint.isActive) {
            breakpoint.triggerOff && breakpoint.triggerOff();
            breakpoint.isActive = false;
        }
    })
});

var breakpoints = [];

breakpoints.push({
    start: 500,
    isActive: false,
    triggerOn: function () {
        $earth.removeClass('hidden');
    },
    triggerOff: function () {
        $earth.addClass('hidden');
    }
});