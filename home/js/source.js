class PageLinkItem {
    constructor(id, name, description, imageUrl, pageLink, btnText = "Explore") {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.pageLink = pageLink;
        this.btnText = btnText;
    }
}

class PageLinkDataManager {
    constructor(jsonFilePath) {
        this.jsonFilePath = jsonFilePath;
    }

    async loadData() {
        try {
            const response = await fetch(this.jsonFilePath);
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading JSON data:', error);
            this.displayError('Error loading page links.');
        }
    }

    getItems(containerId) {
        return (this.data[containerId] || []).map(item => 
            new PageLinkItem(item.id, item.title, item.description, item.imageUrl, item.linkUrl)
        );
    }

    addItemsToContainer(container, items) {
        container.innerHTML = ''; // Clear previous content
        if (items.length === 0) {
            this.displayError('No page links were found.', container);
        } else {
            items.forEach(item => {
                let content = this.getPageLinkItemHtml(item);
                container.innerHTML += content;
            });
        }
    }

    getPageLinkItemHtml(pageLinkItem) {
        let dataIndex = pageLinkItem.id;
        if (dataIndex < 0) {
            dataIndex = "000";
        } else if (dataIndex < 10) {
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

    async addPageLinkItems() {
        await this.loadData();

        const containerId = Object.keys(this.data)[0];
        const container = document.getElementById(containerId);

        if (container) {
            const items = this.getItems(containerId);

            this.addItemsToContainer(container, items);
        } else {
            this.displayError('No page links were found.');
            console.error('Error getting container with ID: ', containerId);
        }
    }

    displayError(message, container = null) {
        const errorMessage = `
            <div class="error-message" style="
                color: red; 
                font-size: 20px; 
                text-align: center; 
                padding: 20px; 
                background-color: #fdd; 
                border: 1px solid #f00; 
                border-radius: 5px; 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
                font-family: Arial, sans-serif;
                position: relative;
            ">
                <span style="
                    display: block; 
                    font-weight: bold;
                ">Error:</span>
                ${message}
            </div>
        `;
        
        if (container) {
            container.innerHTML = errorMessage;
        } else {
            document.body.innerHTML += errorMessage;
        }
    }
}