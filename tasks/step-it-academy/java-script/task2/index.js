var modal = document.getElementById("modal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const length = 4;
const cardCount = length ** 2;
const game = document.getElementById("game");

const images = [
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f927_jef7n1",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f929_sbb4tc",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f928_gsepmq",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926-200d-2642-fe0f_k6aguu",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926-200d-2640-fe0f_zbgzwy",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926-1f3ff_j0vsoi",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926-1f3fc_rmmgpg",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926-1f3fd_imazgp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926-1f3fe_klx7z7",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926_igemrs",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f926-1f3fb_vkdqsh",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f925_krmwda",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f923_hdj9ip",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f924_wvbkca",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f922_gt12fl",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f920_uryj6w",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f921_hvbemt",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f919-1f3ff_yjun79",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f919-1f3fe_n5dpt9",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f919-1f3fc_i9bs65",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f919-1f3fd_taagtg",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f919-1f3fb_pjbbh0",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f919_hdagbx",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f918-1f3ff_zd15p6",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f918-1f3fe_mz8jna",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f918-1f3fd_lgvllp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f918-1f3fc_wfyxrb",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f918-1f3fb_vm3ykd",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f918_v0n0j0",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f917_im5i8x",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f916_zyacat",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f915_rczhsc",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f913_p535gk",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f914_robqbd",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f912_qnlfov",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f697_xr2rxj",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f911_mqjxwp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f910_giq9xj",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f698_eetiym",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f699_dblgf3",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f696_lwreaj",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f695_z81sjk",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f692_ocauol",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f694_abunjo",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f693_dhr5op",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f691_bxownp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f690_ycnmkr",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f687_p7hfti",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f688_uwj6us",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f689_jjf9zl",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f685_wzx5jf",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f686_k0naaz",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f683_xny4jd",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f684_tz0jzd",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f682_uw1jpo",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f681_fwlt2f",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f649_pmoalf",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f680_ozberh",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f648_sytl72",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f647-200d-2640-fe0f_hkckjt",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f647-1f3fd_iw7ygj",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f647-1f3fe_iqq9yb",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f647-1f3ff_r7xklh",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f647-1f3fc_rnxu3c",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f647-1f3fb_fsuaqp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f647_apyzs8",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f646-200d-2642-fe0f_cx8qj0",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f646-1f3ff_jq5nm6",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f646-1f3fe_ipqpoz",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f646-1f3fd_fxfljz",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f646-1f3fc_ozdfzv",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f646_klmpzh",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f646-1f3fb_v0nf6f",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f645-200d-2642-fe0f_ckm1fa",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f645-1f3fe_ed4rys",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f645-1f3ff_tn1hvn",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f645-1f3fc_m6vztm",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f645-1f3fd_ksvc7t",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f645-1f3fb_caxlgn",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f645_qvnowb",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f644_z7ttfx",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f643_xqoxpi",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f641_eupbur",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f642_bj7h5f",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f640_nvqlma",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f639_zzu7w8",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f638_weyhvu",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f635_ell8pj",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f637_u77e64",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f634_ypv9ov",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f633_dnr22d",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f631_jicmpm",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f632_qeuba2",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f630_zz7qj0",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f627_rkhqpp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f629_bar6is",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f626_ss9d6a",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f624_vt5uvg",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f625_iy45y1",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f620_ekjxke",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f623_mxczgz",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f622_hzyi3e",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f621_r49ht3",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f619_e0d0ww",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f617_azc7vr",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f616_ngf5zd",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f615_dybu7l",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f614_lxoj0v",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f610_ojfl87",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f613_pwfwah",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f612_im6ami",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f611_f4fhsd",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f609_fsrifp",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f607_wxd8qz",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f605_wvjs6r",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f606_h8xtsq",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f604_n92euo",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f603_nkmhyl",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f601_m3ouka",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f600_sr0863",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f596-1f3ff_ihu0cn",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f596-1f3fe_t5zfkt",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f596-1f3fd_fdqa1d",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f596-1f3fc_mfaj1b",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f596-1f3fb_oglomh",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f596_j70800",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f590-1f3fe_swjsx6",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f590-fe0f_r0awya",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f590-1f3ff_vjmy3l",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f590-1f3fd_tsc6dv",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f590-1f3fc_qv78fy",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f587-fe0f_l10ovg",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f579-fe0f_ft8v7g",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f590-1f3fb_pduwoc",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f578-fe0f_ldnpvc",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f577-fe0f_o4udov",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f575-1f3ff_unymcm",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f575-fe0f-200d-2640-fe0f_nxotek",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f575-fe0f_nwiuft",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f576-fe0f_f38mex",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f575-1f3fd_om5q36",
    "https://res.cloudinary.com/dbriqxpaa/image/upload/v1/java-script/task2/emojis/1f575-1f3fe_smp616"
];

var flip = new Audio("flip.mp3");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getImages() {
    let result = [];
    let i = 0;
    let ic = cardCount / 2;
    while (i < ic) {
        var index = Math.floor(Math.random() * images.length);
        var element = images[index];
        if (result.indexOf(element) === -1) {
            result.push(element);
            result.push(element);
            i++;
        }
    }
    return shuffleArray(result);
}

function addCards() {
    let imgs = getImages();
    for (let i = 0; i < cardCount; i++) {
        let content = `
        <section id='${i + 1}' class="flip-card animate__animated">
            <section class="flip-card-inner">
                <section class="flip-card-front">
                </section>
                <section class="flip-card-back">
                    <img src="${imgs[i]}"
                    alt="Image">
                 </section>
            </section>
        </section>
        `;
        game.innerHTML += content;
    }
}

var flippedCards = [];
let lastId = 0;
let remainingCards = cardCount;

function flipCard() {
    if (flippedCards.length >= 2 || lastId == this.id) return;
    lastId = this.id;
    const flipCardInner = this.querySelector('.flip-card-inner');
    flipCardInner.style.transform = 'rotateY(180deg)';
    flip.play();
    flippedCards.push(this);

    if (flippedCards.length == 2) {
        // check similarity between flipped cards
        let img1 = flippedCards[0].querySelector(".flip-card-back img");
        let img2 = flippedCards[1].querySelector(".flip-card-back img");

        if (img1.src === img2.src) {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.classList.add("animate__bounceOutLeft");
                    card.display = 'none';
                    flippedCards = [];
                });
                remainingCards -= 2;
                if (remainingCards === 0) {
                    modal.style.display = "block";
                }
            }, 300);

            console.log(remainingCards);

        }
        else {
            // flip back
            setTimeout(() => {
                flippedCards.forEach(card => {
                    const inner = card.querySelector('.flip-card-inner');
                    inner.style.transform = 'none';
                });
                flippedCards = [];
            }, 1100);
        }
    }
}

function addClickToCards() {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
}

function startGame() {
    game.innerHTML = '';
    modal.style.display = "none";
    flippedCards = [];
    lastId = 0;
    remainingCards = cardCount;
    addCards();
    addClickToCards();
}

startGame();

