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
  //await discordPage.click(submitbutton);

  //await discordPage.type(".css-1hwfws3", "12");

  let emailTitle = "";

  while (emailTitle != "Verify Email Address for Discord") {
    emailTitle = await emailPage.$eval(".mail-item-sub", (el) => el.innerText);
  }

  console.log("Email Is Valid");
  await emailPage.click("div.mail-item-sub");
  console.log("Clicked Email");
  setTimeout(async () => {
    // await emailPage.evaluate(() => {
    //   let iframe = document.getElementById("fullmessage");
    //   let doc = iframe.contentDocument;
    //   let ele = doc.querySelector("you-selector");
    //   const links = doc. page.$$("a");
    // });
    const iframe = emailPage
      .frames()
      .find((frame) => frame.name().includes("Verify Email"));
    findByLink(iframe, "Verify Email");
  }, 5000);
  console.log("Ran 2");

  /*const aTags = await emailPage.$$("a");
  for (const aTag of aTags) {
    console.log(aTag.val);
  } */

  //await browser.close();
})();

// Normalizing the text
function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, "\n");
  linkText = linkText.replace(/\ +/g, " ");

  // Replace &nbsp; with a space
  var nbspPattern = new RegExp(String.fromCharCode(160), "g");
  return linkText.replace(nbspPattern, " ");
}

// find the link, by going over all links on the page
async function findByLink(page, linkString) {
  const links = await page.$$("a");
  for (var i = 0; i < links.length; i++) {
    let valueHandle = await links[i].getProperty("innerText");
    let linkText = await valueHandle.jsonValue();
    console.log(linkText);
    const text = getText(linkText);
    if (linkString == text) {
      console.log(linkString);
      console.log(text);
      console.log("Found");
      links[i].click();
      return links[i];
    }
  }
  console.log("Could not Find");
  return null;
}
