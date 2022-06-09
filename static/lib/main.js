'use strict';

/* globals $ */

$(document).ready(function () {
    $(window)
        .off('action:ajaxify.end')
        .on('action:ajaxify.end', () => {
            const $medals = $('.nodebb-plugin-medals.medal-container .medal');

            for (let i = 0; i < $medals.length; i++) {
                const $medal = $($medals[i]);

                if ($medal.attr('title')) {
                    $medal.tooltip({
                        placement: $medal.attr('title-placement') || 'bottom',
                        title: $medal.attr('title'),
                        container: '#content',
                    });
                }
            }
        });
});
