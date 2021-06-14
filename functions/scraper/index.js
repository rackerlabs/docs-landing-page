var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
const { createHash } = require("crypto");
const chrome = require("chrome-aws-lambda");
const fs = require("fs");
const items = new Set();
const startUrl = "https://docs.rackspace.com/";
const baseUrl = "https://docs.rackspace.com/";
let done = [];
const getUrls = async (page, _url, baseUrl) => {
  var e_1, _a;
  var _b, _c;
  const url = _url.split("#")[0];
  if (done.includes(url)) return;
  done.push(url);
  console.log("Fetching", url);
  try {
    await page.goto(url);
  } catch (error) {}
  let description = undefined;
  try {
    description =
      (_b = await page.$eval("head > meta[name='description']", (element) =>
        element.getAttribute("content")
      )) !== null && _b !== void 0
        ? _b
        : undefined;
  } catch (error) {}
  let text = undefined;
  try {
    text =
      (_c = await page.$eval("main", (element) => element.innerText)) !==
        null && _c !== void 0
        ? _c
        : undefined;
  } catch (error) {}
  let title = "";
  try {
    title = await page.title();
  } catch (error) {}
  items.add({
    objectID: createHash("md5").update(url).digest("hex"),
    url,
    title,
    description,
    text,
  });
  let hrefs = [];
  try {
    hrefs = await page.$$eval("a", (as) => as.map((a) => a.href));
  } catch (error) {}
  try {
    for (
      var hrefs_1 = __asyncValues(hrefs), hrefs_1_1;
      (hrefs_1_1 = await hrefs_1.next()), !hrefs_1_1.done;

    ) {
      const href = hrefs_1_1.value;
      if (href) {
        if (baseUrl) {
          if (href.startsWith(baseUrl)) await getUrls(page, href, baseUrl);
        } else {
          await getUrls(page, href, baseUrl);
        }
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (hrefs_1_1 && !hrefs_1_1.done && (_a = hrefs_1.return))
        await _a.call(hrefs_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
};
const crawl = async () => {
  var e_2, _a;
  const browser = await chrome.puppeteer.launch({
    executablePath: await chrome.executablePath,
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    headless: chrome.headless,
  });
  const page = await browser.newPage();
  if (Array.isArray(startUrl)) {
    try {
      for (
        var _b = __asyncValues(startUrl), _c;
        (_c = await _b.next()), !_c.done;

      ) {
        const url = _c.value;
        await getUrls(page, url, baseUrl);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  } else {
    await getUrls(page, startUrl, baseUrl);
  }
  await browser.close();
  return items;
};
exports.handler = async (event, context) => {
  try {
    const items = await crawl();
    fs.writeFileSync("data.json", JSON.stringify([...items]));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Completed Crawling!`,
        buffer: items,
      }),
    };
    // console.log("Crawling Done!");
  } catch (error) {
      return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Unable to Crawl: ${error}'})
      }
    // console.log(error);
  }
};
