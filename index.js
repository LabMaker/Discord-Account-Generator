import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(
  // RecaptchaPlugin({
  //   provider: { id: "2captcha", token: "42bdee5c3b9b711ec70d4f8b886a88c3" },
  //   visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  // }),
  StealthPlugin()
);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    //args: ["--proxy-server=http://45.136.231.64:7120"],
  });
  const context = await browser.createIncognitoBrowserContext();

  //  const RecaptchaPlugin = require("");

  const emailPage = await context.newPage();
  const discordPage = await context.newPage();
  console.log("/.///..");

  await emailPage.goto("https://mail.tm/en/", {
    waitUntil: "domcontentloaded",
  });

  // setTimeout(async () => {
  //   console.log("Doing Captcha");
  //   await emailPage.solveRecaptchas();
  //   await Promise.all([emailPage.waitForNavigation()]);
  // }, 5000);

  //const cookies = await emailPage.cookies();
  //const emailCookie = cookies.filter((e) => e.name == "address")[0];
  let email = "";
  while (!email.includes("@")) {
    const localStorage = await emailPage.evaluate(() =>
      localStorage.getItem("vuex")
    );
    var t = localStorage.substring(localStorage.indexOf("address") + 10);
    email = t.substr(0, t.indexOf(",") - 1);
  }

  console.log("emmail", email);
  //const email = decodeURIComponent(emailCookie.value);

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

  // setTimeout(async () => {
  //   await discordPage.solveRecaptchas();
  //   await Promise.all([discordPage.waitForNavigation()]);
  // }, 5000);

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
  // await browser.close();
})();
