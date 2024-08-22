var container = document.getElementById("projects");

const khanChess = new PageLinkItem(1, "KhanChess", "Playing a chess game against a chess bot that chooses moves randomly.",
    "https://media.aykhan.net/thumbnails/projects/khanchess.png", "https://aykhan.net/projects/khanchess");

const zust = new PageLinkItem(2, "Zust", "Social Media Website",
    "https://media.aykhan.net/thumbnails/projects/zust.png", "https://aykhan.net/projects/zust");

const khanLibrary = new PageLinkItem(3, "KhanLibrary", "Library App in React",
"https://media.aykhan.net/thumbnails/projects/khanlibrary.png", "https://aykhan.net/projects/khanlibrary");

const calculationPractise = new PageLinkItem(4, "Calculation Practise", "Website to Practise Calculation",
"https://media.aykhan.net/thumbnails/projects/calculation-practise.png", "https://aykhan.net/projects/calculation-practise");

const projects = [khanChess, zust, khanLibrary, calculationPractise];

addItemsToContainer(container, projects);