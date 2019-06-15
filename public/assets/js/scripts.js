(function () {
    "use strict";

    // custom scrollbar

    $("html").niceScroll({
        styler: "fb", 
        cursorcolor: "#a82024", 
        cursorwidth: '6', 
        cursorborderradius: '0px', 
        background: '#525252', 
        spacebarenabled: false, 
        cursorborder: '0', 
        zindex: '1000'}
    );

    $(".fix-left-side").niceScroll({
        styler: "fb", 
        cursorcolor: "#a82024", 
        cursorwidth: '3', 
        cursorborderradius: '0px', 
        background: '#525252', 
        spacebarenabled: false, 
        cursorborder: '0'
    });


    $(".fix-left-side").getNiceScroll();
    if ($('body').hasClass('menu-collapsed')) {
        $(".fix-left-side").getNiceScroll().hide();
    }



    // Toggle Left Menu
    jQuery('.left-nav-item > a').click(function () {

        var parent = jQuery(this).parent();
        var sub = parent.find('> ul');

        if (!jQuery('body').hasClass('menu-collapsed')) {
            if (sub.is(':visible')) {
                sub.slideUp(200, function () {
                    parent.removeClass('nav-active');
                    jQuery('.right-wrapper').css({height: ''});
                    mainContentHeightAdjust();
                });
            } else {
                visibleSubMenuClose();
                parent.addClass('nav-active');
                sub.slideDown(200, function () {
                    mainContentHeightAdjust();
                });
            }
        }
        return false;
    });

    function visibleSubMenuClose() {
        jQuery('.left-nav-item').each(function () {
            var t = jQuery(this);
            if (t.hasClass('nav-active')) {
                t.find('> ul').slideUp(200, function () {
                    t.removeClass('nav-active');
                });
            }
        });
    }

    function mainContentHeightAdjust() {
        // Adjust main content height
        var docHeight = jQuery(document).height();
        if (docHeight > jQuery('.right-wrapper').height())
            jQuery('.right-wrapper').height(docHeight);
    }

    //  class add mouse hover
    jQuery('.left-custom-nav > li').hover(function () {
        jQuery(this).addClass('nav-hover');
    }, function () {
        jQuery(this).removeClass('nav-hover');
    });


    // Menu Toggle
    jQuery('.toggle-button').click(function () {
        $(".fix-left-side").getNiceScroll().hide();

        if ($('body').hasClass('menu-collapsed')) {
            $(".fix-left-side").getNiceScroll().hide();
        }
        var body = jQuery('body');
        var bodyposition = body.css('position');

        if (bodyposition != 'relative') {

            if (!body.hasClass('menu-collapsed')) {
                body.addClass('menu-collapsed');
                jQuery('.left-custom-nav ul').attr('style', '');

                jQuery(this).addClass('menu-collapsed');

            } else {
                body.removeClass('menu-collapsed chat-view');
                jQuery('.left-custom-nav li.active ul').css({display: 'block'});

                jQuery(this).removeClass('menu-collapsed');

            }
        } else {

            if (body.hasClass('left-side-show'))
                body.removeClass('left-side-show');
            else
                body.addClass('left-side-show');

            mainContentHeightAdjust();
        }

    });


    searchform_reposition();

    jQuery(window).resize(function () {

        if (jQuery('body').css('position') == 'relative') {

            jQuery('body').removeClass('menu-collapsed');

        } else {

            jQuery('body').css({left: '', marginRight: ''});
        }

        searchform_reposition();

    });

    function searchform_reposition() {
        if (jQuery('.search-form').css('position') == 'relative') {
            jQuery('.search-form').insertBefore('.left-nav-inner .logged-user');
        } else {
            jQuery('.search-form').insertBefore('.top-menu-right');
        }
    }

    // panel collapsible
    $('.panel .tool-bar .fa').click(function () {
        var el = $(this).parents(".panel").children(".panel-body");
        if ($(this).hasClass("fa-chevron-down")) {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else if ($(this).hasClass("fa-refresh")) {
            // panel refresh
            var el = $(this).parents(".panel").children(".panel-body");
            el.addClass('wait');
            setTimeout(function () {
                el.removeClass('wait');
            }, 2000);
        } else if ($(this).hasClass("fa-external-link")) {
            // panel refresh
            var el = $(this).parents(".panel");
            if (el.hasClass('full-screen')) {
                el.removeClass('full-screen');
            } else {
                el.addClass('full-screen');
            }
        } else {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    $('.todo-check label').click(function () {
        $(this).parents('li').children('.todo-title').toggleClass('line-through');
    });

    $(document).on('click', '.todo-remove', function () {
        $(this).closest("li").remove();
        return false;
    });

    // $("#sortable-todo").sortable();


    // panel close
    $('.panel .tool-bar .fa-times').click(function () {
        $(this).parents(".panel").parent().remove();
    });



    // tool tips

    $('.tooltips').tooltip();
    $(".tooltip-options button").tooltip({html: true});
    $(".tooltip-animated button").tooltip({html: true, delay:
                {show: 500, hide: 500}});
    // popovers

    $('.popovers').popover();

//$( ".col-md-6" ).sortable({
//connectWith: ".col-md-6",
//handle: ".panel-head",
//cancel: ".portlet-toggle",
//placeholder: "portlet-placeholder ui-corner-all"
//});
//Sorting
    // $(".sortable .col-md-7").sortable({
    //     connectWith: ".sortable .col-md-5, .sortable .col-md-12",
    //     handle: ".panel-heading",
    //     containment: ".sortable",
    //     placeholder: "portlet-placeholder",
    //     update: function (event, ui) {
    //         updateCalendar(ui);
    //     }
    // });
    // $(".sortable .col-md-5").sortable({
    //     connectWith: ".sortable .col-md-7, .sortable .col-md-12",
    //     handle: ".panel-heading",
    //     containment: ".sortable",
    //     placeholder: "portlet-placeholder",
    //     update: function (event, ui) {
    //         updateCalendar(ui);
    //     }
    // });

    // $(".sortable .col-md-12").sortable({
    //     connectWith: ".sortable .col-md-5, .sortable .col-md-7",
    //     handle: ".panel-heading",
    //     containment: ".sortable",
    //     placeholder: "portlet-placeholder",
    //     update: function (event, ui) {
    //         updateCalendar(ui);
    //     }
    // });
    function updateCalendar(ui) {
        if (ui.item.hasClass('calendar-panel')) {
            $(window).trigger('resize');
        }
    }

    //datatable with inline row add/edit 

    //Calender
    //Calendar  
     
    if(typeof $.fn.inputmask === 'function') { 
        $(":input").inputmask();
    }

    /* --- #Start Login form validation ---- */
    jQuery('#loginForm, #updateProfile, #forgotForm').validationEngine({ promptPosition: "topLeft", scroll: false });
    jQuery('#showPass').click(function(){ // view password entered in input field
        if(jQuery(this).children().hasClass('glyphicon-eye-close')){
            jQuery(this).children().toggleClass('glyphicon-eye-close');
            jQuery(this).children().toggleClass('glyphicon-eye-open');
            jQuery('#password').attr('type','text');
        }else{
            jQuery(this).children().toggleClass('glyphicon-eye-close');
            jQuery(this).children().toggleClass('glyphicon-eye-open');
            jQuery('#password').attr('type','password');
        }
    });
    /* --- #End Login form validation ---- */


})(jQuery);

function addClock() {
    var offsetVal = $('#drop-down-timezone').val();
    var selectedLabel = $('#drop-down-timezone option:selected').text();
    var html = '<div class="clock-canvas"><button type="button" class="remove-clock close" aria-hidden="true"><i class="typcn typcn-times"></i></button><canvas class="CoolClock:chunkySwiss:30::' + offsetVal + '"></canvas><br>' + selectedLabel + '</div>';
    $('.clock .panel-body').append(html);
    CoolClock.findAndCreateClocks();
    $('#close-clock-modal').click();
}

//display message on error/success
function displayAlertMessage(message, status = '') {
    $('#messageBox').text(message).css("display", "block").focus();
    if(status=='error'){
        $('#messageBox').removeClass().addClass("alert alert-danger");
    }else{
        $('#messageBox').removeClass().addClass("alert alert-success");
        setTimeout(function(){
            window.location.reload(1);
        }, 2000);
    }
}

