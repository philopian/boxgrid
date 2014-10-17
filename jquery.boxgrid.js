/*!
 * boxgrid - jQuery Plugin
 * Version: 1.0.1
 *
 * Copyright (c) 2014 Heimspiel GmbH, http://www.hmspl.de/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*jslint browser: true */
/*global jQuery*/

(function ($) {
    'use strict';

    function debounce(func, delay) {
        var timeoutID;
        return function () {
            var scope = this,
                args = arguments;
            clearTimeout(timeoutID);
            timeoutID = setTimeout(function () {
                func.apply(scope, args);
            }, delay);
        };
    }

    function hasEmptySpan(grid, columns, x, y, colSpan, rowSpan) {
        var r = 0,
            c = 0;

        if (x + colSpan > columns) {
            return false;
        }

        for (r = 0; r < rowSpan; r += 1) {
            for (c = 0; c < colSpan; c += 1) {
                if (grid[(y + r) * columns + (x + c)] === true) {
                    return false;
                }
            }
        }

        return true;
    }

    function setSpan(grid, columns, x, y, colSpan, rowSpan) {
        var r = 0,
            c = 0;

        for (r = 0; r < rowSpan; r += 1) {
            for (c = 0; c < colSpan; c += 1) {
                grid[(y + r) * columns + (x + c)] = true;
            }
        }
    }

    function alignContainer(container, settings) {
        var grid = [],
            width = container.width(),
            columns = Math.max(settings.minColumns, Math.floor(width / settings.minWidth)),
            colWidth = Math.max(settings.minWidth, width / columns),
            rows = 0;

        container.children().each(function () {
            var box = $(this),
                colSpan = box.data(settings.dataColSpanName),
                rowSpan = box.data(settings.dataRowSpanName),
                i = 0,
                x = 0,
                y = 0;

            if (colSpan > columns) {
                return;
            }

            box.width(colWidth * colSpan);
            box.height(settings.rowHeight * rowSpan);

            for (i = 0; true; i += 1) {
                x = i % columns;
                y = Math.floor(i / columns);

                if (hasEmptySpan(grid, columns, x, y, colSpan, rowSpan)) {
                    setSpan(grid, columns, x, y, colSpan, rowSpan);

                    box.css({
                        top: y * settings.rowHeight,
                        left: x * colWidth,
                        position: 'absolute'
                    });

                    break;
                }
            }
        });

        rows = Math.ceil(grid.length / columns);
        container.height(rows * settings.rowHeight).addClass(settings.readyClass);
    }

    $.fn.boxgrid = function (options) {
        var el = this,
            settings = $.extend({
                minColumns: 2,
                minWidth: 100,
                rowHeight: 100,
                resize: true,
                resizeDelay: 250,
                readyClass: 'boxgrid-ready',
                dataColSpanName: 'colspan',
                dataRowSpanName: 'rowspan'
            }, options),
            align = function () {
                el.each(function () {
                    alignContainer($(this), settings);
                });
            };

        if (settings.resize) {
            $(window).resize(debounce(align, settings.resizeDelay));
        }

        $(document).ready(align);

        return this;
    };

}(jQuery));
