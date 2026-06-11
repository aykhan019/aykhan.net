const imageLinks = [
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img12_q8kva7",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img9_lzhasd",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img4_jqq7dt",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img8_byxddu",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img6_he77n6",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img1_qfug4c",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img7_nr0z0t",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img2_fzctwn",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img10_axtob1",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img4_kidw9c",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img5_mnqzsp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img11_fzoqnb",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task4/img13_oep4ao"
];

document.addEventListener("touchstart", function () { }, true);

const carousel = document.getElementById("carousel");
let mainImage = document.getElementById("main-img");

let id = 1;

function addImages() {
    imageLinks.forEach(link => {
        const img = new Image();
        img.src = link;
        carousel.innerHTML += `
            <img id='${id}' onclick='imgClick(src)' src='loading.gif' alt='Image'>
        `;

        let myId = id;
        img.onload = function () {
            let imgElement = document.getElementById(myId);
            imgElement.src = img.src;
        };
        id++;
    });
    mainImage.src = imageLinks[0];
}

addImages();

function imgClick(src) {
    mainImage.src = src;
}

let dragStarted = false;

let prevX = 0;
let prevScrollLeft = 0;

const dragStart = (e) => {
    dragStarted = true;
    prevX = e.pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if (!dragStarted) return;
    e.preventDefault();
    let positionDiff = e.pageX - prevX;
    carousel.scrollLeft = (prevScrollLeft - positionDiff);
}

const dragEnd = (e) => {
    dragStarted = false;
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragEnd);