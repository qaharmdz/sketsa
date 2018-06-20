// UIkit default
// UIkit.component('navbar').options.data.offset = 0;

$(document).ready(function()
{
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
      minScrollbarLength: 20,
      maxScrollbarLength: 200
    });
    $('.th-sidebar-scroll .uk-parent').on('click', function(e) {
        setTimeout(function() {
            ps.update();
            $('.th-sidebar-scroll').trigger('scroll');
        }, 100);
    });
});
