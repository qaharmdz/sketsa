// UIkit default
// UIkit.component('navbar').options.data.offset = 0;

$(document).ready(function()
{
    /*
     * Load page
     */
    openPage(getUrlParameter('page', 'dashboard'));

    /*
     * Sidebar state
     */
    var sidebarState = Cookies.get('th-sidebar-state');
    if (sidebarState === undefined || sidebarState === 'show') {
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

function openPage(page) {
    $('.th-sidebar a').each(function() {
        $(this).parent().removeClass('uk-active');
    });

    // load page
    var holder = $('[data-content]');
    holder.html('<div class="uk-card uk-card-default uk-card-body uk-card-small">loading..</div>');
    setTimeout(function() {
        holder.load('page/' + page + '.html', function() {
            $('.th-sidebar a[href*="' + page + '"]').parent().addClass('uk-active');
            $('.th-sidebar .uk-active').closest('.uk-parent').addClass('uk-open');
            $('.th-sidebar .uk-active').closest('.uk-nav').show();
        });
    }, 200);
}

/*
 * https://stackoverflow.com/a/21903119
 */
function getUrlParameter(sParam, sDefault) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }

    return sDefault;
}
