var container = document.getElementById("machine-learning-with-python-modules");

const introductionToMachineLearning = new PageLinkItem(
    1,
    "Introduction to Machine Learning",
    "Introduction to Machine Learning module details.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/machine-learning-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/machine-learning-with-python/module-1"
);

const regression = new PageLinkItem(
    2,
    "Regression",
    "Module covering regression techniques.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/machine-learning-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/machine-learning-with-python/module-2"
);

const classification = new PageLinkItem(
    3,
    "Classification",
    "Module covering classification techniques.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/machine-learning-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/machine-learning-with-python/module-3"
);

const linearClassification = new PageLinkItem(
    4,
    "Linear Classification",
    "Module focusing on linear classification methods.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/machine-learning-with-python.png", 
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/machine-learning-with-python/module-4"
);

const clustering = new PageLinkItem(
    5,
    "Clustering",
    "Module covering clustering techniques.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/machine-learning-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/machine-learning-with-python/module-5"
);

const finalExamAndProject = new PageLinkItem(
    6,
    "Final Exam and Project",
    "Details about the final exam and project.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-ai-engineering/machine-learning-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-ai-engineering/machine-learning-with-python/module-6"
);

const modules = [
    introductionToMachineLearning,
    regression,
    classification,
    linearClassification,
    clustering,
    finalExamAndProject
];

addItemsToContainer(container, modules);
