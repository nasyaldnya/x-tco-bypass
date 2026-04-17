// ==UserScript==
// @name         X/Twitter t.co Bypass
// @namespace    https://github.com/nasyaldnya/x-tco-bypass
// @version      1.0.1
// @description  Bypasses t.co links on X (Twitter) and reveals the original URLs.
// @description:ar تخطي روابط t.co على تويتر وإجبار المتصفح على عرض الروابط الحقيقية.
// @description:ja X（Twitter）のt.coリンクをバイパスし、元のURLを表示します。
// @description:ko X(Twitter)의 t.co 링크를 우회하여 원래 URL을 표시합니다.
// @author       nasyaldnya
// @match        *://x.com/*
// @match        *://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    function getRealUrl(a) {
        if (a.dataset.realUrl) return a.dataset.realUrl;

        let realUrl = '';

        if (a.title && a.title.trim().startsWith('http')) {
            realUrl = a.title.trim().replace(/\n/g, '');
        } else if (a.innerText) {
            let text = a.innerText.trim().replace(/…$/, '').replace(/\n/g, '');
            if (text.includes('.') && !text.includes(' ')) {
                realUrl = text.startsWith('http') ? text : 'https://' + text;
            }
        }

        return realUrl;
    }

    function forceFixLink(a) {
        if (!a.href || (!a.href.includes('t.co') && !a.dataset.realUrl)) return;

        let realUrl = getRealUrl(a);

        if (realUrl && a.href !== realUrl) {
            a.href = realUrl;               
            a.dataset.realUrl = realUrl;    
        }
    }

    setInterval(() => {
        document.querySelectorAll('a[href*="t.co"]').forEach(forceFixLink);
    }, 500);

    ['mouseenter', 'mouseover', 'mousedown', 'pointerdown', 'click'].forEach(evt => {
        document.addEventListener(evt, function(e) {
            let a = e.target.closest('a');
            if (a) forceFixLink(a);
        }, true);
    });

})();
