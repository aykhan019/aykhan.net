var container = document.getElementById("institutions");

const stepIt = new PageLinkItem(1, "Step IT Academy", "Discover my programming journey at this educational platform", 
               "https://media.aykhan.net/thumbnails/step-it-academy/thumbnail.png", "https://aykhan.net/tasks/step-it-academy");
const metu = new PageLinkItem(2, "Koç University", "Explore my tasks at this prestigious Turkish institution", 
               "https://media.aykhan.net/thumbnails/koc/thumbnail.png", "https://aykhan.net/tasks/koc");

const institutions = [stepIt, metu];

addItemsToContainer(container, institutions);