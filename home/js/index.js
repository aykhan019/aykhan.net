window.scrollTo(0, 0);

var isJavid = false;

function calculateAge() {

  var birthday = new Date("2006-02-23");
  if (isJavid) {
    birthday = new Date("2008-04-27");
  }
  var today = new Date();
  var age = today.getFullYear() - birthday.getFullYear();
  var monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

window.onload = function () {
  var ageElement = document.getElementById("age");
  var age = calculateAge();
  ageElement.innerText = age;

  var paragraph = document.getElementById("about-me-paragraph");
  var image = document.getElementById("about-me-image");

  function setImageHeight() {
    if (window.innerWidth <= 948) {
      image.style.height = "auto";
      return;
    }
    else {

      var paragraphHeight = paragraph.offsetHeight;

      if (paragraphHeight === 602) {
        paragraphHeight = 655;
      }

      image.style.height = paragraphHeight + 5 + "px";
    }
  }

  function handleResize() {
    setImageHeight();
  }

  setImageHeight();
  window.addEventListener('resize', handleResize);
};


// ========== 1 ==========

// const colors = [
//     { name: "Electric Blue", hex: "#00FFFF" },
//     { name: "Lavender", hex: "#E6E6FA" },
//     { name: "Emerald Green", hex: "#50C878" },
//     { name: "Coral Pink", hex: "#FF7F50" },
//     { name: "Goldenrod", hex: "#DAA520" },
//     { name: "Periwinkle", hex: "#CCCCFF" },
//     { name: "Ruby Red", hex: "#E0115F" },
//     { name: "Sunflower Yellow", hex: "#FFC512" },
//     { name: "Teal Blue", hex: "#008080" },
//     { name: "Lilac", hex: "#C8A2C8" }
// ];

// const randomIndex = Math.floor(Math.random() * colors.length);
// const randomColorHex = colors[randomIndex].hex;
// document.documentElement.style.setProperty('--first-color', randomColorHex);

// ========== 2 ==========


// const palettes = [
//     // Palette 1: Harmony Palette
//     ["#586994", "#C8A2C8", "#F3F3F3", "#FFC512", "#50C878", "#FF7F50", "#008080"],

//     // Palette 2: Pastel Delight Palette
//     ["#E6E6FA", "#F8D0FF", "#F3F3F3", "#FFDDC1", "#B2E9E5", "#FFC5D9", "#F8FFBF"],

//     // Palette 3: Earthy Tones Palette
//     ["#B58863", "#665C54", "#FFF5E1", "#968F82", "#856B65", "#9C8877", "#D9D2B6"],

//     // Palette 4: Ocean Breeze Palette
//     ["#5A87B6", "#B5D7E7", "#F3F3F3", "#8AC6D1", "#D4E4F1", "#97BBCD", "#D0E0EB"],

//     // Palette 5: Vibrant Accents Palette
//     ["#FF7F50", "#FFC512", "#FFD700", "#FF69B4", "#00FFFF", "#7FFF00", "#FF4500"],

//     // Palette 6: Muted Elegance Palette
//     ["#C8A2C8", "#DAA520", "#F3F3F3", "#A2B5CD", "#AEC6CF", "#B5AFAF", "#E6C8C8"],

//     // Palette 7: Fresh Citrus Palette
//     ["#FFC512", "#50C878", "#F3F3F3", "#FF7F50", "#008080", "#CCCCFF", "#DAA520"],

//     // Palette 8: Vintage Romance Palette
//     ["#E6E6FA", "#FFC0CB", "#F3F3F3", "#E0115F", "#DAA520", "#C8A2C8", "#FF7F50"],

//     // Palette 9: Serene Meadows Palette
//     ["#98FB98", "#F0FFF0", "#F3F3F3", "#FFB6C1", "#B0C4DE", "#FFDAB9", "#FFDEAD"]
//     // Add more palettes here if needed
// ];

// // Get a random palette index within the range of the 'palettes' array
// const randomPaletteIndex = Math.floor(Math.random() * palettes.length);

// // Get the randomly selected palette
// const randomPalette = palettes[randomPaletteIndex];

// // Assign colors from the palette to the CSS variables
// document.documentElement.style.setProperty('--first-color', randomPalette[0]);
// document.documentElement.style.setProperty('--second-color', randomPalette[1]);
// document.documentElement.style.setProperty('--third-color', randomPalette[2]);
// document.documentElement.style.setProperty('--fourth-color', randomPalette[3]);
// document.documentElement.style.setProperty('--fifth-color', randomPalette[4]);
// document.documentElement.style.setProperty('--sixth-color', randomPalette[5]);
// document.documentElement.style.setProperty('--seventh-color', randomPalette[6]);

