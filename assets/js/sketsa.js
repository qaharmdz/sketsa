// UIkit default
// UIkit.component('navbar').options.data.offset = 0;

$(document).ready(function()
{
    // Sidebar state
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


// Code below part of Sketsa dynamic pages
// ==========================================
$(document).ready(function()
{
    openPage(getUrlParameter('page', 'dashboard'));
});

function openPage(page) {
    $('.th-sidebar a').each(function() {
        $(this).parent().removeClass('uk-active');
    });

    // load page
    UIkit.notification('<div class="uk-text-center">Load content..</div>');
    setTimeout(function() {
        var date = new Date();
        $('[data-content]').load('page/' + page + '.html?_=' + date.getDate() + date.getHours(), function() {
            $('.th-sidebar a[href*="' + page + '"]').parent().addClass('uk-active');
            $('.th-sidebar .uk-active').closest('.uk-parent').addClass('uk-open');
            $('.th-sidebar .uk-active').closest('.uk-nav').show();

            UIkit.notification.closeAll();
        });
    }, 100);
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
