// based on script: https://greasyfork.org/en/scripts/421709-auto-clicker-for-cookie-clicker
// original author: Wesley Vermeulen (https://weave-development.com)
'use strict';

(function () {
    $(document).ready(function () {
        setTimeout(function () {
            // Turn on extension
            window.autoPlayerEnabled = true;
            window.autoPlayerDelay = 200
        
            // Set autoClicker to true
            window.autoClickerEnabled = true;
            window.autoClickerDelay = 10;
        
            // Set auto click shimmers to true
            window.autoClickShimmers = true;
        
            // Set global auto-buy to true
            window.autoBuy = true;
        
            // Set specific auto-buy to true    
            window.autoBuyUpgrades = true;
            window.autoBuyProducts = true;
        
            // Set stop on buff to false
            window.stopOnBuff = false;
            let buffActive = false;
        
            // Set console notifications to true
            window.notifications = true;
        
            //set Kill Wrinklers to true
            window.autoKillWrinklers = true;

            // Trigger help function from console
            help = help;

            // Show help menu in console
            function help() {
                console.log("[=== Auto Player for Cookie Monster ===]\n\nYou can use several commands which are listed below:\n\nautoPlayerEnabled = true/false [turn on/off the auto clicker extension]\nautoPlayerDelay = int [delay in milliseconds between purchases]\nautoClickerEnabled = true/false [turn on/off the auto clicker]\nautoClickerDelay = int [delay in milliseconds between clicks]\nautoClickShimmers = true/false [turn on/off the auto clicker for shimmers]\nautoBuy = true/false [turn on/off auto buy of upgrades & products]\nautoBuyUpgrades = true/false [turn on/off auto buy of upgrades]\nautoBuyProducts = true/false [turn on/off auto buy of products]\nautoKillWrinklers = true/false [turn on/off auto kill when full on wrinklers]\nstopOnBuff = true/false [temporarily turn off auto-buy when buff is active. defaults to false]\nnotifications = true/false [turn on/off console notifications]\n\nYou can view your current settings with the settings() command and you can always call for help again with the help() command.");
            }

            // Trigger settings function from console
            settings = settings;

            // Show settings in console
            function settings() {
                console.log("[=== Auto Player Settings ===]\n\nYou are currently using the following settings:\n\nautoPlayerEnabled = " + autoPlayerEnabled + "\nautoPlayerDelay = " + autoPlayerDelay + "\nautoClickerEnabled = " + autoClickerEnabled + "\nautoClickerDelay = " + autoClickerDelay + "\nautoClickShimmers = " + autoClickShimmers + "\nautoBuy = " + autoBuy + "\nautoBuyUpgrades = " + autoBuyUpgrades + "\nautoBuyProducts = " + autoBuyProducts + "\nautoKillWrinklers = " + autoKillWrinklers + "\nstopOnBuff = " + stopOnBuff + "\nnotifications = " + notifications + "\n\nYou can view your current settings with the settings() command and you can always call for help again with the help() command.");
            }

            help();

            function clicker() {
                if (window.autoClickerEnabled && window.autoPlayerEnabled && !Game.OnAscend) {
                    Game.ClickCookie();
                }
                setTimeout(clicker, window.autoClickerDelay);
            }

            function loop() {
                if (window.autoPlayerEnabled && !Game.OnAscend) {
                    if (window.autoClickShimmers) {
                        clickShimmers();
                    }
                    // Check if buff is finished and resume auto-buy
                    buffActive = checkBuff(buffActive);
                    if (window.autoBuy && !buffActive) {
                        // Buy upgrades
                        if (window.autoBuyUpgrades) {
                            buyUpgrade();
                        }
                        // Buy Products
                        if (window.autoBuyProducts) {
                            buyProduct();
                        }
                    }
                    if (window.autoKillWrinklers) {
                        killWrinklers();
                    }
                }
                setTimeout(loop, window.autoPlayerDelay);
            }

            clicker()
            loop()
        }, 1000);



    })
})();

