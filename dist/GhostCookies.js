/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// ==UserScript==
// @name            Auto Player for Cookie Monster
// @namespace       http://tampermonkey.net/
// @version         0.8.2
// @description     Auto click cookie, golden cookies, and wrinklers. Autobuy based on Cookie Monster Rating. fully customizable with console functions.
// @author          Ghost Glitch
// @license         GPL-3.0-or-later
// @originallicense none
// @original-script https://greasyfork.org/en/scripts/421709-auto-clicker-for-cookie-clicker
// @original-author Wesley Vermeulen (https://weave-development.com)
// @match           https://orteil.dashnet.org/cookieclicker/
// @grant           unsafeWindow
// @require         https://code.jquery.com/jquery-latest.js
// ==/UserScript==


(function () {
  $(document).ready(function () {
    setTimeout(function () {
      // Turn on extension
      unsafeWindow.autoPlayerEnabled = true;
      unsafeWindow.autoPlayerDelay = 200; // Set autoClicker to true

      unsafeWindow.autoClickerEnabled = true;
      unsafeWindow.autoClickerDelay = 10; // Set auto click shimmers to true

      unsafeWindow.autoClickShimmers = true; // Set global auto-buy to true

      unsafeWindow.autoBuy = true; // Set specific auto-buy to true    

      unsafeWindow.autoBuyUpgrades = true;
      unsafeWindow.autoBuyProducts = true; // Set stop on buff to false

      unsafeWindow.stopOnBuff = false;
      var buffActive = false; // Set console notifications to true

      unsafeWindow.notifications = true; //set Kill Wrinklers to true

      unsafeWindow.autoKillWrinklers = true; // Trigger help function from console

      unsafeWindow.help = help; // Show help menu in console

      function help() {
        console.log("[=== Auto Player for Cookie Monster ===]\n\nYou can use several commands which are listed below:\n\nautoPlayerEnabled = true/false [turn on/off the auto clicker extension]\nautoPlayerDelay = int [delay in milliseconds between purchases]\nautoClickerEnabled = true/false [turn on/off the auto clicker]\nautoClickerDelay = int [delay in milliseconds between clicks]\nautoClickShimmers = true/false [turn on/off the auto clicker for shimmers]\nautoBuy = true/false [turn on/off auto buy of upgrades & products]\nautoBuyUpgrades = true/false [turn on/off auto buy of upgrades]\nautoBuyProducts = true/false [turn on/off auto buy of products]\nautoKillWrinklers = true/false [turn on/off auto kill when full on wrinklers]\nstopOnBuff = true/false [temporarily turn off auto-buy when buff is active. defaults to false]\nnotifications = true/false [turn on/off console notifications]\n\nYou can view your current settings with the settings() command and you can always call for help again with the help() command.");
      } // Trigger settings function from console


      unsafeWindow.settings = settings; // Show settings in console

      function settings() {
        console.log("[=== Auto Player Settings ===]\n\nYou are currently using the following settings:\n\nautoPlayerEnabled = " + unsafeWindow.autoPlayerEnabled + "\nautoPlayerDelay = " + unsafeWindow.autoPlayerDelay + "\nautoClickerEnabled = " + unsafeWindow.autoClickerEnabled + "\nautoClickerDelay = " + unsafeWindow.autoClickerDelay + "\nautoClickShimmers = " + unsafeWindow.autoClickShimmers + "\nautoBuy = " + unsafeWindow.autoBuy + "\nautoBuyUpgrades = " + unsafeWindow.autoBuyUpgrades + "\nautoBuyProducts = " + unsafeWindow.autoBuyProducts + "\nautoKillWrinklers = " + unsafeWindow.autoKillWrinklers + "\nstopOnBuff = " + unsafeWindow.stopOnBuff + "\nnotifications = " + unsafeWindow.notifications + "\n\nYou can view your current settings with the settings() command and you can always call for help again with the help() command.");
      }

      help();

      function clicker() {
        if (unsafeWindow.autoClickerEnabled && unsafeWindow.autoPlayerEnabled && !Game.OnAscend) {
          Game.ClickCookie();
        }

        setTimeout(clicker, unsafeWindow.autoClickerDelay);
      }

      function loop() {
        if (unsafeWindow.autoPlayerEnabled && !Game.OnAscend) {
          if (unsafeWindow.autoClickShimmers) {
            clickShimmers();
          } // Check if buff is finished and resume auto-buy


          buffActive = checkBuff(buffActive);

          if (unsafeWindow.autoBuy && !buffActive) {
            // Buy upgrades
            if (unsafeWindow.autoBuyUpgrades) {
              buyUpgrade();
            } // Buy Products


            if (unsafeWindow.autoBuyProducts) {
              buyProduct();
            }
          }

          if (unsafeWindow.autoKillWrinklers) {
            killWrinklers();
          }
        }

        setTimeout(loop, unsafeWindow.autoPlayerDelay);
      }

      clicker();
      loop();
    }, 1000);
  });
})();

