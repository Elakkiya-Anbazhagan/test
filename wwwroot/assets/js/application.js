// ***********************************************************************
// Assembly         : School
// Author           : Prabakaran
// Created          : 04-26-2017
//
// Last Modified By : Prabakaran
// Last Modified On : 04-27-2017
// ***********************************************************************
// <copyright file="application.js" company="">
//     Copyright (c) . All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
/****  Variables Initiation  ****/
/// <var>The document</var>
var doc = document;
/// <var>The document el</var>
var docEl = document.documentElement;
/// <var>The $body</var>
var $body = $('body');
/// <var>The $sidebar</var>
var $sidebar = $('.sidebar');
/// <var>The $sidebar footer</var>
var $sidebarFooter = $('.sidebar .sidebar-footer');
/// <var>The $main content</var>
var $mainContent = $('.main-content');
/// <var>The $page content</var>
var $pageContent = $('.page-content');
/// <var>The top-bar</var>
var $topbar = $('.topbar');
/// <var>The logo panel</var>
var $logopanel = $('.logopanel');
/// <var>The $sidebar width</var>
var $sidebarWidth = $(".sidebar").width();
/// <var>The content</var>
var content = document.querySelector('.page-content');
/// <var>The $loader</var>
var $loader = $('#preloader');
/// <var>The document height</var>
var docHeight = $(document).height();
/// <var>The window height</var>
var windowHeight = $(window).height();
/// <var>The top-bar width</var>
var topbarWidth = $('.topbar').width();
/// <var>The header left width</var>
var headerLeftWidth = $('.header-left').width();
/// <var>The header right width</var>
var headerRightWidth = $('.header-right').width();
/// <var>The start</var>
var start = delta = end = 0;

// Add class every-time a mouse pointer hover over it
/// <var>The hover timeout</var>
var hoverTimeout;





