import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(
  RecaptchaPlugin({
    provider: { id: "2captcha", token: "42bdee5c3b9b711ec70d4f8b886a88c3" },
    visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  }),
  StealthPlugin()
);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--proxy-server=http://109.207.130.121:8128"],
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
  try {
    await discordPage.click(checkBoxSelector);
  } catch {
    console.log("ChecBox Doesnt Exist");
  }
  await discordPage.click(submitbutton);

  setTimeout(async () => {
    await discordPage.solveRecaptchas();
    await Promise.all([discordPage.waitForNavigation()]);
    emailPage.bringToFront();
  }, 5000);

  let done = false;
  let mailID = "";
  // Wait until email is recieved and click on it.
  const emailResponseHandler = async (r) => {
    if (emailPage.url.toString().includes("mail.tm/en/view/")) {
      console.log("Hit First return");
      return;
    }

    const linkHandlers = await emailPage.$x("//a[contains(text(), 'Refresh')]");
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      console.log("Link Not Available");
    }

    if (
      r.request().method() == "GET" &&
      r.request().url().includes("https://api.mail.tm/messages")
    ) {
      let body = JSON.parse(await r.text());

      if (body == undefined) {
        return;
      }

      // 'no emails yet' msg is in .error, so when it is undefined, we have an email.
      // When we have an email, navigate to it.
      if (body.error === undefined) {
        mailID = body["hydra:member"][0].id;
        console.log(mailID);
        emailPage.goto(`https://mail.tm/en/view/${mailID}/`);
        done = true;
        emailPage.off("response", emailResponseHandler);
        //emailPage.goto(`https://temp-mail.org/en/view/${mailID}`);
      } else {
        return;
      }

      setTimeout(async () => {
        await emailPage.waitForSelector("iframe");
        const elementHandle = await emailPage.$("div.h-full iframe");
        const frame = await elementHandle.contentFrame();

        const linkHandlers = await frame.$x(
          "//a[contains(text(), 'Verify Email')]"
        );
        // const linkHandlers = await emailPage.$x(
        //   "//a[contains(text(), 'Verify Email')]"
        // );
        if (linkHandlers.length > 0) {
          //await linkHandlers[0].click();
          const verifyUrlPromise = await linkHandlers[0].getProperty("href");
          let verifyUrl = "";
          verifyUrlPromise.jsonValue().then((res) => {
            console.log(res);
            verifyUrl = res;
          });

          const veriifyPage = await context.newPage();
          veriifyPage.goto(verifyUrl);

          setTimeout(async () => {
            await veriifyPage.solveRecaptchas();
            await Promise.all([veriifyPage.waitForNavigation()]);
            await discordPage.goto("https://discord.gg/25nSAPch");
          }, 5000);
          emailPage.off("response", emailResponseHandler);
        } else {
          console.log("Link Not Available");
        }
      }, 10000);
    }
  };
  if (!done) {
    emailPage.on("response", emailResponseHandler);
  } else {
    emailPage.off("response", emailResponseHandler);
  }

  // await browser.close();
})();