function clickShimmers() {
  Game.shimmers.forEach(function (shimmer) {
    //        if(shimmer.type == "golden")
    //        {
    shimmer.pop();

    if (unsafeWindow.notifications) {
      console.log("Shimmer clicked!");
    } //        }

  });
}

function checkBuff(buffActive) {
  if (unsafeWindow.stopOnBuff) {
    var buffCrate = $("#buffs").find(".crate");

    if (buffCrate.length > 0) {
      buffActive = true;

      if (unsafeWindow.notifications) {
        console.log("Auto-buy temporarily disabled during buff!");
      }
    }
  }

  if (buffActive) {
    var _buffCrate = $("#buffs").find(".crate");

    if (_buffCrate.length == 0) {
      buffActive = false;

      if (unsafeWindow.notifications) {
        console.log("Auto-buy enabled again!");
      }
    }
  }

  return buffActive;
}

function buyUpgrade() {
  var upgrades = $("#upgrades").find(".crate");
  var upgradeColors = []; //extract Colors

  try {
    upgrades.each(function (index) {
      upgradeColors[index] = upgrades.children().eq(index).attr("class").slice(6);
    });
  } catch (e) {
    if (unsafeWindow.notifications) {
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

      if (unsafeWindow.notifications) {
        console.log(color + " Upgrade bought!");
      }
    }
  }
}

function buyProduct() {
  var products = $("#products").find(".product");
  var cheapest = "";
  var monsterKeys = Object.keys(CookieMonsterData.Objects1);
  var greenFound = false;
  checkColorP("1");

  if (!greenFound) {
    checkColorP("10");
  }

  if (!greenFound) {
    checkColorP("100");
  }

  greenFound = false;

  function checkColorP(amount) {
    if (amount == 1) Game.storeBulkButton(2);else if (amount == 10) Game.storeBulkButton(3);else if (amount == 100) Game.storeBulkButton(4);
    monsterKeys.forEach(function (element, index) {
      if (CookieMonsterData["Objects" + amount][monsterKeys[index]].color == "Green") {
        greenFound = true;

        if ($(products[index]).hasClass("enabled")) {
          cheapest = $(products[index]);
        }
      }
    });
  } // Buy Green Product
  // After a buff or when your window was inactive may buys the best product when using short numbers. 14 trillion is in that case less than 400 billion (14 < 400).


  if (cheapest != "") {
    cheapest.click();

    if (unsafeWindow.notifications) {
      var productTitle = cheapest.find(".title");

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
  var wrinklers = Game.wrinklers;
  var count = 0;
  var fullestWrinkler;
  var amount = 0; // Get fullest wrinkler

  $(wrinklers).each(function (index) {
    if ($(wrinklers[index])[0].close == 1) {
      var sucked = $(wrinklers[index])[0].sucked;

      if (sucked > amount) {
        amount = sucked;
        fullestWrinkler = $(wrinklers[index])[0];
      }

      count++;
    }
  }); // Click fullest wrinkler until it popped

  if (count == Game.getWrinklersMax()) {
    for (var i = 0; i < 10; i++) {
      if (fullestWrinkler.close == 1) {
        fullestWrinkler.hp--;
      }
    }
  }
}
/******/ })()
;