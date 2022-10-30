# The Holy Grail

## Description

Your task this week is to find the location of the Holy Grail. Given [this collection of treasure chests](https://e0f5e8673c64491d8cce34f5.z35.web.core.windows.net/treasure.json) in JSON format, you'll need to traverse and explore the contents of each JSON treasure chest to find clues. The chests and their various items may have attached notes, engravings, messages and other cryptic clues on/in them - you should explore these properties for any external links which could lead you to additional lists of treasure. If you locate such links, your code should download the list and search those chests as well. You've located the Holy Grail when you locate a chest item with the name `holy-grail`.

## Getting Started

To run the solution, simply run `npm run start`.

## Rewards:

5️⃣ Points are awarded for a working algorithm which returns the location of the chest containing the Holy Grail

3️⃣ Further points are awarded for returning the total value\*\* of all chest contents across all lists

1️⃣ Further points are awarded for returning the total number of dead spiders across all lists

1️⃣ Further points are awarded for returning the most common size of boots across all lists

\*\* Values are all measured in doubloons. Any Sapphires found are worth 200 doubloons, Rubies are worth 250 doubloons, and Diamonds are worth 400 doubloons.

## Example:

Your solution might return:

```
Holy Grail location: 20.19 -19.83
Total chest value: 25600 doubloons
Dead spiders: 27
Most common boot size: 8
```