/// <var>The systemic</var>
application = {
    Template: {
        Init: function() {
            /// <summary>
            /// 
            /// </summary>
            application.helper.Sidebar.Init();
            application.helper.Sidebar.CreateScroller();
            application.helper.Sidebar.Toogle();
            application.helper.Scroller.Custom();
            application.helper.Sidebar.Widgets();
            application.helper.Topbar.Reposition();
            application.helper.Panel.InitOptions();
            application.helper.Window.Scroll_To_Top();
            application.helper.Sidebar.Behaviour();
            application.helper.Window.DetectIE();
            application.helper.Window.BindEvents();
            application.helper.plugin.Init();

        }
    },
    helper: {
        plugin: {
            Init: function() {
                if ($('[data-rel="tooltip"]').length && $.fn.tooltip) {
                    $('[data-rel="tooltip"]').tooltip();
                }
            },
            CheckImage: function() {
                try {
                    setTimeout(function() {
                        application.helper.plugin.CheckAllImage();
                    }, 1000);
                } catch (e) {
                    console.log("===================================");
                    console.log('Method:ImageEventBind;\nError:' + e.message + ";\nDescription:" + e.description + ";\nName:" + e.name)
                    console.log("===================================");
                }
            },
            CheckAllImage: function() {
                $('img').each(function() {
                    if (!this.complete || typeof this.naturalWidth === "undefined" || this.naturalWidth === 0) {
                        application.helper.plugin.ImgError(this);
                    }
                });
            },
            ImgError: function(Image) {
                try {
                    ImgType = $(Image).data('type');
                    if (ImgType === 'user') {
                        $(Image).attr("src", "/assets/images/default/user.png");
                    } else if (ImgType === 'logo') {
                        $(Image).attr("src", "/assets/images/default/Logo.jpg");
                    } else {
                        $(Image).attr("src", "/assets/images/default/NoImages.png");
                    }
                } catch (e) {
                    console.log("===================================");
                    console.log('Method:Systemic.ImgError;\nError:' + e.message + ";\nDescription:" + e.description + ";\nName:" + e.name)
                    console.log("===================================");
                    $(Image).attr("src", "");
                }
            }
        },
        Loader: {
            Show: function(item) {
                /// <summary>
                /// Show loading screen for the item
                /// </summary>
                /// <param name="item">The item.</param>
                $(item).block({
                    message: '<svg class="circular"><circle class="path" cx="40" cy="40" r="10" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>',
                    css: {
                        border: 'none',
                        width: '14px',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.6,
                        cursor: 'wait'
                    }
                });
            },
            Hide: function(item) {
                /// <summary>
                /// hide loading screen for the item
                /// </summary>
                /// <param name="item">The item.</param>
                $(item).unblock();
            }
        },
        Panel: {
            InitOptions: function() {
                /* Create Port-lets Controls automatically: reload, full-screen, toggle, remove, pop-out */
                /// <summary>
                /// 
                /// </summary>
                $('.panel-controls').each(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    var controls_html = '<div class="control-btn">' + '<a href="#" class="panel-reload hidden"><i class="icon-reload"></i></a>' + '<a class="hidden" id="dropdownMenu1" data-toggle="dropdown">' + '<i class="icon-settings"></i>' + '</a>' + '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenu1">' + '<li><a href="#">Action</a>' + '</li>' + '<li><a href="#">Another action</a>' + '</li>' + '<li><a href="#">Something else here</a>' + '</li>' + '</ul>' + '<a href="#" class="panel-popout hidden tt" title="Pop Out/In"><i class="icons-office-58"></i></a>' + '<a href="#" class="panel-maximize hidden"><i class="icon-size-fullscreen"></i></a>' + '<a href="#" class="panel-toggle"><i class="fa fa-angle-down"></i></a>' + '<a href="#" class="panel-close"><i class="icon-trash"></i></a>' + '</div>';
                    $(this).append(controls_html);
                });
                $('.md-panel-controls').each(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    var controls_html = '<div class="control-btn">' + '<a href="#" class="panel-reload hidden"><i class="mdi-av-replay"></i></a>' + '<a class="hidden" id="dropdownMenu1" data-toggle="dropdown">' + '<i class="mdi-action-settings"></i>' + '</a>' + '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenu1">' + '<li><a href="#">Action</a>' + '</li>' + '<li><a href="#">Another action</a>' + '</li>' + '<li><a href="#">Something else here</a>' + '</li>' + '</ul>' + '<a href="#" class="panel-popout hidden tt" title="Pop Out/In"><i class="mdi-action-open-in-browser"></i></a>' + '<a href="#" class="panel-maximize hidden"><i class="mdi-action-launch"></i></a>' + '<a href="#" class="panel-toggle"><i class="mdi-navigation-expand-more"></i></a>' + '<a href="#" class="panel-close"><i class="mdi-action-delete"></i></a>' + '</div>';
                    $(this).append(controls_html);
                });
                // Remove Panel 
                $(".panel-header .panel-close").on("click", function(event) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="event">The event.</param>
                    event.preventDefault();
                    $item = $(this).parents(".panel:first");
                    bootbox.confirm("Are you sure to remove this panel?", function(result) {
                        /// <summary>
                        /// 
                        /// </summary>
                        /// <param name="result">The result.</param>
                        if (result === true) {
                            $item.addClass("animated bounceOutRight");
                            window.setTimeout(function() {
                                /// <summary>
                                /// 
                                /// </summary>
                                $item.remove();
                            }, 300);
                        }
                    });
                });
                // Toggle Panel Content
                $(document).on("click", ".panel-header .panel-toggle", function(event) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="event">The event.</param>
                    event.preventDefault();
                    $(this).toggleClass("closed").parents(".panel:first").find(".panel-content").slideToggle();
                });
                // Pop out / Pop in Panel
                $(document).on("click", ".panel-header .panel-popout", function(event) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="event">The event.</param>
                    event.preventDefault();
                    var panel = $(this).parents(".panel:first");
                    if (panel.hasClass("modal-panel")) {
                        $("i", this).removeClass("icons-office-55").addClass("icons-office-58");
                        panel.removeAttr("style").removeClass("modal-panel");
                        panel.find(".panel-maximize,.panel-toggle").removeClass("nevershow");
                        panel.draggable("destroy").resizable("destroy");
                    } else {
                        panel.removeClass("maximized");
                        panel.find(".panel-maximize,.panel-toggle").addClass("nevershow");
                        $("i", this).removeClass("icons-office-58").addClass("icons-office-55");
                        var w = panel.width();
                        var h = panel.height();
                        panel.addClass("modal-panel").removeAttr("style").width(w).height(h);
                        $(panel).draggable({
                            handle: ".panel-header",
                            containment: ".page-content"
                        }).css({
                            "left": panel.position().left - 10,
                            "top": panel.position().top + 2
                        }).resizable({
                            minHeight: 150,
                            minWidth: 200
                        });
                    }
                    window.setTimeout(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        $("body").trigger("resize");
                    }, 300);
                });
                // Reload Panel Content
                $(document).on("click", '.panel-header .panel-reload', function(event) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="event">The event.</param>
                    event.preventDefault();
                    var el = $(this).parents(".panel:first");
                    application.helper.Loader.Show(el);
                    window.setTimeout(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        application.helper.Loader.Hide(el);
                    }, 1800);
                });
                // Maximize Panel Dimension 
                $(document).on("click", ".panel-header .panel-maximize", function(event) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="event">The event.</param>
                    event.preventDefault();
                    var panel = $(this).parents(".panel:first");
                    $body.toggleClass("maximized-panel");
                    panel.removeAttr("style").toggleClass("maximized");
                    application.helper.Panel.maximize();
                    if (panel.hasClass("maximized")) {
                        panel.parents(".portlets:first").sortable("destroy");
                        $(window).trigger('resize');
                    } else {
                        $(window).trigger('resize');
                        panel.parent().height('');
                        sortablePortlets();
                    }
                    $("i", this).toggleClass("icon-size-fullscreen").toggleClass("icon-size-actual");
                    panel.find(".panel-toggle").toggleClass("nevershow");
                    $("body").trigger("resize");
                    return false;
                });
            },
            maximize: function() {
                /// <summary>
                /// Maximizes the panel.
                /// </summary>
                if ($('.maximized').length) {
                    var panel = $('.maximized');
                    var windowHeight = $(window).height() - 2;
                    panelHeight = panel.find('.panel-header').height() + panel.find('.panel-content').height() + 100;
                    if (panel.hasClass('maximized')) {
                        if (windowHeight > panelHeight) {
                            panel.parent().height(windowHeight);
                        } else {
                            if ($('.main-content').height() > panelHeight) {
                                panel.parent().height($('.main-content').height());
                            } else {
                                panel.parent().height(panelHeight);
                            }
                        }
                    } else {
                        panel.parent().height('');
                    }
                }
            }
        },
        Scroller: {
            Custom: function() {
                /// <summary>
                /// Create Custom Scroll for elements like Port-lets or Drop-down menu.
                /// </summary>
                if ($.fn.mCustomScrollbar) {
                    $('.withScroll').each(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        $(this).mCustomScrollbar("destroy");
                        var scroll_height = $(this).data('height') ? $(this).data('height') : 'auto';
                        var data_padding = $(this).data('padding') ? $(this).data('padding') : 0;
                        if ($(this).data('height') == 'window') {
                            thisHeight = $(this).height();
                            windowHeight = $(window).height() - data_padding - 50;
                            if (thisHeight < windowHeight) scroll_height = thisHeight;
                            else scroll_height = windowHeight;
                        }
                        $(this).mCustomScrollbar({
                            scrollButtons: {
                                enable: false
                            },
                            autoHideScrollbar: $(this).hasClass('show-scroll') ? false : true,
                            scrollInertia: 150,
                            theme: "light-thick",
                            set_height: scroll_height,
                            advanced: {
                                updateOnContentResize: true
                            }
                        });
                    });
                }
            }
        },
        Sidebar: {
            CreateScroller: function() {
                /// <summary>
                /// Create custom scroll for sidebar used for fixed sidebar.
                /// </summary>
                if ($.fn.mCustomScrollbar) {
                    application.helper.Sidebar.RemoveScroller();
                    if (!$('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-collapsed') && !$('body').hasClass('submenu-hover') && $('body').hasClass('fixed-sidebar')) {
                        $('.sidebar-inner').mCustomScrollbar({
                            scrollButtons: {
                                enable: false
                            },
                            autoHideScrollbar: true,
                            scrollInertia: 150,
                            theme: "light",
                            advanced: {
                                updateOnContentResize: true
                            }
                        });
                    }
                    if ($('body').hasClass('sidebar-top')) {
                        application.helper.Sidebar.RemoveScroller();
                    }
                }
            },
            RemoveScroller: function() {
                /// <summary>
                /// Destroy sidebar custom scroll.
                /// </summary>
                $('.sidebar-inner').mCustomScrollbar("destroy");
            },
            Toogle: function() {
                // Check if sidebar is collapsed
                /// <summary>
                /// Toggle sub-menu open.
                /// </summary>
                if ($('body').hasClass('sidebar-collapsed') || $('body').hasClass('sidebar-top') || $('body').hasClass('submenu-hover'))
                    $('.nav-sidebar .children').css({
                        display: ''
                    });
                else $('.nav-active.active .children').css('display', 'block');
                $('.sidebar').on('click', '.nav-sidebar li.nav-parent > a', function(e) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="e">The e.</param>
                    e.preventDefault();
                    if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
                    if ($('body').hasClass('submenu-hover')) return;
                    var parent = $(this).parent().parent();
                    parent.children('li.active').children('.children').slideUp(200);
                    $('.nav-sidebar .arrow').removeClass('active');
                    parent.children('li.active').removeClass('active');
                    var sub = $(this).next();
                    if (sub.is(":visible")) {
                        sub.children().addClass('hidden-item')
                        $(this).parent().removeClass("active");
                        sub.slideUp(200, function() {
                            /// <summary>
                            /// 
                            /// </summary>
                            sub.children().removeClass('hidden-item')
                        });
                    } else {
                        $(this).find('.arrow').addClass('active');
                        sub.children().addClass('is-hidden');
                        setTimeout(function() {
                            /// <summary>
                            /// 
                            /// </summary>
                            sub.children().addClass('is-shown');
                        }, 0);
                        sub.slideDown(200, function() {
                            /// <summary>
                            /// 
                            /// </summary>
                            $(this).parent().addClass("active");
                            setTimeout(function() {
                                /// <summary>
                                /// 
                                /// </summary>
                                sub.children().removeClass('is-hidden').removeClass('is-shown');
                            }, 500);
                        });
                    }
                });
            },
            Widgets: function() {
                /* Folders Widget */
                /// <summary>
                /// Sidebars the widgets.
                /// </summary>
                if ($('.sidebar-widgets .folders').length) {
                    $('.new-folder').on('click', function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        $('.sidebar-widgets .add-folder').show();
                        return false;
                    });
                    $(".add-folder input").keypress(function(e) {
                        /// <summary>
                        /// 
                        /// </summary>
                        /// <param name="e">The e.</param>
                        if (e.which == 13) {
                            $('.sidebar-widgets .add-folder').hide();
                            $('<li><a href="#"><i class="icon-docs c-blue"></i>' + $(this).val() + '</a> </li>').insertBefore(".add-folder");
                            $(this).val('');
                        }
                    });
                    content.addEventListener('click', function(ev) {
                        /// <summary>
                        /// 
                        /// </summary>
                        /// <param name="ev">The ev.</param>
                        addFolder = document.getElementById('add-folder');
                        var target = ev.target;
                        if (target !== addFolder) {
                            $('.sidebar-widgets .add-folder').hide();
                        }
                    });
                }
                /* Labels Widget */
                if ($('.sidebar-widgets .folders').length) {
                    $('.new-label').on('click', function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        $('.sidebar-widgets .add-label').show();
                        return false;
                    });
                    $(".add-label input").keypress(function(e) {
                        /// <summary>
                        /// 
                        /// </summary>
                        /// <param name="e">The e.</param>
                        if (e.which == 13) {
                            $('.sidebar-widgets .add-label').hide();
                            $('<li><a href="#"><i class="fa fa-circle-o c-blue"></i>' + $(this).val() + '</a> </li>').insertBefore(".add-label");
                            $(this).val('');
                        }
                    });
                    content.addEventListener('click', function(ev) {
                        /// <summary>
                        /// 
                        /// </summary>
                        /// <param name="ev">The ev.</param>
                        addFolder = document.getElementById('add-label');
                        var target = ev.target;
                        if (target !== addFolder) {
                            $('.sidebar-widgets .add-label').hide();
                        }
                    });
                }
                /* Sparkline  Widget */
                if ($.fn.sparkline && $('.dynamicbar1').length) {
                    var myvalues1 = [13, 14, 16, 15, 11, 14, 20, 14, 12, 16, 11, 17, 19, 16];
                    var myvalues2 = [14, 17, 16, 12, 18, 16, 22, 15, 14, 17, 11, 18, 11, 12];
                    var myvalues3 = [18, 14, 15, 14, 15, 12, 21, 16, 18, 14, 12, 15, 17, 19];
                    var sparkline1 = $('.dynamicbar1').sparkline(myvalues1, {
                        type: 'bar',
                        barColor: '#319DB5',
                        barWidth: 4,
                        barSpacing: 1,
                        height: '28px'
                    });
                    var sparkline2 = $('.dynamicbar2').sparkline(myvalues2, {
                        type: 'bar',
                        barColor: '#C75757',
                        barWidth: 4,
                        barSpacing: 1,
                        height: '28px'
                    });
                    var sparkline3 = $('.dynamicbar3').sparkline(myvalues3, {
                        type: 'bar',
                        barColor: '#18A689',
                        barWidth: 4,
                        barSpacing: 1,
                        height: '28px'
                    });
                };
                /* Progress Bar  Widget */
                if ($('.sidebar-widgets .progress-chart').length) {
                    $(window).load(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        setTimeout(function() {
                            /// <summary>
                            /// 
                            /// </summary>
                            $('.sidebar-widgets .progress-chart .stat1').progressbar();
                        }, 900);
                        setTimeout(function() {
                            /// <summary>
                            /// 
                            /// </summary>
                            $('.sidebar-widgets .progress-chart .stat2').progressbar();
                        }, 1200);
                        setTimeout(function() {
                            /// <summary>
                            /// 
                            /// </summary>
                            $('.sidebar-widgets .progress-chart .stat3').progressbar();
                        }, 1500);
                    });
                };
                $('.sidebar').on('click', '.hide-widget', function(e) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="e">The e.</param>
                    e.preventDefault();
                    if (start == 0) {
                        start = new Date().getTime();
                        $(this).toggleClass('widget-hidden');
                        var this_widget = $(this).parent().parent().next();
                        this_widget.slideToggle(200);
                        end = new Date().getTime();
                        delta = end - start;
                    } else {
                        end = new Date().getTime();
                        delta = end - start;
                        if (delta > 200) {
                            start = new Date().getTime();
                            $(this).toggleClass('widget-hidden');
                            var this_widget = $(this).parent().parent().next();
                            this_widget.slideToggle(200);
                            end = new Date().getTime();
                            delta = end - start;
                        }
                    }
                });
            },
            Behaviour: function() {
                /// <summary>
                /// Sidebars the behavior.
                /// </summary>
                windowWidth = $(window).width();
                windowHeight = $(window).height() - $('.topbar').height();
                sidebarMenuHeight = $('.nav-sidebar').height();
                if (windowWidth < 1024) {
                    $('body').removeClass('sidebar-collapsed');
                }
                if ($('body').hasClass('sidebar-collapsed') && sidebarMenuHeight > windowHeight) {
                    $('body').removeClass('fixed-sidebar');
                    application.helper.Sidebar.RemoveScroller();
                }
            },
            Init: function() {
                /// <summary>
                /// Initializes the sidebar event.
                /// </summary>
                $('.toggle_fullscreen').click(function() {
                    /// <summary>
                    /// full-screen event binder
                    /// </summary>
                    application.helper.Window.FullScreen();
                });
                $('.nav-sidebar > li').hover(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    clearTimeout(hoverTimeout);
                    $(this).siblings().removeClass('nav-hover');
                    $(this).addClass('nav-hover');
                }, function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    var $self = $(this);
                    hoverTimeout = setTimeout(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        $self.removeClass('nav-hover');
                    }, 200);
                });
                $('.nav-sidebar > li .children').hover(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    clearTimeout(hoverTimeout);
                    $(this).closest('.nav-parent').siblings().removeClass('nav-hover');
                    $(this).closest('.nav-parent').addClass('nav-hover');
                }, function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    var $self = $(this);
                    hoverTimeout = setTimeout(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        $(this).closest('.nav-parent').removeClass('nav-hover');
                    }, 200);
                });
                // Check if sidebar is collapsed
                if ($('body').hasClass('sidebar-collapsed')) $('.nav-sidebar .children').css({
                    display: ''
                });
                // Handles form inside of drop-down 
                $('.dropdown-menu').find('form').click(function(e) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="e">The e.</param>
                    e.stopPropagation();
                });
            }
        },
        Topbar: {
            Reposition: function() {
                /// <summary>
                /// 
                /// </summary>
                if ($('.nav-horizontal').length > 0) {
                    topbarWidth = $('.topbar').width();
                    headerRightWidth = $('.header-right').width();
                    if ($('.header-left .nav-horizontal').length) headerLeftWidth = $('.header-left').width() + 40;
                    else headerLeftWidth = $('.nav-sidebar.nav-horizontal > li').length * 140;
                    var topbarSpace = topbarWidth - headerLeftWidth - headerRightWidth;
                    // top navigation move to left nav if not enough space in topbar
                    if ($('.nav-horizontal').css('position') == 'relative' || topbarSpace < 0) {
                        if ($('.sidebar .nav-sidebar').length == 2) {
                            $('.nav-horizontal').insertAfter('.nav-sidebar:eq(1)');
                        } else {
                            // only add to bottom if .nav-horizontal is not yet in the left panel
                            if ($('.sidebar .nav-horizontal').length == 0) {
                                $('.nav-horizontal').appendTo('.sidebar-inner');
                                $('.sidebar-widgets').css('margin-bottom', 20);
                            }
                        }
                        $('.nav-horizontal').css({
                            display: 'block'
                        }).addClass('nav-sidebar').css('margin-bottom', 100);
                        application.helper.Sidebar.CreateScroller();
                        $('.nav-horizontal .children').removeClass('dropdown-menu');
                        $('.nav-horizontal > li').each(function() {
                            /// <summary>
                            /// 
                            /// </summary>
                            $(this).removeClass('open');
                            $(this).find('a').removeAttr('class');
                            $(this).find('a').removeAttr('data-toggle');
                        });
                        /* We hide mega menu in sidebar since video / images are too big and not adapted to sidebar */
                        if ($('.nav-horizontal').hasClass('mmenu')) $('.nav-horizontal.mmenu').css('height', 0).css('overflow', 'hidden');
                    } else {
                        if ($('.sidebar .nav-horizontal').length > 0) {
                            $('.sidebar-widgets').css('margin-bottom', 100);
                            $('.nav-horizontal').removeClass('nav-sidebar').appendTo('.topnav');
                            $('.nav-horizontal .children').addClass('dropdown-menu').removeAttr('style');
                            $('.nav-horizontal li:last-child').show();
                            $('.nav-horizontal > li > a').each(function() {
                                /// <summary>
                                /// 
                                /// </summary>
                                $(this).parent().removeClass('active');
                                if ($(this).parent().find('.dropdown-menu').length > 0) {
                                    $(this).attr('class', 'dropdown-toggle');
                                    $(this).attr('data-toggle', 'dropdown');
                                }
                            });
                        }
                        /* If mega menu, we make it visible */
                        if ($('.nav-horizontal').hasClass('mmenu')) $('.nav-horizontal.mmenu').css('height', '').css('overflow', '');
                    }
                }
            }
        },
        Window: {
            Scroll_To_Top: function() {
                if ($.fn.select2) {
                    setTimeout(function() {
                        $('.select-guru').each(function() {
                            $(this).select2({
                                placeholder: $(this).data('placeholder') ? $(this).data('placeholder') : '',
                                allowClear: $(this).data('allowclear') ? $(this).data('allowclear') : false,
                                minimumInputLength: $(this).data('minimumInputLength') ? $(this).data('minimumInputLength') : -1,
                                minimumResultsForSearch: $(this).data('search') ? -1 : 1,
                                dropdownCssClass: $(this).data('style') ? $(this).data('style') : '',
                                containerCssClass: $(this).data('container-class') ? $(this).data('container-class') : ''
                            });
                        });
                    }, 200);
                }

                /// <summary>
                /// Scroll to top button.
                /// </summary>

                try {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 1000);
                } catch (error) {

                }
                $(window).scroll(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    if ($(this).scrollTop() > 100) {
                        $('.scrollup').fadeIn();
                    } else {
                        $('.scrollup').fadeOut();
                    }
                });
                $('.scrollup').click(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    $("html, body").animate({
                        scrollTop: 0
                    }, 1000);
                    return false;
                });
            },
            FullScreen: function() {
                /// <summary>
                /// Change Screen Layout to fullscreen
                /// </summary>
                if (!doc.fullscreenElement && !doc.msFullscreenElement && !doc.webkitIsFullScreen && !doc.mozFullScreenElement) {
                    if (docEl.requestFullscreen) {
                        docEl.requestFullscreen();
                    } else if (docEl.webkitRequestFullScreen) {
                        docEl.webkitRequestFullscreen();
                    } else if (docEl.webkitRequestFullScreen) {
                        docEl.webkitRequestFullScreen();
                    } else if (docEl.msRequestFullscreen) {
                        docEl.msRequestFullscreen();
                    } else if (docEl.mozRequestFullScreen) {
                        docEl.mozRequestFullScreen();
                    }
                } else {
                    if (doc.exitFullscreen) {
                        doc.exitFullscreen();
                    } else if (doc.webkitExitFullscreen) {
                        doc.webkitExitFullscreen();
                    } else if (doc.webkitCancelFullScreen) {
                        doc.webkitCancelFullScreen();
                    } else if (doc.msExitFullscreen) {
                        doc.msExitFullscreen();
                    } else if (doc.mozCancelFullScreen) {
                        doc.mozCancelFullScreen();
                    }
                }
            },
            StopPropagation: function(evt) {
                /// <summary>
                /// Function for data-tables filter in head
                /// </summary>
                /// <param name="evt">The evt.</param>
                if (evt.stopPropagation !== undefined) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }
            },
            DetectIE: function() {
                /// <summary>
                /// Detects the ie.
                /// </summary>
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf('MSIE ');
                var trident = ua.indexOf('Trident/');
                var edge = ua.indexOf('Edge/');
                if (msie > 0 || trident > 0 || edge > 0) {
                    $('html').addClass('ie-browser');
                }
            },
            BindEvents: function() {
                /// <summary>
                /// Resize Event Functions
                /// </summary>
                $(window).resize(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    setTimeout(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        application.helper.Scroller.Custom();
                        application.helper.Topbar.Reposition();
                        if (!$('body').hasClass('fixed-sidebar') && !$('body').hasClass('builder-admin')) application.helper.Sidebar.Behaviour();
                        application.helper.Panel.maximize();
                    }, 100);
                });
                $(window).load(function() {
                    /// <summary>
                    /// 
                    /// </summary>
                    "use strict";
                    setTimeout(function() {
                        /// <summary>
                        /// 
                        /// </summary>
                        $('.loader-overlay').addClass('loaded');
                        $('body > section').animate({
                            opacity: 1,
                        }, 400);
                    }, 500);
                });
            }
        }
    },
    Login: {
        Init: function() {
            $.backstretch(["/assets/images/login/1.jpg",
                //"/assets/images/login/2.jpg",
                //"/assets/images/login/3.jpg",
                //"/assets/images/login/4.jpg"
            ], {
                fade: 600,
                duration: 4000
            });
        }
    },
    Progress: {
        Start: function() {
            try {
                $.blockUI({
                    message: '<div class="sk-cube-grid">' +
                        '<div class="sk-cube sk-cube1"></div>' +
                        '<div class="sk-cube sk-cube2"></div>' +
                        '<div class="sk-cube sk-cube3"></div>' +
                        '<div class="sk-cube sk-cube4"></div>' +
                        '<div class="sk-cube sk-cube5"></div>' +
                        '<div class="sk-cube sk-cube6"></div>' +
                        '<div class="sk-cube sk-cube7"></div>' +
                        '<div class="sk-cube sk-cube8"></div>' +
                        '<div class="sk-cube sk-cube9"></div>' +
                        '</div>'
                });
            } catch (e) {
                console.log(e);
            }

        },
        Stop: function() {
            try {
                $.unblockUI.apply();
            } catch (e) {
                console.log(e);
            }
        }
    }
}

/****  Initiation of Main Functions  ****/
$(document).ready(function() {
    /// <summary>
    /// 
    /// </summary>
    //application.Template.Init();
});