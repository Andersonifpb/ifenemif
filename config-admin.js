/* config-admin.js · administrador SEM senha em texto no código.
   1) Abra gerar-hash.html no navegador, digite a senha e copie o resultado.
   2) Cole o resultado em "hash" abaixo. Enquanto estiver vazio, o login de administrador fica bloqueado.
   Atenção: sem servidor isto só impede a leitura da senha no código. A proteção de verdade virá com o back-end. */
const ADMIN = { usuario:"Anderson", sal:"ifenem-e0cdb2ec34658aa9", iteracoes:200000, hash:"5373b062f44dc6f0d988ce297140d3a26ada2fe473fd54e656bf4e5bbd66bd1e" };
async function hashAdmin(senha){
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]);
  const b = await crypto.subtle.deriveBits({ name:"PBKDF2", hash:"SHA-256", salt:new TextEncoder().encode(ADMIN.sal), iterations:ADMIN.iteracoes }, k, 256);
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
}
