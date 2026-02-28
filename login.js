const SUPABASE_URL = "https://evfeoqgjzujscxryhtvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZmVvcWdqenVqc2N4cnlodHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTA5MTIsImV4cCI6MjA4NzgyNjkxMn0.4ZJYTiv4RfYNpLTwxSYMuk2MRFLsITU5SmU9ocvidZ8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const statusText = document.getElementById("loginStatus");

// 🔐 LOGIN
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if(error){
    statusText.innerText = "❌ Erro ao entrar";
  }else{
    statusText.innerText = "✅ Logado com sucesso!";
  }
});

// 📝 CADASTRO
registerBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if(error){
    statusText.innerText = "❌ Erro ao cadastrar";
  }else{
    statusText.innerText = "📧 Conta criada! Verifique seu email.";
  }
});

// 🚪 LOGOUT
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  statusText.innerText = "🚪 Deslogado!";
});