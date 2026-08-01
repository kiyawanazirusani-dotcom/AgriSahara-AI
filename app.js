/* AgriSahara AI — client-side logic
   Talks directly to the Google Gemini API (generativelanguage.googleapis.com)
   using an API key the farmer supplies and stores locally on their device.
   No backend server is used — this satisfies "AI live in production" by
   making real, live model calls from the deployed page itself.
*/

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;

/* ---------- i18n ---------- */
const STRINGS = {
  ha: {
    eyebrow: "GEMINI-POWERED FARM DIAGNOSTICS",
    heroTitle: "Ka duba ganyen shukarka,<br>mu gaya maka lafiyarta.",
    heroSub: "Ɗauki hoton ganyen amfaninka — masara, gero, wake, dawa — Gemini AI za ta gaya maka cutar, dalilinta, da yadda za ka warware ta, cikin Hausa ko Turanci.",
    ctaScan: "Fara Bincike →",
    ctaChat: "Yi Tambaya ga AI",
    qaTalkLabel: "Yi Magana",
    qaScanLabel: "Ɗauki Hoton Ganye",
    qaListenOn: "Sauraro: A KUNNE",
    qaListenOff: "Sauraro: A KASHE",
    scanTitle: "Binciken Ganye",
    scanSub: "Ɗauki hoto ko zaɓi hoton ganye daga wayarka.",
    uploadHint: "Danna don ɗaukar hoto",
    chooseBtn: "Zaɓi Hoto",
    analyzeBtn: "Nazarta Ganye",
    analyzeBtnBusy: "Ana Nazari…",
    chatTitle: "Tambayi Mataimaki",
    chatSub: "Yi tambaya kai tsaye game da shuka, ƙasa, ruwan sama, ko kula da gona.",
    chatGreeting: "Sannu! Ni mataimakin AgriSahara ne. Ka tambaye ni kome game da gonarka — misali: \"Yaushe ne lokacin shuka gero a Jigawa?\"",
    chatPlaceholder: "Rubuta tambayarka anan…",
    sendBtn: "Aika",
    footerNote: "AgriSahara AI · Gina don Build with Gemini XPRIZE · Ana amfani da Google Gemini API kai tsaye a wannan na'urar.",
    keyTitle: "Saka Gemini API Key",
    keyBody: "AgriSahara AI tana amfani da Google Gemini kai tsaye daga wayarka — babu server. Saka API key ɗinka (kyauta ne daga aistudio.google.com/apikey). Za a adana shi a wayarka kaɗai.",
    keyGet: "Sami Key",
    keySave: "Ajiye",
    statusHealthy: "GANYEN LAFIYA",
    statusDisease: "AN GANO ALAMU",
    statusUnsure: "BA A TABBATA BA",
    errNoKey: "Da fatan za a saka Gemini API key tukuna.",
    errGeneric: "Wani kuskure ya faru. A sake gwadawa.",
    micRecording: "🔴 Ana rikodi… danna maballin murya sake don tsayarwa",
    micProcessing: "Ana sarrafa muryarka…",
    micDenied: "Ba a samu izinin amfani da makirufo ba.",
  },
  en: {
    eyebrow: "GEMINI-POWERED FARM DIAGNOSTICS",
    heroTitle: "Photograph your crop's leaf,<br>we'll tell you what it needs.",
    heroSub: "Take a photo of any crop leaf — maize, millet, cowpea, sorghum — and Gemini AI will identify disease, explain the cause, and suggest treatment, in Hausa or English.",
    ctaScan: "Start Scan →",
    ctaChat: "Ask the AI",
    qaTalkLabel: "Talk",
    qaScanLabel: "Upload Crop Photo",
    qaListenOn: "Listen: ON",
    qaListenOff: "Listen: OFF",
    scanTitle: "Leaf Scanner",
    scanSub: "Take a photo or choose one from your phone.",
    uploadHint: "Tap to add a photo",
    chooseBtn: "Choose Photo",
    analyzeBtn: "Analyze Leaf",
    analyzeBtnBusy: "Analyzing…",
    chatTitle: "Ask the Assistant",
    chatSub: "Ask anything about your crop, soil, rainfall, or farm care.",
    chatGreeting: "Hi! I'm the AgriSahara assistant. Ask me anything about your farm — for example: \"When should I plant millet in Jigawa?\"",
    chatPlaceholder: "Type your question…",
    sendBtn: "Send",
    footerNote: "AgriSahara AI · Built for the Build with Gemini XPRIZE · Calls the Google Gemini API live from this device.",
    keyTitle: "Add your Gemini API key",
    keyBody: "AgriSahara AI talks to Google Gemini directly from your phone — no server involved. Add your API key (free at aistudio.google.com/apikey). It's stored only on this device.",
    keyGet: "Get a key",
    keySave: "Save",
    statusHealthy: "LEAF LOOKS HEALTHY",
    statusDisease: "SIGNS DETECTED",
    statusUnsure: "NOT CERTAIN",
    errNoKey: "Please add your Gemini API key first.",
    errGeneric: "Something went wrong. Please try again.",
    micRecording: "🔴 Recording… tap the mic again to stop",
    micProcessing: "Processing your voice…",
    micDenied: "Microphone access was not granted.",
  }
};

