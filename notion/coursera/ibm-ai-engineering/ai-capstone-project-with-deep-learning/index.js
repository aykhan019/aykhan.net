var container = document.getElementById("ai-capstone-project-with-deep-learning-modules");

const loadingData = new PageLinkItem(
    1,
    "Loading Data",
    "Module covering data loading.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/ai-capstone-project-with-deep-learning.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/ai-capstone-project-with-deep-learning/module-1"
);

const module2 = new PageLinkItem(
    2,
    "Module 2",
    "Details about Module 2.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/ai-capstone-project-with-deep-learning.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/ai-capstone-project-with-deep-learning/module-2"
);

const module3 = new PageLinkItem(
    3,
    "Module 3",
    "Details about Module 3.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/ai-capstone-project-with-deep-learning.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/ai-capstone-project-with-deep-learning/module-3"
);

const module4 = new PageLinkItem(
    4,
    "Module 4",
    "Details about Module 4.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/ai-capstone-project-with-deep-learning.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/ai-capstone-project-with-deep-learning/module-4"
);

const modules = [
    loadingData,
    module2,
    module3,
    module4
];

addItemsToContainer(container, modules);
