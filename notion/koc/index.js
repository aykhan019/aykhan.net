var container = document.getElementById("koc-years");

const year_1 = new PageLinkItem(
    1, 
    "2023-24", 
    "Notes from my first year at Koç University (2023-2024).", 
    "https://media.aykhan.net/thumbnails/notion/koc/thumbnail.png", 
    "https://aykhan.net/notion/koc/23-24/"
);

const year_2 = new PageLinkItem(
    2, 
    "2024-25", 
    "Detailed notes from my second year at Koç University (2024-2025).", 
    "https://media.aykhan.net/thumbnails/notion/koc/thumbnail.png", 
    "https://aykhan.net/notion/koc/24-25/"
);

const year_3 = new PageLinkItem(
    3, 
    "2025-26", 
    "In-depth notes from my third year at Koç University (2025-2026).", 
    "https://media.aykhan.net/thumbnails/notion/koc/thumbnail.png", 
    "https://aykhan.net/notion/koc/25-26/"
);

const year_4 = new PageLinkItem(
    4, 
    "2026-27", 
    "Notes from my fourth year at Koç University (2026-2027).", 
    "https://media.aykhan.net/thumbnails/notion/koc/thumbnail.png", 
    "https://aykhan.net/notion/koc/26-27/"
);

const years = [year_1, year_2, year_3, year_4];

addItemsToContainer(container, years);