let currentLang = "ha";

function applyLang(lang){
  currentLang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(STRINGS[lang][key]) el.innerHTML = STRINGS[lang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const key = el.getAttribute("data-i18n-placeholder");
    if(STRINGS[lang][key]) el.setAttribute("placeholder", STRINGS[lang][key]);
  });
  document.querySelectorAll(".lang-btn").forEach(b=>{
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  document.documentElement.lang = lang;
}

document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.addEventListener("click", ()=> applyLang(btn.dataset.lang));
});

/* ---------- nav shortcuts (large quick-action buttons) ---------- */
let autoplayEnabled = true;
const autoplayToggle = document.getElementById("autoplayToggle");
const autoplayLabel = document.getElementById("autoplayLabel");

autoplayToggle.addEventListener("click", ()=>{
  autoplayEnabled = !autoplayEnabled;
  autoplayToggle.setAttribute("aria-pressed", String(autoplayEnabled));
  autoplayLabel.textContent = autoplayEnabled ? STRINGS[currentLang].qaListenOn : STRINGS[currentLang].qaListenOff;
  autoplayLabel.setAttribute("data-i18n", autoplayEnabled ? "qaListenOn" : "qaListenOff");
});

document.getElementById("jumpScan").addEventListener("click", ()=>{
  document.getElementById("scan").scrollIntoView({behavior:"smooth"});
  setTimeout(()=> document.getElementById("fileInput").click(), 450);
});
document.getElementById("jumpChat").addEventListener("click", ()=>{
  document.getElementById("chat").scrollIntoView({behavior:"smooth"});
  setTimeout(()=> document.getElementById("micBtn").click(), 450);
});

/* ---------- API key handling ---------- */
const keyModal = document.getElementById("keyModal");
const apiKeyInput = document.getElementById("apiKeyInput");

function getKey(){ return localStorage.getItem("agrisahara_gemini_key") || ""; }
function setKey(k){ localStorage.setItem("agrisahara_gemini_key", k); }

function ensureKey(){
  if(!getKey()){
    keyModal.hidden = false;
    return false;
  }
  return true;
}

document.getElementById("saveKeyBtn").addEventListener("click", ()=>{
  const val = apiKeyInput.value.trim();
  if(val){ setKey(val); keyModal.hidden = true; }
});

if(!getKey()) keyModal.hidden = false;
else keyModal.hidden = true;

/* ---------- Gemini call helper ---------- */
async function callGemini(parts){
  const key = getKey();
  if(!key) throw new Error("NO_KEY");
  const res = await fetch(GEMINI_URL(key), {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      contents: [{ role: "user", parts }]
    })
  });
  if(!res.ok){
    const errText = await res.text();
    throw new Error("API_ERROR: " + errText);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join("") || "";
  return text;
}

