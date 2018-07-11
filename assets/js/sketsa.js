// UIkit default
// UIkit.component('navbar').options.data.offset = 0;

$(document).ready(function()
{
    // Make sure update after all animation done
    setTimeout(function() {
        UIkit.update(element = document.body, event = 'update');
    }, 500);

    // Refresh UIkit component after sidebar/side-panel toggle
    $('.uk-navbar-toggle, .th-main-panel .uk-icon').on('click', function() {
        setTimeout(function() {
            UIkit.update(element = document.body, event = 'update');
        }, 150);
    });

    // Sidebar state
    var sidebarState = Cookies.get('th-sidebar-state');
    if (sidebarState === 'hide') {
        UIkit.toggle('[data-sidebar]').toggle();
    }
    $('[data-sidebar]').on('click', function(e) {
        setTimeout(function() {
            if ($('body').hasClass('th-sidebar-show')) {
                Cookies.set('th-sidebar-state', 'show');
            } else {
                Cookies.set('th-sidebar-state', 'hide');
            }
        }, 50);
    });

    // Sidebar scroll
    var ps = new PerfectScrollbar('.th-sidebar-scroll', {
        wheelSpeed: 0.4,
        minScrollbarLength: 50,
        maxScrollbarLength: 100
    });
    $('.th-sidebar-scroll .uk-parent').on('click', function(e) {
        setTimeout(function() {
            ps.update();
            $('.th-sidebar-scroll').trigger('scroll');
        }, 100);
    });
});
