/*!
 * YieldFarming
 * Boilerplate for a Static website using EJS and SASS
 * https://yieldfarming.info
 * @author Jongseung Lim -- https://yieldfarming.info
 * Copyright 2020. MIT Licensed.
 */
 
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

function startInterval(callback, ms) {
    callback();
    return setInterval(callback, ms);
}

async function init_ethers() {
    const App = {}
    _print("Connecting MetaMask (please unlock)")
    // document.getElementById('log').innerHTML = "Connecting MetaMask... "

    let isMetaMaskInstalled = true

    // Modern dapp browsers...
    if (window.ethereum) {
        App.web3Provider = window.ethereum
        try {
            // Request account access
            await window.ethereum.enable()
        } catch (error) {
            // User denied account access...
            _print_bold('User denied account access')
        }
        App.provider = new ethers.providers.Web3Provider(window.ethereum)
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        App.provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
    }

    let accounts = await App.provider.listAccounts()
    App.YOUR_ADDRESS = accounts[0]

    if (!App.YOUR_ADDRESS || !ethers.utils.isAddress(App.YOUR_ADDRESS)) {
        _print_bold('Could not initialize your address.')
        return null
    }

    localStorage.setItem('addr', App.YOUR_ADDRESS)
    _print_force('')
    return App
}

const getUrlParameter = function (sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=')

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1])
        }
    }
}

const toFixed = function (num, fixed) {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
    const arr = num.toString().match(re)
    if (arr && arr.length > 0) {
        return arr[0]
    } else {
        return '0'
    }
}

const tryStart = function (f) {
    f().catch(e => {
        _print(e)
        console.error(e)
        _print('Oops something went wrong. Try refreshing the page.')
    })
}

let logger

const consoleInit = function () {
    logger = document.getElementById('log')
}

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
        logger2 = document.getElementById('log2')
    }

    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Element) 
            continue
        logger.innerHTML = (new Date()).HHMMSS() + ' ' + arguments[i] + '<br />' + logger.innerHTML
        if (logger2)
            logger2.innerHTML = (new Date()).HHMMSS() + ' ' + arguments[i]
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

const _print_link = function (message, onclickFunction) {
    if (!logger) {
        logger = document.getElementById('log')
    }

    const uuid = ID()

    logger.innerHTML += '<a href="#" id=' + uuid + '>' + message + '</a><br />'

    $(document).on('click', '#' + uuid, function () {
        console.log('clicked')
        onclickFunction()
        return false
    })
}

const _print_href = function (message, href) {
    if (!logger) {
        logger = document.getElementById('log')
    }

    const uuid = ID()

    logger.innerHTML += `<a href="${href}" target="_blank" id="${uuid}">${message}</a><br />`
}

const sleep = function (milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
        currentDate = Date.now()
    } while (currentDate - date < milliseconds)
}

const lookUpPrices = async function (id_array) {
    let ids = id_array.join('%2C')
    return $.ajax({
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd',
        type: 'GET',
    })
}

