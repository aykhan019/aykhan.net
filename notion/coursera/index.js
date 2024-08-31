var container = document.getElementById("coursera-specializations");

const ibm_ai_engineering = new PageLinkItem(
    1, 
    "IBM AI Engineering", 
    "Notes from IBM AI Engineering courses on Coursera.", 
    "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ibm-v1.png", 
    "https://aykhan.net/notion/coursera/ibm-ai-engineering"
);

const ibm_data_science = new PageLinkItem(
    2, 
    "IBM Data Science", 
    "Notes from IBM Data Science courses on Coursera.", 
    "https://media.aykhan.net/thumbnails/notion/coursera/ibmibm-v2.png", 
    "https://aykhan.net/notion/coursera/ibm-data-science"
);

const specializations = [ibm_ai_engineering, ibm_data_science];

addItemsToContainer(container, specializations);
