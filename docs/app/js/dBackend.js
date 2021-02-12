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

async function init_ethers(App) {
    App.userAddr = null

    _print("Connecting MetaMask (please unlock)")

    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.enable()
        } catch (error) {
            // User denied account access...
            _print_bold('User denied account access')
        }
        App.chain = new ethers.providers.Web3Provider(window.ethereum)
    }
    else if (window.web3) {
        App.chain = new ethers.providers.Web3Provider(window.web3.currentProvider)
    }

    let accounts = await App.chain.listAccounts()
    App.userAddr = accounts[0]

    if (!App.userAddr || !ethers.utils.isAddress(App.userAddr)) {
        _print_bold('Could not initialize your address.')
        App.userAddr = null
        return null
    }

    localStorage.setItem('addr', App.userAddr)
    _print_force('')
}
