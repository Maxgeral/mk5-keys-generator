// 🔗 CONFIG SUPABASE
const SUPABASE_URL = "https://evfeoqgjzujscxryhtvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZmVvcWdqenVqc2N4cnlodHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTA5MTIsImV4cCI6MjA4NzgyNjkxMn0.4ZJYTiv4RfYNpLTwxSYMuk2MRFLsITU5SmU9ocvidZ8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 📌 ELEMENTOS
const generateBtn = document.getElementById("generateKeyBtn");
const keyInput = document.getElementById("generatedKey");
const statusText = document.getElementById("status");
const copyBtn = document.getElementById("copyKeyBtn");

// 🧠 GERAR ID DE CONVIDADO
function getGuestId(){
  let guestId = localStorage.getItem("mk5_guest_id");
  if(!guestId){
    guestId = "guest_" + Math.random().toString(36).substring(2,10);
    localStorage.setItem("mk5_guest_id", guestId);
  }
  return guestId;
}

// 🔑 GERAR KEY ALEATÓRIA
function generateRandomKey(){
  return "MK5-" + Math.random().toString(36).substring(2,8).toUpperCase() + "-" + Date.now().toString().slice(-4);
}

// ⏳ VERIFICAR STATUS
async function checkStatus(){
  const { data: { user } } = await supabaseClient.auth.getUser();

  if(user){
    statusText.innerText = "Status: Logado 👤";
  }else{
    statusText.innerText = "Status: Convidado 🎮";
  }
}

// 🔐 GERAR KEY
generateBtn?.addEventListener("click", async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();

  let expiresMinutes = user ? 720 : 15; // 12h = 720min | guest = 15min
  let expiresAt = new Date(Date.now() + expiresMinutes * 60000).toISOString();
  let keyValue = generateRandomKey();

  if(user){
    // VERIFICAR COOLDOWN LOGADO
    const { data: existing } = await supabaseClient
      .from("keys_mk5")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if(existing && existing.length > 0){
      let last = new Date(existing[0].created_at);
      let diffHours = (Date.now() - last.getTime()) / (1000*60*60);

      if(diffHours < 12){
        alert("⏳ Espere 12 horas para gerar outra key.");
        return;
      }
    }

    await supabaseClient.from("keys_mk5").insert({
      user_id: user.id,
      key_value: keyValue,
      expires_at: expiresAt
    });

  } else {
    // CONVIDADO
    const guestId = getGuestId();

    const { data: existing } = await supabaseClient
      .from("keys_mk5")
      .select("*")
      .eq("guest_id", guestId)
      .limit(1);

    if(existing && existing.length > 0){
      alert("⚠️ Convidado só pode gerar 1 key!");
      return;
    }

    await supabaseClient.from("keys_mk5").insert({
      guest_id: guestId,
      key_value: keyValue,
      expires_at: expiresAt
    });
  }

  keyInput.value = keyValue;
  alert("✅ Key gerada com sucesso!");
});

// 📋 COPIAR KEY
copyBtn?.addEventListener("click", () => {
  if(!keyInput.value) return alert("Nenhuma key para copiar!");
  navigator.clipboard.writeText(keyInput.value);
  alert("📋 Key copiada!");
});

// 🚀 INICIAR
checkStatus();