function clickShimmers() {
    Game.shimmers.forEach(function (shimmer) {
        //        if(shimmer.type == "golden")
        //        {
        shimmer.pop()
        if (window.notifications) {
            console.log("Shimmer clicked!");
        }
        //        }
    })
}

function checkBuff(active) {
    if (window.stopOnBuff) {
        let buffCrate = $("#buffs").find(".crate");
        if (buffCrate.length > 0) {
            active = true;

            if (window.notifications) {
                console.log("Auto-buy temporarily disabled during buff!");
            }
        }
    }
    if (active) {
        let buffCrate = $("#buffs").find(".crate");
        if (buffCrate.length == 0) {
            active = false;

            if (window.notifications) {
                console.log("Auto-buy enabled again!");
            }
        }
    }
    return active
}

function buyUpgrade() {
    let upgrades = $("#upgrades").find(".crate");
    let upgradeColors = [];

    //extract Colors
    try {
        upgrades.each(function (index) {
            upgradeColors[index] = upgrades.children().eq(index).attr("class").slice(6);
        });
    } catch (e) {
        if (window.notifications) {
            console.log("Minor Error, if you know how to fix let me know. Line 144 of Auto Player for CM:", e.name, e.message);
        }
    }

    upgrades.each(function (index) {
        checkColorU(index, "Gray");
        checkColorU(index, "Blue");
        checkColorU(index, "Green");
    });

    function checkColorU(i, color) {
        if (upgradeColors[i] == color && $(upgrades[i]).hasClass("enabled")) {
            $(upgrades[i]).click();
            if (window.notifications) {
                console.log(color + " Upgrade bought!");
            }
        }
    }
}

function buyProduct() {
    let products = $("#products").find(".product");
    let cheapest = "";
    let monsterKeys = Object.keys(CookieMonsterData.Objects1);
    let greenFound = false;
    checkColorP("1");
    if (!greenFound) {
        checkColorP("10")
    }
    if (!greenFound) {
        checkColorP("100")
    }
    greenFound = false;

    function checkColorP(amount) {

        if (amount == 1) Game.storeBulkButton(2);
        else if (amount == 10) Game.storeBulkButton(3);
        else if (amount == 100) Game.storeBulkButton(4);

        monsterKeys.forEach(function (element, index) {
            if (CookieMonsterData[("Objects" + amount)][monsterKeys[index]].color == "Green") {
                greenFound = true;
                if ($(products[index]).hasClass("enabled")) {
                    cheapest = $(products[index]);
                }
            }
        });
    }

    // Buy Green Product
    // After a buff or when your window was inactive may buys the best product when using short numbers. 14 trillion is in that case less than 400 billion (14 < 400).
    if (cheapest != "") {
        cheapest.click();
        if (window.notifications) {
            let productTitle = cheapest.find(".title");
            if (productTitle.find("span").length > 0) {
                console.log(productTitle.find("span").html() + " nr." + cheapest.find(".title.owned").html() + " bought!");
            } else {
                console.log(productTitle.html() + " nr." + cheapest.find(".title.owned").html() + " bought!");
            }
        }
    }
    cheapest = "";

}

function killWrinklers() {
    let wrinklers = Game.wrinklers;
    let count = 0;
    let fullestWrinkler;
    let amount = 0;

    // Get fullest wrinkler
    $(wrinklers).each(function (index) {
        if ($(wrinklers[index])[0].close == 1) {
            let sucked = $(wrinklers[index])[0].sucked;

            if (sucked > amount) {
                amount = sucked;
                fullestWrinkler = $(wrinklers[index])[0];
            }

            count++;
        }
    });

    // Click fullest wrinkler until it popped
    if (count == Game.getWrinklersMax()) {
        for (var i = 0; i < 10; i++) {
            if (fullestWrinkler.close == 1) {
                fullestWrinkler.hp--;
            }
        }
    }
}
