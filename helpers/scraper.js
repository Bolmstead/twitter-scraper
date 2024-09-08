require("dotenv").config();

var player = require("play-sound")((opts = {}));
const olms2074MGClient = require("../MailGunClients/olms2074MGClient");
// const boMGClient = require("../MailGunClients/boMGClient")

const arraysContainSameItems = require("./arraysContainSameItems");
const sendEmail = require("./sendEmail");

// ----- config ------
const testing = false;
const playSound = true;
const keywordsToCreateAnAlertFor = [
  "alert",
  "Alert",
  "Pick",
  "pick",
  "PICK",
  "ALERT",
];
const millisecondsBeforeRerunningScraper = 1000;
const millisecondsBeforeEmailingOthers = 10 * 1000;
const myEmail = ["berkleyo@icloud.com"];
const otherEmails = ["johndo987987@gmail.com"];

console.log("**** CONFIG ****");
console.log(
  "millisecondsBeforeRerunningScraper: ",
  millisecondsBeforeRerunningScraper
);
console.log("testing: ", testing);
console.log("playSound: ", playSound);

// -------------------

const usernameToBeNofiedOf = "InvestAnswers";
const millisecondsBeforeScrapingAgain = 1000;

module.exports = async function scraper(page) {
  try {
    console.log("🏁🏁🏁🏁🏁🏁");

    // Evaluate the page to find and click the specific element

    const tweets = await page.$$('article[data-testid="tweet"]');
    if (!tweets) {
      setTimeout(() => {
        console.log("No Tweets!");
        scraper(page);
      }, 5000);
    } else if (tweets.length < 1) {
      console.log("No Tweets!!");
      setTimeout(() => {
        scraper(page);
      }, 5000);
    }

    const lastTweet = tweets[1];
    if (!lastTweet) {
      setTimeout(() => {
        console.log("No Last Tweet!");
        scraper(page);
      }, 5000);
    }
    console.log("🚀 ~ awaitpage.evaluate ~ lastTweet:: ", lastTweet);
    const doesTheLastTweetImageExist = await page.evaluate((tweet) => {
      // Run this inside the browser context
      return (
        tweet.querySelectorAll(
          'a[href="/TheRoaringKitty/status/1832086356849250635/photo/1"]'
        ).length > 0
      );
    }, lastTweet);
    console.log(
      "🚀 ~ awaitpage.evaluate ~ doesTheLastTweetImageExist:",
      doesTheLastTweetImageExist
    );
    console.log(
      "🚀 ~ awaitpage.evaluate ~ !!doesTheLastTweetImageExist:",
      !!doesTheLastTweetImageExist
    );

    if (!!doesTheLastTweetImageExist) {
      setTimeout(() => {
        scraper(page);
      }, 1000);
    } else {
      player.play("Siren.mp3", function (err) {
        if (err) throw err;
      });
      sendEmail(
        olms2074MGClient,
        `Roaring Kitty Posted!!!`,
        myEmail,
        process.env.OLMS2074_MAILGUN_EMAIL
      );
    }

    async function checkIfElementExists(thePage, numOfTries = 1) {
      console.log("running checkIfElementExists");
      let result, typingStatusElement, typerUsernameEl;
      await thePage.evaluate(() => {
        typingStatusElement = document.querySelector("p.typing-status");

        typerUsernameEl = document.querySelector(".sender-name");
      });
      console.log(
        "🚀 ~ awaitthePage.evaluate ~ typingStatusElement:",
        typingStatusElement
      );
      console.log(
        "🚀 ~ awaitthePage.evaluate ~ typerUsernameEl:",
        typerUsernameEl
      );
      if (typingStatusElement) {
        console.log("💥💥💥💥💥💥💥💥");
        player.play("Success2.mp3", function (err) {
          if (err) throw err;
        });
        return;
      } else {
        console.log(`Retry: ${numOfTries}`);

        setTimeout(async () => {
          checkIfElementExists(page, numOfTries + 1);
        }, 1000);
      }
    }
    // checkIfElementExists(page);

    return;
    // function checkForJamesMsg(prevMessage) {
    //   let newMessageMade = false;
    //   let lastMessageText;
    //   setTimeout(async () => {
    //     console.log("🔎🔎🔎🔎🔎🔎");

    //     const usersThatSentMsgs = await page.$$(
    //       '[class="headerText_bd68ec"]'
    //     );

    //     const lastUsersThatSentMsgs = usersThatSentMsgs.slice(-1);

    //     for (let msg of lastUsersThatSentMsgs) {
    //       const usernameThatPosted = await page.evaluate(
    //         (el) => el.innerText,
    //         msg
    //       );
    //       console.log("🙋‍♂️ Last message sent by: ", usernameThatPosted);
    //       if (usernameThatPosted === usernameToBeNofiedOf) {
    //         const messages = await page.$$(
    //           '[class="markup_a7e664 messageContent_abea64"]'
    //         );

    //         let lastMessage = messages.slice(-1);

    //         lastMessageText = await page.evaluate((el) => {
    //           return el.innerText;
    //         }, lastMessage[0]);
    //         console.log("📬 Last message: ", lastMessageText);

    //         console.log("📭 Previous message: ", prevMessage);

    //         if (!prevMessage) {
    //           prevMessage = lastMessageText;
    //         }

    //         if (lastMessageText !== prevMessage) {
    //           newMessageMade = true;
    //           break;
    //         }
    //       }
    //     }

    //     if (newMessageMade) {
    //       console.log(
    //         "🎉🎉🎉 InvestAnswers sent message in Sol-Alts channel!!!"
    //       );
    //       player.play("Success2.mp3", function (err) {
    //         if (err) throw err;
    //       });
    //       setTimeout(async () => {
    //         checkForJamesMsg(lastMessageText);
    //       }, 5000);
    //     } else {
    //       console.log("👌 He has not sent a msg 👌");
    //       checkForJamesMsg(lastMessageText);
    //     }
    //   }, millisecondsBeforeScrapingAgain);
    // }
    // checkForJamesMsg(null);
  } catch (error) {
    console.log(error);
    setTimeout(async () => {}, 20000);
  }
};
