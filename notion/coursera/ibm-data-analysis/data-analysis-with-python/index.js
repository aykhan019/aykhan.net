var container = document.getElementById("data-analysis-with-python-modules");

const importingDataSets = new PageLinkItem(
    1,
    "Importing Data Sets",
    "Details about importing data sets for analysis.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-data-analysis/data-analysis-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-data-analysis/data-analysis-with-python/module-1"
);

const dataWrangling = new PageLinkItem(
    2,
    "Data Wrangling",
    "Techniques for cleaning and organizing data.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-data-analysis/data-analysis-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-data-analysis/data-analysis-with-python/module-2"
);

const exploratoryDataAnalysis = new PageLinkItem(
    3,
    "Exploratory Data Analysis",
    "Methods for exploring and understanding data.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-data-analysis/data-analysis-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-data-analysis/data-analysis-with-python/module-3"
);

const modelDevelopment = new PageLinkItem(
    4,
    "Model Development",
    "Processes for developing data models.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-data-analysis/data-analysis-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-data-analysis/data-analysis-with-python/module-4"
);

const modelEvaluationAndRefinement = new PageLinkItem(
    5,
    "Model Evaluation and Refinement",
    "Techniques for evaluating and refining data models.",
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-data-analysis/data-analysis-with-python.png",
    "https://aykhan.net/notion/coursera/ibm-data-analysis/data-analysis-with-python/module-5"
);

const modules = [
    importingDataSets,
    dataWrangling,
    exploratoryDataAnalysis,
    modelDevelopment,
    modelEvaluationAndRefinement
];

addItemsToContainer(container, modules);
