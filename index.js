const matn = document.getElementById("matn");
const tugma = document.getElementById("tozalash");

document.getElementById("tozalash").addEventListener("click", function () {
  matn.value = matn.value
    .replace(/[^\p{L}\p{N}\s]/gu, "") // tinish belgilarni o'chiradi
    .replace(/[ \t]+/g, " ") // ko'p bo'shliqni bittaga aylantiradi (qatorlarga tegmaydi)
    .replace(/ *\n */g, "\n") // qator boshi va oxiridagi ortiqcha bo'shliqni olib tashlaydi
    .trim(); // matnning boshi va oxiridagi bo'shliqni olib tashlaydi
});

document.getElementById("nusxa").addEventListener("click", function () {
  navigator.clipboard.writeText(matn.value);
});

document.getElementById("ochirish").addEventListener("click", function () {
  matn.value = "";
});