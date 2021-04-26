import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    //args: ["--proxy-server=http://194.5.179.115:8088"],
  });
  const context = await browser.createIncognitoBrowserContext();
  const emailPage = await context.newPage();
  const discordPage = await context.newPage();

  await emailPage.goto("https://tempmailo.com/");
  let email = await emailPage.evaluate(
    () => document.getElementById("i-email").value
  );
  while (email == null) {
    email = await emailPage.evaluate(
      () => document.getElementById("eposta_adres").value
    );
  }
  await discordPage.goto("https://discord.com/register");

  const username = "MontyCarloa";
  const password = "xVeR2567@3!";
  const emailSelector = `input[name="email"]`;
  const usernameSelector = `input[name="username"]`;
  const passwordSelector = `input[name="password"]`;
  const checkBoxSelector = `input[type="checkbox"]`;
  const submitbutton = `button[type="submit"]`;

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
  //await discordPage.click(submitbutton);

  //await discordPage.type(".css-1hwfws3", "12");

  let emailTitle = "";

  while (emailTitle != "Verify Email Address for Discord") {
    emailTitle = await emailPage.$eval(".mail-item-sub", (el) => el.innerText);
  }

  console.log("Email Is Valid");
  await emailPage.click(".mail-item-sub");

  let x = await emailPage.$eval(".mail-message");
  console.log(x);

  //await browser.close();
})();