const lookUpPricesHistorical = async function (id, from, to) {
    return $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`,
        type: 'GET',
    })
}

const getBlockNumberFromTimestamp = async function (timestamp) {
    const res = await $.ajax({
        url: `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=XRFWK1IDBR545CXNJ6NQSYAVINUQB7IDV1`,
        type: 'GET',
    })

    return res.result;
}

const getSourceCode = async function (address) {
    return $.ajax({
        url: `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=XRFWK1IDBR545CXNJ6NQSYAVINUQB7IDV1`,
        type: 'GET',
    })
}

const lookUpPricesSevenDays = async function (id) {
    const to = Date.now() / 1000
    const from = to - 604800
    return await lookUpPricesHistorical(id, from, to)
}

const getPricesSevenDaysStripped = async function (id) {
    const prices = await lookUpPricesSevenDays(id)
    return prices.prices.map(x => x[1])
}

const getHistoricalPricesStripped = async function (id, from, to) {
    const prices = await lookUpPricesHistorical(id, from, to)
    return prices.prices.map(x => x[1])
}

const getPrices24HoursStripped = async function (id) {
    const to = Date.now() / 1000
    const from = to - 24 * 60 * 60
    const prices = (await lookUpPricesHistorical(id, from, to)).prices

    let skipEveryTwo = 0

    const reducedArr = []

    for (let i = 0; i < prices.length; i++) {
        if (skipEveryTwo === 0) {
            reducedArr.push(prices[i][1])
        }
        skipEveryTwo++
        if (skipEveryTwo > 1) {
            skipEveryTwo = 0
        }
    }

    return reducedArr
}

const _print24HourPrice = async function (id, ticker) {
    _print('')
    try {
        const historicalPrices = await getPrices24HoursStripped(id)
        console.log(historicalPrices)
        const config = {
            height: 20, // any height you want,
        }

        const plotString = asciichart.plot(historicalPrices, config)
        _print(plotString)

        let i = 0
        while (plotString[i] !== '\n') {
            i++
        }

        const msg = `${ticker} chart past 24 hours`
        const space = i - msg.length > 0 ? (i - msg.length) / 2 : 0
        let leftSpacing = ''

        for (let i = 0; i < space; i++) {
            leftSpacing += ' '
        }

        _print(`${leftSpacing}${msg}\n`)
    } catch (e) {
        _print('Could not load historical price.')
        console.log(e)
    }
}

const getBlockTime = function () {
    _print('Fetching current block time...')
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://etherchain.org/api/basic_stats',
            type: 'GET',
            success: function (data, text) {
                if (data['currentStats'] && data['currentStats']['block_time']) {
                    resolve(data['currentStats']['block_time'])
                    return
                }

                _print(`Etherchain basic stats is invalid. ${data}`)
                _print('Using backup data...')
                resolve(BLOCK_TIME)
            },
            error: function (request, status, error) {
                _print('Could not get etherchain basic stats.')
                _print(request.responseText)
                _print('Using backup data...')
                resolve(BLOCK_TIME)
            },
        })
    })
}

const printBALRewards = async function (synthStakingPoolAddr, BALPrice, percentageOfBalancerPool) {}

const getLatestTotalBALAmount = async function (addr) {
    const bal_earnings = await getBALEarnings(addr, BAL_DISTRIBUTION_WEEK - 1)
    return bal_earnings[0]
}

const safeParseFloat = function (str) {
    let res = parseFloat(str)
    return res ? res : 0
}

const getBALEarnings = async function (addr, startWeek) {
    // SNX-usdc Redirect
    if (addr.toLowerCase() === '0xfbaedde70732540ce2b11a8ac58eb2dc0d69de10') {
        addr = '0xEb3107117FEAd7de89Cd14D463D340A2E6917769'
    }

    const bal_earnings = []

    for (let i = startWeek; i < BAL_DISTRIBUTION_WEEK; i++) {
        const data = await $.getJSON(`../../js/bal_rewards/week${i + 1}.json`)
        const earning_checksum = safeParseFloat(data[addr])

        if (earning_checksum === 0) {
            const earning = safeParseFloat(data[addr.toLowerCase()]) + earning_checksum
            bal_earnings.push(earning)
        } else {
            bal_earnings.push(earning_checksum)
        }
    }

    return bal_earnings
}

const get_synth_weekly_rewards = async function (synth_contract_instance) {
    if (await isRewardPeriodOver(synth_contract_instance)) {
        return 0
    }

    const rewardRate = await synth_contract_instance.rewardRate()
    return (rewardRate / 1e18) * 604800
}

const isRewardPeriodOver = async function (reward_contract_instance) {
    const now = Date.now() / 1000
    const periodFinish = await getPeriodFinishForReward(reward_contract_instance)
    return periodFinish < now
}

const getPeriodFinishForReward = async function (reward_contract_instance) {
    return await reward_contract_instance.periodFinish()
}

const ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (
        '_' +
        Math.random()
        .toString(36)
        .substr(2, 9)
    )
}

function sleep_async(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 *
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the the amount of time
 */
const forHumans = function (seconds) {
    var day = Math.floor((seconds % 31536000) / 86400)
    if (day > 1)
        day += ' days'
    else if (day > 0)
        day += ' day'
    else
        day = ''
    var hr = Math.floor(((seconds % 31536000) % 86400) / 3600)
    if (hr < 10)
        hr = '0' + hr
    var min = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)
    if (min < 10)
        min = '0' + min
    var sec = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60)
    if (sec < 10)
        sec = '0' + sec
    
    let returntext = day + ' ' + hr + ':' + min + ':' + sec

    return returntext.trim()
}

const showLoading = function () {
    $('#main_loader')
        .eq(0)
        .show()
}

const hideLoading = function () {
    $('#main_loader')
        .eq(0)
        .hide()
}

const toDollar = formatter.format

const rewardsContract_resetApprove = async function (stakingTokenAddr, rewardPoolAddr, App) {
    const signer = App.provider.getSigner()

    const STAKING_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer)

    showLoading()

    STAKING_TOKEN.approve(rewardPoolAddr, 0)
        .then(function (t) {
            return App.provider.waitForTransaction(t.hash)
        })
        .catch(function () {
            hideLoading()
        })
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

const rewardsContract_stake = async function (stakingTokenAddr, rewardPoolAddr, App) {
    const signer = App.provider.getSigner()

    const TEND_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, signer)
    const WEEBTEND_V2_TOKEN = new ethers.Contract(rewardPoolAddr, YFFI_REWARD_CONTRACT_ABI, signer)

    const currentTEND = await TEND_TOKEN.balanceOf(App.YOUR_ADDRESS)
    const allowedTEND = await TEND_TOKEN.allowance(App.YOUR_ADDRESS, rewardPoolAddr)

    let allow = Promise.resolve()

    if (allowedTEND / 1e18 < currentTEND / 1e18) {
        showLoading()
        allow = TEND_TOKEN.approve(rewardPoolAddr, ethers.constants.MaxUint256)
            .then(function (t) {
                return App.provider.waitForTransaction(t.hash)
            })
            .catch(function () {
                hideLoading()
                alert('Try resetting your approval to 0 first')
            })
    }

    if (currentTEND / 1e18 > 0) {
        showLoading()
        allow
            .then(async function () {
                WEEBTEND_V2_TOKEN.stake(currentTEND, {
                        gasLimit: 250000
                    })
                    .then(function (t) {
                        App.provider.waitForTransaction(t.hash).then(function () {
                            hideLoading()
                        })
                    })
                    .catch(function () {
                        hideLoading()
                        _print('Something went wrong.')
                    })
            })
            .catch(function () {
                hideLoading()
                _print('Something went wrong.')
            })
    } else {
        alert('You have no tokens to stake!!')
    }
}

const rewardsContract_unstake = async function (rewardPoolAddr, App) {
    const signer = App.provider.getSigner()

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, Y_STAKING_POOL_ABI, signer)
    const currentStakedAmount = await REWARD_POOL.balanceOf(App.YOUR_ADDRESS)
    const earnedTokenAmount = (await REWARD_POOL.earned(App.YOUR_ADDRESS)) / 1e18

    if (earnedTokenAmount > 0) {
        showLoading()
        REWARD_POOL.withdraw(currentStakedAmount, {
                gasLimit: 250000
            })
            .then(function (t) {
                return App.provider.waitForTransaction(t.hash)
            })
            .catch(function () {
                hideLoading()
            })
    }
}

const rewardsContract_exit = async function (rewardPoolAddr, App) {
    const signer = App.provider.getSigner()

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, Y_STAKING_POOL_ABI, signer)
    const currentStakedAmount = (await REWARD_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

    if (currentStakedAmount > 0) {
        showLoading()
        REWARD_POOL.exit({
                gasLimit: 250000
            })
            .then(function (t) {
                return App.provider.waitForTransaction(t.hash)
            })
            .catch(function () {
                hideLoading()
            })
    }
}

const rewardsContract_claim = async function (rewardPoolAddr, App) {
    const signer = App.provider.getSigner()

    const REWARD_POOL = new ethers.Contract(rewardPoolAddr, Y_STAKING_POOL_ABI, signer)

    console.log(App.YOUR_ADDRESS)

    const earnedYFFI = (await REWARD_POOL.earned(App.YOUR_ADDRESS)) / 1e18

    if (earnedYFFI > 0) {
        showLoading()
        REWARD_POOL.getReward({
                gasLimit: 250000
            })
            .then(function (t) {
                return App.provider.waitForTransaction(t.hash)
            })
            .catch(function () {
                hideLoading()
            })
    }
}

const print_warning = function () {
    _print_bold('WARNING: DO NOT USE STAKE IN THIS POOL UNLESS YOU HAVE REVIEWED THE CONTRACTS.')
    _print_bold('         YOU ARE RESPONSIBLE FOR ANY FUNDS THAT YOU LOSE BY INTERACTING WITH THIS CONTRACT.\n')
}