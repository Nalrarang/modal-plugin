(function ($) {
    $.fn.customModal = function (options) {
        var modal = $(this);
        var body = $('body');
        var modalOptions = $.extend({
            id: 'modalContent_' + new Date().getTime(),
            position: 'center',
            width: '420',
            height: '220',
            left: '0',
            top: '0',
            multiple: true,
            zindex: 1,
            template: '<p class="modal-text">So implement your design and place content here! If you want to close modal, please hit "Esc", click somewhere on the screen or use special button.</p>',
            onInit: function () { },
            onBeforeShow: function () { },
            onAfterHide: function () { },
        }, options);

        var _init = function () {
            /* Init 할때 먼저 실행해야 할게 있으면 해준다. */
            modalOptions.onInit();

            var _windowWidth = window.innerWidth;
            var _windowHeight = window.innerHeight;

            var left = (_windowWidth - parseInt(modalOptions.width)) / 2;
            var top = (_windowHeight - parseInt(modalOptions.height)) / 2;

            var styles = {
                'position': 'absolute',
                'width': modalOptions.width,
                'height': modalOptions.height,
                'left': left,
                'top': top,
                'background': 'white',
                'overflow': 'auto'
            }
            var modalTemplate = '<div id="' + modalOptions.id + '" class="modal" data-multiple=' + modalOptions.multiple + '><div class="modal-bg"></div><div class="modal-box cs-modal">' + modalOptions.template + modalOptions.template + modalOptions.template + modalOptions.template + '</div></div>';
            body.append(modalTemplate);
            var elemObj = $('#' + modalOptions.id);
            var modalContent = elemObj.children('.modal-box');
            modalContent.css(styles);

            elemObj.on('beforeShow', function () {
                modalOptions.onBeforeShow();
            });
            elemObj.on('afterHide', function () {
                modalOptions.onAfterHide();
            });
            /* Background Click 속성이 True면 Overlay클릭시 모달 닫힘 */
            if (modal.attr('data-modal-bgclick')) {
                elemObj.find('.modal-bg').on('click', function () {
                    _hide(elemObj);
                });
            }

            modal.off('click').on('click', function (evt) {
                evt.preventDefault();
                _show(elemObj);
            });
        }

        var _show = function (modalContent) {
            /* Modal이 Show되기전에 호출할게 있으면 먼저 해줌. */
            var events = $._data(modalContent[0], 'events');
            if (events && events['beforeShow']) {
                events.beforeShow[events['beforeShow'].length - 1].handler();
            }

            /* */
            if (modalContent.attr('data-multiple') == 'false') {
                $('.modal').hide();
            }

            body.addClass('modal-open');
            modalContent.children('.modal-box').removeClass('modal-out').addClass('styled-pane');
            modalContent.show();
        }
        var _hide = function (modalContent) {
            body.removeClass('modal-open');
            modalContent.children('.modal-box').removeClass('styled-pane').addClass('modal-out');
            setTimeout(function () {
                modalContent.hide();
                /* Modal이 Hide된 후에 호출할게 있으면 해줌. */
                var events = $._data(modalContent[0], 'events');
                if (events && events['afterHide']) {
                    events.afterHide[events['afterHide'].length - 1].handler();
                }
            }, 300);
        }

        var _destroy = function (modalContent) {
            modalContent.off('beforeShow');
            modalContent.off('afterHide');
            modalContent.remove();
        }

        var methods = {
            init: function () {
                _init();
            },
            show: function () {
                _show(modal);
            },
            hide: function () {
                _hide(modal);
            },
            destroy: function () {
                _destroy(modal);
            }
        }

        if (methods[options]) {
            methods[options]();
        } else {
            methods.init();
        }
    }
}(jQuery));