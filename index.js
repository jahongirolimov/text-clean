const matn = document.getElementById("matn");
const royxat = document.getElementById("belgilarRoyxati");
const KALIT = "textCleaner.belgilar";

const GURUHLAR = [
  { id: "nuqta", nom: ".", belgilar: ".", yoqilgan: true },
  { id: "vergul", nom: ",", belgilar: ",", yoqilgan: true },
  { id: "undov", nom: "!", belgilar: "!", yoqilgan: true },
  { id: "soroq", nom: " ?", belgilar: "?", yoqilgan: true },
  {
    id: "nuqtaliVergul",
    nom: ";",
    belgilar: ";",
    yoqilgan: true,
  },
  { id: "ikkiNuqta", nom: ":", belgilar: ":", yoqilgan: true },
  {
    id: "chiziq",
    nom: "- – —",
    belgilar: "-\u2013\u2014",
    yoqilgan: true,
  },
  {
    id: "qavs",
    nom: "( ) [ ] { }",
    belgilar: "()[]{}",
    yoqilgan: true,
  },
  {
    id: "qoshtirnoq",
    nom: ' " «» “ ” ',
    belgilar: '"\u00AB\u00BB\u201C\u201D\u201E',
    yoqilgan: true,
  },
  {
    id: "koNuqta",
    nom: " … ",
    belgilar: "\u2026",
    yoqilgan: true,
  },
  {
    id: "boshqa",
    nom: "/ \\ @ # $ % & * _ + = < > | ~ ",
    belgilar: "/\\@#$%^&*_+=<>|~",
    yoqilgan: true,
  },
  {
    id: "tutuq",
    nom: " ' ʼ ʻ ’",
    belgilar: "'\u02BB\u02BC\u2019\u2018`",
    yoqilgan: false,
    almashtirish: "",
  },
];

function tozaBoshliqlar(t) {
  return t
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function hammasiniTozalash(text) {
  const t = text
    .normalize("NFC")
    .replace(/['\u02BB\u02BC\u2019\u2018`]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ");
  return tozaBoshliqlar(t);
}

function belgilarniOchirish(text, idlar) {
  let t = text.normalize("NFC");
  GURUHLAR.filter(function (g) {
    return idlar.includes(g.id);
  }).forEach(function (g) {
    const sinf = g.belgilar.replace(/[\\\]\[^-]/g, "\\$&");
    t = t.replace(new RegExp("[" + sinf + "]", "gu"), g.almashtirish ?? " ");
  });
  return tozaBoshliqlar(t);
}

function qoldaYozgandek(el, yangiMatn) {
  if (el.value === yangiMatn) return;
  el.focus();
  el.select();
  const ok = document.execCommand("insertText", false, yangiMatn);
  if (!ok || el.value !== yangiMatn) {
    el.value = yangiMatn;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function harfniQoldaAlmashtirish(el, indeks, yangiHarf) {
  el.setSelectionRange(indeks + 1, indeks + 1);
  document.execCommand("delete");
  document.execCommand("insertText", false, yangiHarf);
}

function abzasBoshiniKattaQilish(el) {
  const asl = el.value;
  const joylar = [];
  const re = /(^|\n)([ \t]*)(\p{Ll})/gu;
  let m;
  while ((m = re.exec(asl)) !== null) {
    const katta = m[3].toUpperCase();
    if (m[3].length === 1 && katta.length === 1) {
      joylar.push({
        indeks: m.index + m[1].length + m[2].length,
        katta: katta,
      });
    }
  }
  if (joylar.length === 0) return;

  const kutilgan = asl.replace(
    /(^|\n)([ \t]*)(\p{Ll})/gu,
    function (x, a, b, c) {
      const k = c.toUpperCase();
      return a + b + (c.length === 1 && k.length === 1 ? k : c);
    },
  );

  const bosh = el.selectionStart;
  const oxir = el.selectionEnd;
  el.focus();
  joylar.forEach(function (j) {
    harfniQoldaAlmashtirish(el, j.indeks, j.katta);
  });

  if (el.value !== kutilgan) {
    el.value = kutilgan;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
  el.setSelectionRange(bosh, oxir);
}

function saqlanganlar() {
  try {
    const s = JSON.parse(localStorage.getItem(KALIT));
    if (Array.isArray(s)) return s;
  } catch (e) {}
  return GURUHLAR.filter(function (g) {
    return g.yoqilgan;
  }).map(function (g) {
    return g.id;
  });
}

function tanlanganIdlar() {
  return Array.from(royxat.querySelectorAll(".chip[aria-pressed='true']")).map(
    function (b) {
      return b.dataset.id;
    },
  );
}

function saqla() {
  try {
    localStorage.setItem(KALIT, JSON.stringify(tanlanganIdlar()));
  } catch (e) {}
}

function chizish() {
  const tanlangan = saqlanganlar();
  royxat.innerHTML = "";
  GURUHLAR.forEach(function (g) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.id = g.id;
    b.textContent = g.nom;
    b.setAttribute("aria-pressed", tanlangan.includes(g.id) ? "true" : "false");
    b.addEventListener("click", function () {
      const yoqilgan = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", yoqilgan ? "true" : "false");
      saqla();
    });
    royxat.appendChild(b);
  });
}

function hammasiniBelgilash(holat) {
  royxat.querySelectorAll(".chip").forEach(function (b) {
    b.setAttribute("aria-pressed", holat ? "true" : "false");
  });
  saqla();
}

document.getElementById("tozalash").addEventListener("click", function () {
  qoldaYozgandek(matn, hammasiniTozalash(matn.value));
  abzasBoshiniKattaQilish(matn);
});

document.getElementById("tanlangan").addEventListener("click", function () {
  qoldaYozgandek(matn, belgilarniOchirish(matn.value, tanlanganIdlar()));
});

document.getElementById("hammasi").addEventListener("click", function () {
  hammasiniBelgilash(true);
});

document.getElementById("hechbiri").addEventListener("click", function () {
  hammasiniBelgilash(false);
});

document.getElementById("nusxa").addEventListener("click", function () {
  navigator.clipboard.writeText(matn.value);
});

document.getElementById("ochirish").addEventListener("click", function () {
  matn.value = "";
});

chizish();