/* ---------- Scanner ---------- */
const fileInput = document.getElementById("fileInput");
const uploadFrame = document.getElementById("uploadFrame");
const previewImg = document.getElementById("previewImg");
const uploadEmpty = document.getElementById("uploadEmpty");
const analyzeBtn = document.getElementById("analyzeBtn");
const scanLine = document.getElementById("scanLine");
const resultCard = document.getElementById("resultCard");
const resultStatus = document.getElementById("resultStatus");
const resultBody = document.getElementById("resultBody");

let currentImageBase64 = null;
let currentImageMime = null;

uploadFrame.addEventListener("click", ()=> fileInput.click());

fileInput.addEventListener("change", ()=>{
  const file = fileInput.files[0];
  if(!file) return;
  currentImageMime = file.type;
  const reader = new FileReader();
  reader.onload = (e)=>{
    previewImg.src = e.target.result;
    previewImg.hidden = false;
    uploadEmpty.hidden = true;
    currentImageBase64 = e.target.result.split(",")[1];
    analyzeBtn.disabled = false;
    resultCard.hidden = true;
  };
  reader.readAsDataURL(file);
});

analyzeBtn.addEventListener("click", async ()=>{
  if(!ensureKey()) return;
  if(!currentImageBase64) return;

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = STRINGS[currentLang].analyzeBtnBusy;
  scanLine.hidden = false;
  resultCard.hidden = true;

  const langInstruction = currentLang === "ha"
    ? "Amsa gaba ɗaya cikin Hausa, sauƙaƙe, don manomi wanda ba masani ba."
    : "Answer entirely in plain English for a farmer, no jargon.";

  const prompt = `You are an agricultural extension expert helping smallholder farmers in the Sahel region of Nigeria (Hausa-speaking areas like Jigawa State). Look at this crop leaf photo carefully.

Respond in this exact structure, nothing extra:
STATUS: one of [HEALTHY, DISEASE, UNSURE]
CROP: your best guess at the crop
FINDING: 1-2 sentences on what you see
CAUSE: likely cause (disease, pest, nutrient deficiency, or none)
ACTION: 2-3 concrete, locally-feasible steps the farmer can take this week

Be honest — if the image is unclear or you're not confident, say STATUS: UNSURE and explain what a clearer photo would need to show. Never invent a diagnosis you are not reasonably confident about.

${langInstruction}`;

  try{
    const text = await callGemini([
      { text: prompt },
      { inline_data: { mime_type: currentImageMime, data: currentImageBase64 } }
    ]);

    const statusMatch = text.match(/STATUS:\s*(HEALTHY|DISEASE|UNSURE)/i);
    const status = statusMatch ? statusMatch[1].toUpperCase() : "UNSURE";

    resultStatus.textContent = status === "HEALTHY" ? STRINGS[currentLang].statusHealthy
      : status === "DISEASE" ? STRINGS[currentLang].statusDisease
      : STRINGS[currentLang].statusUnsure;
    resultStatus.className = "result-status " + (status === "HEALTHY" ? "healthy" : status === "DISEASE" ? "disease" : "unsure");

    resultBody.textContent = text.replace(/STATUS:\s*(HEALTHY|DISEASE|UNSURE)\s*/i, "").trim();
    resultCard.hidden = false;
    if(autoplayEnabled) speak(resultStatus.textContent + ". " + resultBody.textContent);
  }catch(err){
    resultStatus.textContent = "!";
    resultStatus.className = "result-status unsure";
    resultBody.textContent = STRINGS[currentLang].errGeneric + "\n\n" + (err.message || "");
    resultCard.hidden = false;
  }finally{
    scanLine.hidden = true;
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = STRINGS[currentLang].analyzeBtn;
  }
});

/* ---------- Chat ---------- */
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
let chatHistory = [];

function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = currentLang === "ha" ? "ha-NG" : "en-US";
  utter.rate = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(currentLang === "ha" ? "ha" : "en"));
  if(match) utter.voice = match;
  window.speechSynthesis.speak(utter);
}

function addMsg(text, who){
  const div = document.createElement("div");
  div.className = "msg msg-" + who;
  const p = document.createElement("p");
  p.textContent = text;
  div.appendChild(p);
  if(who === "bot"){
    const speakBtn = document.createElement("button");
    speakBtn.type = "button";
    speakBtn.className = "speak-btn";
    speakBtn.setAttribute("aria-label", "Play voice");
    speakBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 8a5 5 0 010 8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
    speakBtn.addEventListener("click", ()=> speak(p.textContent));
    div.appendChild(speakBtn);
    if(autoplayEnabled && text !== "…") speak(text);
  }
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div;
}

