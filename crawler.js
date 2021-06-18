const { promisify } = require("util");
const { createHash } = require("crypto");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const makeDir = require("make-dir");
const pathExists = require("path-exists");
const puppeteer = require("puppeteer");
const writeFile = promisify(fs.writeFile);

const __asyncValues =
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
const items = new Set();
let done = [];
const startUrl = "https://staging-support-rackspace.netlify.app/";
const baseUrl = "https://staging-support-rackspace.netlify.app/";
const jsonFileName = "searchIndex";

const getUrls = async (page, _url, baseUrl) => {
  let e_1, _a;
  let _b, _c, _d;
  const url = _url.split("#")[0];
  if (done.includes(url)) return;
  done.push(url);
  console.log("Fetching", url);
  try {
    await page.goto(url);
  } catch (error) {}
  let category = null;
  try {
    category =
      (_d = await page.$eval("head > meta[name='category']", (element) =>
        element.getAttribute("content")
      )) !== null && _d !== void 0
        ? _d
        : null;
  } catch (error) {}
  let keywords = null;
  try {
    keywords =
      (_b = await page.$eval("head > meta[name='keywords']", (element) =>
        element.getAttribute("content")
      )) !== null && _b !== void 0
        ? _b
        : null;
  } catch (error) {}
  let content = null;
  try {
    content =
      (_c = await page.$eval(
        "body .content",
        (element) => element.innerText
      )) !== null && _c !== void 0
        ? _c
        : null;
  } catch (error) {}
  let title = "";
  try {
    title = await page.title();
  } catch (error) {}
  items.add({
    objectID: createHash("md5").update(url).digest("hex"),
    url,
    title,
    category,
    keywords,
    content,
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

const crawl = async (startUrl, baseUrl) => {
  var e_2, _f;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (Array.isArray(startUrl)) {
    try {
      for (
        var _g = __asyncValues(startUrl), _h;
        (_h = await _g.next()), !_h.done;

      ) {
        const url = _h.value;
        await getUrls(page, url, baseUrl);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (_h && !_h.done && (_f = _g.return)) await _f.call(_g);
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

(async () => {
    try {
      const items = await crawl(startUrl, baseUrl);
      const stringifiedIndex = JSON.stringify([...items]);
      console.log("Indexing Data:: ", stringifiedIndex)
      if (jsonFileName) {
        let searchIndexPath = path.join("public", jsonFileName + ".json");
        if (await pathExists(searchIndexPath)) {
          console.warn(
            `Existing file at ${searchIndexPath}, plugin will overwrite it but this may indicate an accidental conflict. Delete this file from your repo to avoid confusion - the plugin should be the sole manager of your search index`
          );
          // to do: let people turn off this warning?
        }
        await makeDir(`${searchIndexPath}/..`); // make a dir out of the parent
        await writeFile(searchIndexPath, stringifiedIndex);
        console.log(
          `Search Index JSON generated at ${chalk.cyan(
            `/${searchIndexPath}`
          )}!`
        );
      }
      // fs.writeFileSync("data.json", JSON.stringify([...items]));
      console.log("Crawling Done!");
    } catch (error) {
      console.log(error);
    }
    if (jsonFileName === null) {
      build.failPlugin(
        "jsonFileName cannot both be null, this plugin wouldn't be generating anything!"
      );
    }
})()
