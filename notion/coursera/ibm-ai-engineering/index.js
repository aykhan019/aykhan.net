var container = document.getElementById("ibm-ai-engineering-courses");

const courses = [
    new PageLinkItem(
        1, 
        "Machine Learning with Python", 
        "Notes from the Machine Learning with Python course on Coursera.", 
        "https://media.aykhan.net/thumbnails/notion/coursera/ibm/machine-learning-with-python.png", 
        "https://aykhan.net/notion/coursera/ibm-ai-engineering/machine-learning-with-python"
    ),
    new PageLinkItem(
        2, 
        "Introduction to Deep Learning & Neural Networks with Keras", 
        "Notes from the Introduction to Deep Learning & Neural Networks with Keras course on Coursera.", 
        "https://media.aykhan.net/thumbnails/notion/coursera/ibm/introduction-to-deep-learning-with-keras.png", 
        "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-deep-learning-with-keras"
    ),
    new PageLinkItem(
        3, 
        "Introduction to Computer Vision & Image Processing", 
        "Notes from the Introduction to Computer Vision & Image Processing course on Coursera.", 
        "https://media.aykhan.net/thumbnails/notion/coursera/ibm/introduction-to-computer-vision-and-image-processing.png", 
        "https://aykhan.net/notion/coursera/ibm-ai-engineering/introduction-to-computer-vision-and-image-processing"
    ),
    new PageLinkItem(
        4, 
        "Deep Neural Networks with PyTorch", 
        "Notes from the Deep Neural Networks with PyTorch course on Coursera.", 
        "https://media.aykhan.net/thumbnails/notion/coursera/ibm/deep-neural-networks-with-pytorch.png", 
        "https://aykhan.net/notion/coursera/ibm-ai-engineering/deep-neural-networks-with-pytorch"
    ),
    new PageLinkItem(
        5, 
        "Building Deep Learning Models with TensorFlow", 
        "Notes from the Building Deep Learning Models with TensorFlow course on Coursera.", 
        "https://media.aykhan.net/thumbnails/notion/coursera/ibm/building-deep-learning-models-with-tensorflow.png", 
        "https://aykhan.net/notion/coursera/ibm-ai-engineering/building-deep-learning-models-with-tensorflow"
    ),
    new PageLinkItem(
        6, 
        "AI Capstone Project with Deep Learning", 
        "Notes from the AI Capstone Project with Deep Learning course on Coursera.", 
        "https://media.aykhan.net/thumbnails/notion/coursera/ibm/ai-capstone-project-with-deep-learning.png", 
        "https://aykhan.net/notion/coursera/ibm-ai-engineering/ai-capstone-project-with-deep-learning"
    )
];

addItemsToContainer(container, courses);
