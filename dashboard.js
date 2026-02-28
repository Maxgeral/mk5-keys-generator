const SUPABASE_URL = "https://evfeoqgjzujscxryhtvm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZmVvcWdqenVqc2N4cnlodHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTA5MTIsImV4cCI6MjA4NzgyNjkxMn0.4ZJYTiv4RfYNpLTwxSYMuk2MRFLsITU5SmU9ocvidZ8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const titleInput = document.getElementById("linkTitle");
const urlInput = document.getElementById("linkURL");
const addBtn = document.getElementById("addLinkBtn");
const listDiv = document.getElementById("linksList");

// ➕ ADICIONAR LINK
addBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if(!title || !url){
    alert("Preencha todos os campos!");
    return;
  }

  await supabaseClient.from("links_mk5").insert({
    title: title,
    url: url
  });

  titleInput.value = "";
  urlInput.value = "";
  loadLinks();
});

// 📂 CARREGAR LINKS
async function loadLinks(){
  const { data } = await supabaseClient
    .from("links_mk5")
    .select("*")
    .order("created_at", { ascending: false });

  listDiv.innerHTML = "";

  data.forEach(link => {
    const div = document.createElement("div");
    div.style.marginTop = "10px";
    div.style.padding = "10px";
    div.style.border = "1px solid cyan";
    div.style.borderRadius = "8px";

    div.innerHTML = `
      <strong>${link.title}</strong><br>
      <small>${link.url}</small><br>
      <button onclick="deleteLink('${link.id}')" style="margin-top:5px;">🗑 Remover</button>
    `;

    listDiv.appendChild(div);
  });
}

// 🗑 REMOVER LINK
async function deleteLink(id){
  await supabaseClient.from("links_mk5").delete().eq("id", id);
  loadLinks();
}

// 🚀 INICIAR
loadLinks();