const matn = document.getElementById("matn");
const tugma = document.getElementById("tozalash");

document.getElementById("tozalash").addEventListener("click", function () {
  matn.value = matn.value
    .replace(/['ʻʼ’‘`]/g, "") // apostrofni o'chiradi (o'zbek → ozbek)
    .replace(/[^\p{L}\p{N}\s'ʻʼ’‘]/gu, " ") // qolgan tinish belgilarni bo'shliqqa almashtiradi
    .replace(/[ \t]+/g, " ") // ko'p bo'shliqni bittaga aylantiradi
    .replace(/ *\n */g, "\n") // qator chetidagi ortiqcha bo'shliqni olib tashlaydi
    .trim(); // matn boshi va oxiridagi bo'shliqni olib tashlaydi
});
document.getElementById("nusxa").addEventListener("click", function () {
  navigator.clipboard.writeText(matn.value);
});

document.getElementById("ochirish").addEventListener("click", function () {
  matn.value = "";
});