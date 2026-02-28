const SUPABASE_URL = "https://evfeoqgjzujscxryhtvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZmVvcWdqenVqc2N4cnlodHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTA5MTIsImV4cCI6MjA4NzgyNjkxMn0.4ZJYTiv4RfYNpLTwxSYMuk2MRFLsITU5SmU9ocvidZ8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const validateBtn = document.getElementById("validateBtn");
const keyInput = document.getElementById("keyToValidate");
const resultBox = document.getElementById("resultBox");

validateBtn.addEventListener("click", async () => {
  const key = keyInput.value.trim();

  if(!key){
    alert("Digite uma key!");
    return;
  }

  const { data, error } = await supabaseClient
    .from("keys_mk5")
    .select("*")
    .eq("key_value", key)
    .single();

  if(error || !data){
    resultBox.innerHTML = `<p style="color:red;">❌ Key inválida</p>`;
    return;
  }

  const now = new Date();
  const expires = new Date(data.expires_at);

  if(now > expires){
    resultBox.innerHTML = `<p style="color:orange;">⏳ Key expirada</p>`;
    return;
  }

  // BUSCAR LINKS DISPONÍVEIS
  const { data: links } = await supabaseClient
    .from("links_mk5")
    .select("*");

  if(!links || links.length === 0){
    resultBox.innerHTML = `<p style="color:yellow;">Nenhum link disponível</p>`;
    return;
  }

  // Escolhe um link aleatório
  const randomLink = links[Math.floor(Math.random() * links.length)];

  resultBox.innerHTML = `
    <p style="color:lime;">✅ Key válida!</p>
    <a href="${randomLink.url}" target="_blank" class="link-btn" style="margin-top:15px;">
      🔓 Acessar Conteúdo
    </a>
  `;
});