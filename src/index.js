const { get } = require("http");
const fetch = require("node-fetch");

const START_URL =
  "https://e0f5e8673c64491d8cce34f5.z35.web.core.windows.net/treasure.json";

let holyGrailLocation;

const readJson = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const flattenObjectValues = (value) => {
  let temp = [];
  if (typeof value == "object") {
    if (Array.isArray(value)) {
      for (let i of value) {
        temp = temp.concat(flattenObjectValues(i));
      }
    }
    // OBJECT
    else {
      for (let i in value) {
        temp = temp.concat(flattenObjectValues(value[i]));
      }
    }
  }
  // FLAT STRING, NUMBER, OR BOOLEAN
  else {
    temp.push(value);
  }
  return temp;
};

const isHolyGrail = (obj) => {
  if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
    return false;
  } else if (obj.hasOwnProperty("holy-grail")) {
    return true;
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = isHolyGrail(obj[i], "holy-grail");
      if (result) {
        return result;
      }
    }
  } else {
    for (const k in obj) {
      const result = isHolyGrail(obj[k], "holy-grail");
      if (result) {
        return result;
      }
    }
  }

  return false;
};

const findNewJsonUrls = (flatArray) => {
  return flatArray
    .filter((e) => typeof e === "string" && e.includes("json"))
    .map((url) => {
      return url
        .split(" ")
        .filter((part) => part.includes("json"))
        .join("");
    });
};

const calculateValue = (contents) => {
  const array = Object.entries(contents);

  const specialItems = ["diamond", "sapphire", "ruby", "spider", "boots"];
  let deadSpiderCount = 0;
  const bootsArray = [];

  const result = array
    .map(([item, object]) => {
      if (!specialItems.includes(item) && typeof object.value === "number") {
        return object.value;
      }

      if (!specialItems.includes(item) && object.value?.value) {
        return object.value.value;
      }

      if (!specialItems.includes(item) && object.coins?.value) {
        return object.coins.value;
      }

      if (item === "diamond") {
        return object.count * 400;
      }

      if (item === "sapphire") {
        return object.count * 200;
      }

      if (item === "ruby") {
        return object.count * 250;
      }

      if (item === "spider") {
        if (!item.alive) {
          deadSpiderCount++;
        }
        return 0;
      }

      if (item === "boots") {
        bootsArray.push(object.size);
        return 0;
      }

      if (!object.value || !object.count) {
        return 0;
      }
    })
    .reduce((acc, curr) => (acc = acc + curr), 0);

  return { totalValue: result, deadSpiderCount, bootsArray };
};

const getMostFrequentValue = (arr) => {
  const store = {};
  arr.forEach((num) => (store[num] ? (store[num] += 1) : (store[num] = 1)));
  return Object.keys(store).sort((a, b) => store[b] - store[a])[0];
};

const findTreasure = async () => {
  const startData = await readJson(START_URL);

  let treasureValue = 0;
  let deadSpiders = 0;
  const boots = [];

  const searchChests = (arr) => {
    console.log("SEARCHING");
    const newUrls = [];
    let isHoly;
    arr.forEach((treasureChest, i) => {
      isHoly = isHolyGrail(treasureChest);
      // console.log(isHoly);

      if (isHoly) {
        console.log({ holyGrailLocation: treasureChest.location });
        holyGrailLocation = treasureChest.location;
      }

      const { totalValue, deadSpiderCount, bootsArray } = calculateValue(
        treasureChest.contents
      );

      treasureValue += totalValue;
      deadSpiders += deadSpiderCount;
      boots.push(...bootsArray);

      // console.log(treasureValue, deadSpiders, bootsArray);

      const flatArray = flattenObjectValues(treasureChest);

      const urls = findNewJsonUrls(flatArray);
      if (urls.length) {
        newUrls.push(...urls);
      }
    });

    if (newUrls.length) {
      console.log("NEWURLS", newUrls.length);
      newUrls.forEach(async (url, i) => {
        console.log("URL", url);
        const data = await readJson(url);
        if (i === 0) {
          console.log("DATA", data[0].note);
        }
        return searchChests(data);
      });
    }

    return isHoly;
  };

  searchChests(startData);

  const mostCommonBootSize = getMostFrequentValue(boots);

  return {
    treasureValue,
    deadSpiders,
    mostCommonBootSize,
  };
};

const getResult = async () => {
  const result = await findTreasure();
  console.log("LINE 198", result);
};

getResult();
