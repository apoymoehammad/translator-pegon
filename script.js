/* =====================================
   FIREBASE CONFIG
===================================== */

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
getAuth,
GoogleAuthProvider,
signInWithPopup,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

/* FIREBASE ANDA */

const firebaseConfig = {
apiKey: "AIzaSyDLoEvqKrk-Sc9ZZPAJJdsNYj3OixgyV5g",
authDomain: "translator-pegon.firebaseapp.com",
projectId: "translator-pegon",
storageBucket: "translator-pegon.firebasestorage.app",
messagingSenderId: "458907755163",
appId: "1:458907755163:web:9f18940d3d9df7a8539c3e",
measurementId: "G-P4LEGT1RET"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* =====================================
   KONFIGURASI
===================================== */

const APP_NAME = "Member VIP";

const WA_ADMIN = "6281328322452";

const VIP_MONTH_PRICE = 25000;
const VIP_YEAR_PRICE = 300000;

const MAX_FREE_WORDS = 200;

/* =====================================
   ELEMENT
===================================== */

const loginPage =
document.getElementById("loginPage");

const appPage =
document.getElementById("appPage");

const googleLoginBtn =
document.getElementById("googleLoginBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const userName =
document.getElementById("userName");

const userPhoto =
document.getElementById("userPhoto");

const memberBadge =
document.getElementById("memberBadge");

const inputLatin =
document.getElementById("inputLatin");

const outputPegon =
document.getElementById("outputPegon");

const wordCount =
document.getElementById("wordCount");

const clearBtn =
document.getElementById("clearBtn");

const copyBtn =
document.getElementById("copyBtn");

const vipModal =
document.getElementById("vipModal");

const closeModal =
document.getElementById("closeModal");

const vipBulanan =
document.getElementById("vipBulanan");

const vipTahunan =
document.getElementById("vipTahunan");

/* =====================================
   STATUS VIP
===================================== */

let isVip = false;

if(localStorage.getItem("vip") === "true"){
isVip = true;
}

/* =====================================
   LOGIN GOOGLE
===================================== */

googleLoginBtn.addEventListener(
"click",
async()=>{

try{

const result =
await signInWithPopup(
auth,
provider
);

const user =
result.user;

console.log(user);

}
catch(error){

alert(error.message);

}

}
);

/* =====================================
   AUTO LOGIN
===================================== */

onAuthStateChanged(
auth,
(user)=>{

if(user){

loginPage.style.display =
"none";

appPage.style.display =
"block";

userName.innerText =
user.displayName;

userPhoto.src =
user.photoURL;

}
else{

loginPage.style.display =
"flex";

appPage.style.display =
"none";

}

}
);

/* =====================================
   LOGOUT
===================================== */

logoutBtn.addEventListener(
"click",
async()=>{

await signOut(auth);

location.reload();

}
);

/* =====================================
   HITUNG KATA
===================================== */

function countWords(text){

return text
.trim()
.split(/\s+/)
.filter(Boolean)
.length;

}

/* =====================================
   KONSONAN PEGON
===================================== */

const konsonan = {

"ng":"ڠ",
"ny":"ڽ",
"kh":"خ",
"sy":"ش",

"b":"ب",
"c":"چ",
"d":"د",
"f":"ف",
"g":"ڮ",
"h":"ه",
"j":"ج",
"k":"ك",
"l":"ل",
"m":"م",
"n":"ن",
"p":"ڤ",
"q":"ق",
"r":"ر",
"s":"س",
"t":"ت",
"v":"ۏ",
"w":"و",
"x":"كس",
"y":"ي",
"z":"ز"

};

/* =====================================
   HARAKAT
===================================== */

function harakat(v){

switch(v){

case "a":
return "َ";

case "i":
return "ِ";

case "u":
return "ُ";

case "e":
return "ِ";

case "o":
return "ُ";

default:
return "";

}

}

/* =====================================
   TRANSLITERASI KATA
===================================== */

function transliterasiKata(kata){

kata = kata.toLowerCase();

let hasil = "";
let i = 0;

while(i < kata.length){

if(
i === 0 &&
"aiueo".includes(kata[i])
){

const awal = {

a:"ا",
i:"اِ",
u:"اُ",
e:"اِ",
o:"اُ"

};

hasil += awal[kata[i]];
i++;
continue;

}

let kons = null;

if(kata.substring(i,i+2)==="ng"){
kons="ng";
i+=2;
}
else if(kata.substring(i,i+2)==="ny"){
kons="ny";
i+=2;
}
else if(kata.substring(i,i+2)==="kh"){
kons="kh";
i+=2;
}
else if(kata.substring(i,i+2)==="sy"){
kons="sy";
i+=2;
}
else if(konsonan[kata[i]]){
kons=kata[i];
i++;
}

if(kons){

let huruf =
konsonan[kons];

if(
i < kata.length &&
"aiueo".includes(kata[i])
){

const v =
kata[i];

hasil +=
huruf +
harakat(v);

i++;

}else{

hasil +=
huruf +
"ْ";

}

}else{

hasil += kata[i];
i++;

}

}

return hasil;

}

/* =====================================
   TRANSLITERASI TEKS
===================================== */

function transliterasiTeks(teks){

return teks
.split(/(\s+)/)
.map(item=>{

if(/^\s+$/.test(item))
return item;

return transliterasiKata(item);

})
.join("");

}

/* =====================================
   INPUT
===================================== */

inputLatin.addEventListener(
"input",
()=>{

const totalWords =
countWords(
inputLatin.value
);

wordCount.innerText =
totalWords;

if(
!isVip &&
totalWords > MAX_FREE_WORDS
){

vipModal.style.display =
"flex";

inputLatin.value =
inputLatin.value
.split(/\s+/)
.slice(0,MAX_FREE_WORDS)
.join(" ");

return;

}

outputPegon.value =
transliterasiTeks(
inputLatin.value
);

}
);

/* =====================================
   COPY
===================================== */

copyBtn.addEventListener(
"click",
async()=>{

if(
!outputPegon.value.trim()
) return;

await navigator
.clipboard
.writeText(
outputPegon.value
);

const old =
copyBtn.innerText;

copyBtn.innerText =
"Tersalin ✓";

setTimeout(()=>{

copyBtn.innerText =
old;

},2000);

}
);

/* =====================================
   CLEAR
===================================== */

clearBtn.addEventListener(
"click",
()=>{

inputLatin.value="";
outputPegon.value="";
wordCount.innerText="0";

}
);

/* =====================================
   CLOSE MODAL
===================================== */

closeModal.addEventListener(
"click",
()=>{

vipModal.style.display =
"none";

}
);

/* =====================================
   VIP BULANAN
===================================== */

vipBulanan.addEventListener(
"click",
()=>{

const pesan =

`Halo Admin ${APP_NAME}

Saya ingin upgrade VIP 1 Bulan

Harga:
Rp${VIP_MONTH_PRICE}

Nama:
${userName.innerText}`;

window.open(
`https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(pesan)}`,
"_blank"
);

}
);

/* =====================================
   VIP TAHUNAN
===================================== */

vipTahunan.addEventListener(
"click",
()=>{

const pesan =

`Halo Admin ${APP_NAME}

Saya ingin upgrade VIP 1 Tahun

Harga:
Rp${VIP_YEAR_PRICE}

Nama:
${userName.innerText}`;

window.open(
`https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(pesan)}`,
"_blank"
);

}
);

/* =====================================
   TEST VIP
   HAPUS NANTI
===================================== */

window.aktifkanVip = ()=>{

localStorage.setItem(
"vip",
"true"
);

alert(
"VIP Aktif"
);

location.reload();

};

window.nonaktifkanVip = ()=>{

localStorage.setItem(
"vip",
"false"
);

alert(
"VIP Nonaktif"
);

location.reload();

};