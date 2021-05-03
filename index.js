import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: "2captcha", token: "42bdee5c3b9b711ec70d4f8b886a88c3" },
    visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    //args: ["--proxy-server=http://45.136.231.64:7120"],
  });

  const context = await browser.createIncognitoBrowserContext();
  const emailPage = await context.newPage();
  const discordPage = await context.newPage();
  //  const RecaptchaPlugin = require("");

  await emailPage.goto("https://temp-mail.org", { waitUntil: "networkidle0" });

  console.log("Testies 544442342134");

  const cookies = await emailPage.cookies();
  const emailCookie = cookies.filter((e) => e.name == "email")[0];
  const email = decodeURIComponent(emailCookie.value);

  console.log(email);

  // setInterval(() => {
  //   await emailPage.click("#click-to-refresh");
  //   await emailPage.waitForNavigation({ waitUntil: "networkidle0" });

  // }, 1000);

  await discordPage.goto("https://discord.com/register");

  const username = "MontyCarloa";
  const password = "xVeR2567@3!";
  const emailSelector = `input[name="email"]`;
  const usernameSelector = `input[name="username"]`;
  const passwordSelector = `input[name="password"]`;
  const checkBoxSelector = `input[type="checkbox"]`;
  const submitbutton = `button[type="submit"]`;
  const verifybutton = `table[role="presentation"]`;

  await discordPage.type(emailSelector, email);
  await discordPage.type(usernameSelector, username);
  await discordPage.type(passwordSelector, password);
  await discordPage.click(".css-1hwfws3");
  await discordPage.keyboard.type("12");
  await discordPage.keyboard.press("Tab");
  await discordPage.keyboard.type("12");
  await discordPage.keyboard.press("Tab");
  await discordPage.keyboard.type("1995");
  await discordPage.click(checkBoxSelector);
  await discordPage.click(submitbutton);

  //await discordPage.type(".css-1hwfws3", "12");

  // Wait until email is recieved and click on it.
  const emailResponseHandler = async (r) => {
    if (
      r.request().method() == "GET" &&
      r.request().url().includes("https://web1.temp-mail.org/request/mails/id/")
    ) {
      let body = JSON.parse(await r.text());

      // 'no emails yet' msg is in .error, so when it is undefined, we have an email.
      // When we have an email, navigate to it.
      if (body.error === undefined) {
        let mailID = body[0].mail_id;
        emailPage.goto(`https://temp-mail.org/en/view/${mailID}`);
        emailPage.off("response", emailResponseHandler);
      }

      setInterval(async () => {
        const linkHandlers = await emailPage.$x(
          "//a[contains(text(), 'Verify')]"
        );
        if (linkHandlers.length > 0) {
          await linkHandlers[0].click();
          emailPage.off("response", emailResponseHandler);
        } else {
          console.log("Link Not Available");
        }
      }, 4000);
    }
  };
  emailPage.on("response", emailResponseHandler);
  // //await browser.close();
})();

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sleep(fn, ...args) {
  await timeout(3000);
  return fn(...args);
}

// // Normalizing the text
// function getText(linkText) {
//   linkText = linkText.replace(/\r\n|\r/g, "\n");
//   linkText = linkText.replace(/\ +/g, " ");

//   // Replace &nbsp; with a space
//   var nbspPattern = new RegExp(String.fromCharCode(160), "g");
//   return linkText.replace(nbspPattern, " ");
// }

// // find the link, by going over all links on the page
// async function findByLink(page, linkString) {
//   const links = await page.$$("a");
//   for (var i = 0; i < links.length; i++) {
//     let valueHandle = await links[i].getProperty("innerText");
//     let linkText = await valueHandle.jsonValue();
//     console.log(linkText);
//     const text = getText(linkText);
//     if (linkString == text) {
//       console.log(linkString);
//       console.log(text);
//       console.log("Found");
//       links[i].click();
//       return links[i];
//     }
//   }
//   console.log("Could not Find");
//   return null;
// }
