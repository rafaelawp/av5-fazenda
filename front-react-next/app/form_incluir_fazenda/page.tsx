//nao fiz ainda - aparentemente falta só esse aaaa

'use client';

import { FormEvent, useEffect, useState,  } from 'react';
import { useRouter } from "next/navigation";

export default function FormIncluirFazenda() {

  const [nome, setNome] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [ano_fundacao, setAno_Fundacao] = useState<string>("");
  const [nome_fazendeiro, setNome_Fazendeiro] = useState<string>("");
  const [morcego_frutifero, setMorcego_Frutifero] = useState<string>("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  
  // obtém da variável de ambiente o endereço do backend (API)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // tenta buscar a token
    const savedToken = localStorage.getItem("token");
    // se não houver token
    if (!savedToken) {
      // encaminha para o login
      router.replace("/form_login");
    }
    // persiste o token
    setToken(savedToken);
  
  }, [router]);


  useEffect(() => {
    // se não houver mensagem, encerra
    if (!message) return;

    // exibe a mensagem por 5 segundos
    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);
    return () => clearTimeout(timer);

  }, [message]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const enviar = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setMessage("");
    setError("");

    setLoading(true);

    try {

      const resposta = await fetch(apiUrl + '/fazenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, tipo, ano_fundacao, nome_fazendeiro, morcego_frutifero})
      });

      switch (resposta.status) {
        case 200:
        case 201:
          setMessage("Fazenda cadastrada com sucesso!");
          // limpa os campos
          setNome(""); setTipo(""); setAno_Fundacao("");
          setNome_Fazendeiro(""); setMorcego_Frutifero("");
          break;
        case 400:
          setError("Invalid data.");
          break;
        case 401:
          setError("A sessão expirou. Por favor, faça login novamente!");
          // Optional:
          // localStorage.removeItem("token");
          // router.push("/login");
          break;
        case 403:
          setError("Você não tem permissão para realizar esta ação.");
          break;
        case 500:
          setError("Erro interno no servidor backend.");
          break;
        default:
          const resultado = await resposta.json();
          setError(resultado.message || "Um erro inesperado ocorreu.");
      }
  } catch (error) {
    console.log('error', error);
    setError("Não foi possível conectar-se ao backend");
  } finally {
    setLoading(false);
  }
}

// se não houver token, encerra a página
if (!token) {
  return null;
}


return (
  <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

      <h1
      className="text-4xl font-bold tracking-tight text-gray-900 mb-4"
      >Cadastrar Fazenda</h1>

      {message && (
        <p className="text-green-600 font-medium">
          {message}
        </p>
      )}

      {error && (
        <p className="text-red-600 font-medium">
          {error}
        </p>
      )}

      <form className="flex flex-col gap-4 w-full" onSubmit={enviar}>

        <input type="text" name="nome"
          placeholder="Nome" value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required />

        <input type="tipo" name="tipo" placeholder="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required 
          className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

        <input type="text" name="ano_fundacao" placeholder="Ano de Fundação"
          value={ano_fundacao}
          onChange={(e) => setAno_Fundacao(e.target.value)} 
          className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

        <input type="text" name="nome_fazendeiro" placeholder="Nome do Fazendeiro"
          value={nome_fazendeiro}
          onChange={(e) => setNome_Fazendeiro(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required />

        <input type="password" name="morcego_frutifero" placeholder="Presença de Morcegos Frutiferos"
          value={morcego_frutifero}
          onChange={(e) => setMorcego_Frutifero(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required />

        <button type="submit"
          disabled={loading}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

      </form>

    </main>
  </div>
);
}