/* ---------- Voice input ---------- */
const micBtn = document.getElementById("micBtn");
const micStatus = document.getElementById("micStatus");
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

function pickAudioMime(){
  const candidates = ["audio/ogg;codecs=opus", "audio/ogg", "audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for(const c of candidates){
    if(window.MediaRecorder && MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

micBtn.addEventListener("click", async ()=>{
  if(!ensureKey()) return;

  if(isRecording){
    mediaRecorder.stop();
    return;
  }

  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = pickAudioMime();
    mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e)=> audioChunks.push(e.data);

    mediaRecorder.onstop = async ()=>{
      isRecording = false;
      micBtn.classList.remove("recording");
      stream.getTracks().forEach(t=>t.stop());

      micStatus.hidden = false;
      micStatus.textContent = STRINGS[currentLang].micProcessing;

      const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || "audio/ogg" });
      const reader = new FileReader();
      reader.onload = async ()=>{
        const base64Audio = reader.result.split(",")[1];
        const audioMime = (mediaRecorder.mimeType || "audio/ogg").split(";")[0];

        const langInstruction = currentLang === "ha"
          ? "Amsa gaba ɗaya cikin Hausa mai sauƙi, don manomi a Jigawa, Najeriya."
          : "Answer entirely in plain English for a farmer in Jigawa, Nigeria.";

        const prompt = `This is a spoken farming question from a farmer. First transcribe exactly what they said, then answer their question as the AgriSahara AI farm assistant. ${langInstruction}

Respond in exactly this format:
TRANSCRIPT: <what the farmer said>
ANSWER: <your answer, 2-4 sentences>`;

        try{
          const text = await callGemini([
            { text: prompt },
            { inline_data: { mime_type: audioMime, data: base64Audio } }
          ]);
          const transcriptMatch = text.match(/TRANSCRIPT:\s*([\s\S]*?)\s*ANSWER:/i);
          const answerMatch = text.match(/ANSWER:\s*([\s\S]*)/i);
          const transcript = transcriptMatch ? transcriptMatch[1].trim() : "🎤";
          const answer = answerMatch ? answerMatch[1].trim() : text;

          addMsg(transcript, "user");
          addMsg(answer, "bot");
        }catch(err){
          addMsg(STRINGS[currentLang].errGeneric + " [" + (err.message || err) + "]", "bot");
        }finally{
          micStatus.hidden = true;
        }
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorder.start();
    isRecording = true;
    micBtn.classList.add("recording");
    micStatus.hidden = false;
    micStatus.textContent = STRINGS[currentLang].micRecording;
  }catch(err){
    addMsg(STRINGS[currentLang].micDenied, "bot");
  }
});

chatForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const q = chatInput.value.trim();
  if(!q) return;
  if(!ensureKey()) return;

  addMsg(q, "user");
  chatInput.value = "";
  const typingEl = addMsg("…", "bot");
  typingEl.classList.add("msg-typing");

  const langInstruction = currentLang === "ha"
    ? "Ka amsa cikin Hausa mai sauƙi, taƙaitacce (kalmomi 3-5 jumla), don manomi a Jigawa, Najeriya."
    : "Answer in plain, brief English (3-5 sentences) for a smallholder farmer in Jigawa, Nigeria.";

  try{
    const text = await callGemini([
      { text: `You are the AgriSahara AI farm assistant. ${langInstruction}\n\nFarmer's question: ${q}` }
    ]);
    typingEl.classList.remove("msg-typing");
    typingEl.querySelector("p").textContent = text;
    if(autoplayEnabled) speak(text);
  }catch(err){
    typingEl.classList.remove("msg-typing");
    typingEl.querySelector("p").textContent = STRINGS[currentLang].errGeneric + " [" + (err.message || err) + "]";
  }
});

/* init */
applyLang("ha");
