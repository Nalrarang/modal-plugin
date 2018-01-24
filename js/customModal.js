/*
*  jQuery Modal Plugin
*  설명: jQuery용 CustomModal플러그인입니다.
        import 하기전에 jquery를 먼저 Import해주시길 바랍니다.
*  작성자: Nalrarang
*  작성일: 2017.12.28
*/

(function ($) {
    $.fn.customModal = function (options) {
        var modal = $(this);
        var body = $('body');
        /* Modal 기본 옵션 */
        var modalOptions = $.extend({
            id: 'modalContent_' + new Date().getTime(),
            position: 'center',
            width: '420',
            height: '220',
            close: true,
            left: '0',
            top: '0',
            multiple: false,
            template: '<p class="modal-text">국회의원은 국가이익을 우선하여 양심에 따라 직무를 행한다.</p><p class="modal-text">대통령은 국가의 독립·영토의 보전·국가의 계속성과 헌법을 수호할 책무를 진다.</p><p class="modal-text">훈장등의 영전은 이를 받은 자에게만 효력이 있고, 어떠한 특권도 이에 따르지 아니한다.</p>',
            onInit: function () { },
            onBeforeShow: function () { },
            onAfterHide: function () { },
        }, options);

        var _init = function () {
            /* 모달의 위치를 가운데로 하기 위한 계산 */
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
            var modalTemplate = '<div id="' + modalOptions.id + '" class="modal" data-multiple=' + modalOptions.multiple + '><div class="modal-bg"></div><div class="modal-box">';
            /* close옵션에 따라 닫기버튼을 추가해준다. */
            if(modalOptions.close) {
                modalTemplate += '<a href="#" class="modal-close">X</a>';                
            }
            modalTemplate += '<div class="cs-modal">' + modalOptions.template + '</div></div></div>';        

            /* 만들어진 Template을 Body에 Append */
            body.append(modalTemplate);
            var elemObj = $('#' + modalOptions.id);
            var modalContent = elemObj.children('.modal-box');
            modalContent.css(styles);

            /* 해당 Modal의 Callback Event를 추가해준다. */
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
            elemObj.find('.modal-close').off('click').on('click', function (evt) {
                evt.preventDefault();
                _hide(elemObj);
            });
            /* Init후 실행해야 할게 있으면 해준다. */
            modalOptions.onInit();
        }

        /* Modal을 보여준다. */
        var _show = function (modalContent) {
            /* Modal이 Show되기전에 호출할게 있으면 먼저 해줌. */
            var events = $._data(modalContent[0], 'events');
            if (events && events['beforeShow']) {
                events.beforeShow[events['beforeShow'].length - 1].handler();
            }

            /* Multiple옵션에 따라 이전에 있던 모달을 닫을지 결정한다. */
            if (modalContent.attr('data-multiple') == 'false') {
                $('.modal').hide();
            } else {
                body.append(modalContent);
            }

            body.addClass('modal-open');
            modalContent.children('.modal-box').removeClass('modal-out').addClass('styled-pane');
            modalContent.show();
        }
        /* Modal을 감춘다. */
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

        /* Modal과 관련된 요소를 삭제한다. */
        var _destroy = function (modalContent) {
            modalContent.off('beforeShow');
            modalContent.off('afterHide');
            modalContent.remove();
        }

        /* CustomModal의 Method 모음 */
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

        /* Modal Init할때와 Method호출할때의 상태에 따라 다른 행동을 함 */
        if (methods[options]) {
            methods[options]();
        } else {
            methods.init();
        }
    }
}(jQuery));