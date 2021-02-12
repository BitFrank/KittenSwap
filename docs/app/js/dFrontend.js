"use strict";

//   _    _ _   _                __ _                            
//  | |  (_) | | |              / _(_)                           
//  | | ___| |_| |_ ___ _ __   | |_ _ _ __   __ _ _ __   ___ ___ 
//  | |/ / | __| __/ _ \ '_ \  |  _| | '_ \ / _` | '_ \ / __/ _ \
//  |   <| | |_| ||  __/ | | |_| | | | | | | (_| | | | | (_|  __/
//  |_|\_\_|\__|\__\___|_| |_(_)_| |_|_| |_|\__,_|_| |_|\___\___|
//
//  https://www.Kitten.finance
//

//===================================================================================================================================

Date.prototype.HHMMSS = function () {
    var MM = this.getMonth() + 1;
    var dd = this.getDate();
    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();

    return (dd > 9 ? '' : '0') + dd + '-' + ([
        (hh > 9 ? '' : '0') + hh,
        (mm > 9 ? '' : '0') + mm,
        (ss > 9 ? '' : '0') + ss
    ].join(':'));
}

Date.prototype.OnlyHHMMSS = function () {
    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();

    return [
        (hh > 9 ? '' : '0') + hh,
        (mm > 9 ? '' : '0') + mm,
        (ss > 9 ? '' : '0') + ss
    ].join(':');
}

Date.prototype.MDHMS = function () {

    var MMM = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    var MM = MMM[this.getMonth()]
    var dd = this.getDate()
    var hh = this.getHours()
    var mm = this.getMinutes()
    var ss = this.getSeconds()

    return MM + '-' +
        (dd > 9 ? '' : '0') + dd + ' ' + ([
            (hh > 9 ? '' : '0') + hh,
            (mm > 9 ? '' : '0') + mm,
            (ss > 9 ? '' : '0') + ss
        ].join(':'))
}

Date.prototype.MDHM = function () {

    var MMM = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    var MM = MMM[this.getMonth()]
    var dd = this.getDate()
    var hh = this.getHours()
    var mm = this.getMinutes()

    return MM + '-' +
        (dd > 9 ? '' : '0') + dd + ' ' + ([
            (hh > 9 ? '' : '0') + hh,
            (mm > 9 ? '' : '0') + mm
        ].join(':'))
}

//===================================================================================================================================

const toFixed = function (num, fixed) {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
    const arr = num.toString().match(re)
    if (arr && arr.length > 0) {
        return arr[0]
    } else {
        return '0'
    }
}

function floorFixed(x, digits) {
    const factor = Math.pow(10, -digits)
    if (x < factor) // avoid 1e9 => 1 bug
        return toFixed(0, digits)
    else
        return toFixed(x, digits)
}

function roundFixed(x, digits) { // no trailing zeros!
    return parseFloat(x.toFixed(digits)).toString()
}

function xRound(x, digits) {
    return parseFloat(x.toFixed(digits))
}

function myRound(num) {
    if (num < 0.1)
        return roundFixed(num, 3)
    if (num < 10)
        return roundFixed(num, 2)
    if (num < 100)
        return roundFixed(num, 1)
    return roundFixed(num, 0)
}

function tryGetTrim(thisBox, name) {
    try {
        return thisBox.find(name).val().trim()
    } catch (err) {
        return ''
    }
}

const trimOrFillTo = function (str, n) {
    str = str + ''

    if (str.length < n) {
        str = str.padEnd(n, ' ')
    } else {
        str = str.substr(0, n - 4).padEnd(n, '.')
    }
    return str
}

//===================================================================================================================================

function startInterval(callback, ms) {
    callback();
    return setInterval(callback, ms);
}

//===================================================================================================================================

const _print = function (message, logger) {
    if (!logger) {
        logger = document.getElementById('log')
    }

    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Element)
            continue
        if (typeof arguments[i] == 'object') {
            logger.innerHTML +=
                (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />'
        } else {
            logger.innerHTML += arguments[i] + '<br />'
        }
    }
}

const _my_print = function (message, logger) {
    if (!logger) {
        logger = document.getElementById('log')
    }

    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Element)
            continue
        logger.innerHTML = (new Date()).HHMMSS() + ' ' + arguments[i] + '<br />' + logger.innerHTML
    }
}

const _print_force = function (message, logger) {
    if (!logger) {
        logger = document.getElementById('log')
    }

    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Element)
            continue
        if (typeof arguments[i] == 'object') {
            logger.innerHTML =
                (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />'
        } else {
            logger.innerHTML = arguments[i] + '<br />'
        }
    }
}

const _print_bold = function (message) {
    if (!logger) {
        logger = document.getElementById('log')
    }

    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Element)
            continue
        if (typeof arguments[i] == 'object') {
            logger.innerHTML +=
                '<b>' + (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '</b><br />'
        } else {
            logger.innerHTML += '<b>' + arguments[i] + '</b><br />'
        }
    }
}