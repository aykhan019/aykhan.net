var container = document.getElementById("notes");

const coursera = new PageLinkItem(1, "Coursera", "Collection of notes from Coursera courses.", 
               "https://media.aykhan.net/thumbnails/notion/coursera/coursera.jpg", "https://aykhan.net/notion/coursera");
const koc = new PageLinkItem(2, "Koç University", "Collection of notes from Koç University courses.", 
               "https://media.aykhan.net/thumbnails/koc/thumbnail.png", "https://aykhan.net/notion/koc");

const notes = [coursera, koc];

addItemsToContainer(container, notes);