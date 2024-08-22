function getPageLinkItemHtml(pageLinkItem){
    let dataIndex = pageLinkItem.id;
    if (dataIndex < 10) {
        dataIndex = "0" + dataIndex;
    }
    let content = `
        <li itemscope itemtype="http://schema.org/CreativeWork">
            <a href="${pageLinkItem.pageLink}" style="background-image: url('${pageLinkItem.imageUrl}');"
                data-destination="cerasa" itemprop="url" class="case-study">
                <div class="case-study-mask"></div>
                <div class="case-study-reveal-mask"></div>
                <div class="case-study-mask-number">
                    <div class="case-study-mask-back">${dataIndex}</div>
                    <div class="case-study-mask-front">
                        <div data-index="${dataIndex}" class="case-study-mask-overlay">${dataIndex}</div>
                    </div>
                </div>
                <div class="case-study-text-section">
                    <h3 itemprop="name" class="h2 case-study-title">${pageLinkItem.name}</h3>
                    <h5 itemprop="description" class="case-study-subtitle">${pageLinkItem.description}</h5>
                    <button class="the-button call-to-button">
                        <span class="button-text">${pageLinkItem.btnText}</span>
                        <div class="button-mask"></div>
                        <span class="button-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 476.213 476.213">
                                <path
                                    d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607">
                                </path>
                            </svg>
                        </span>
                    </button>
                </div>
            </a>
        </li>    
   `;
    return content;
}

function addItemsToContainer(container, items){
    items.forEach(item => {
        let content = getPageLinkItemHtml(item);
        container.innerHTML += content;
    }); 
}

function getTasks(taskCount, lessonNameNormalized, lessonName, institution, descriptions){
    let tasks = [];
    for (let i = 0; i < taskCount; i++) {
        let id = i + 1;
        let task = new PageLinkItem(id, `${lessonNameNormalized} Task ${id}`, descriptions[i], `https://media.aykhan.net/thumbnails/${institution}/${lessonName}/task${id}.png`, `https://aykhan.net/tasks/${institution}/${lessonName}/task${id}`, "See Task");
        tasks.push(task);
    }
    return tasks;
}