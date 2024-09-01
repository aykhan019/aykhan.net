var container = document.getElementById("coursera-specializations");

const ibm_ai_engineering = new PageLinkItem(
    1, 
    "IBM AI Engineering", 
    "Notes from IBM AI Engineering courses on Coursera.", 
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-v1.png", 
    "https://aykhan.net/notion/coursera/ibm-ai-engineering"
);

const ibm_data_analysis = new PageLinkItem(
    2, 
    "IBM Data Science", 
    "Notes from IBM Data Science courses on Coursera.", 
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-v1.png", 
    "https://aykhan.net/notion/coursera/ibm-data-analysis"
);

const specializations = [ibm_ai_engineering, ibm_data_analysis];

addItemsToContainer(container, specializations);
