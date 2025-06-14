import React, { useState, useEffect } from "react";
import "./CrudRealidade.css";
import UserService from "../../../services/UserService";
import Main from "../../templates/Main";

const avatarAleatorio = () => {
// Gera um numero, converte para a base 36 e dps pega os 7 primeiros caracteres
    const codigo = Math.random().toString(36).substring(2, 9);
    const avatarUrl = `https://avatars.dicebear.com/api/big-smile/${codigo}.svg`;

    return avatarUrl;
};

export default function CrudCarometro() {
    const stateInicial = {
        filme: { idFilme: "", avaliacao: "", name: "", categoria: "" },
        listaRealidades: [],
        listaFilmes: [],
    };

    const titulo = "Aqui seus sonhos viram realidade";
    const [listaRealidades, setRealidades] = useState(stateInicial.listaRealidades);
    const [listaFilmes, setFilmes] = useState(stateInicial.listaFilmes);
    const [message, setMessage] = useState("");
    const [filme, setFilme] = useState(stateInicial.filme);

    // Estado para armazenar a lista de mensagens
    const [mensagens, setMensagens] = useState([]);

    // Estado para armazenar a pergunta digitada pelo usuário
    const [pergunta, setPergunta] = useState("");

    useEffect(() => {
        UserService.getPublicContent
            .getFilmes()
            .then((resp) => setFilmes(resp.data))
            .catch((err) => {
                console.log(err);
            });  
    }, [filme]);

    // Função para fazer a requisição para a API do    OpenAI (ou sua API personalizada)
    const getRespostaIA = async () => {
        const apiKey = '66d0cf0694d1e514ee227bca_d1ab4d1fa47d9c2c';
        const url = 'https://chat.maritaca.ai/api/v1/chat/completions'; // Troque pela URL correta se necessário

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        const data = {
            model: 'sabia-3',
            messages: [
                { role: 'user', content: pergunta}, // Exemplo de mensagem. Pode modificar para o que desejar.
            ],
            max_tokens: 8000,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.choices && result.choices.length > 0) {
                const resposta = result.choices[0].message. content;
                // Adiciona a nova mensagem (pergunta e resposta) à lista
                setMensagens(prevMensagens => [
                    ...prevMensagens,
                    { tipo: "user", texto: pergunta },
                    { tipo: "ia", texto: resposta },
                ]);
            } else {
                setMensagens(prevMensagens => [
                    ...prevMensagens,
                    { tipo: "ia", texto: "Desculpe, não consegui processar a resposta." },
                ]);
            }
        } catch (error) {
            console.error('Erro ao buscar resposta da IA:', error);
            setMensagens(prevMensagens => [
                ...prevMensagens,
                { tipo: "ia", texto: 'Erro na requisição' },
            ]);
        }
    };

    // Função para lidar com o envio da pergunta
    const handlePerguntaChange = (event) => {
        setPergunta(event.target.value); // Atualiza a pergunta conforme o usuário digita
    };

    // Função para enviar a pergunta
    const handlePerguntaSubmit = (event) => {
        event.preventDefault(); // Impede o envio do formulário (comportamento padrão)
        if (pergunta.trim() !== "") {
            // Adiciona a pergunta à lista de mensagens e chama a API
            setMensagens(prevMensagens => [
                ...prevMensagens,
                { tipo: "user", texto: pergunta }
            ]);
            getRespostaIA(); // Chama a API com a pergunta
            setPergunta("");
        } else {
            setMensagens(prevMensagens => [
                ...prevMensagens,
                { tipo: "ia", texto: "Por favor, digite uma pergunta." }
            ]);
        }
    };

    useEffect(() => {
    // Se precisar, pode chamar a função getRespostaIA quando o componente carregar
        getRespostaIA();
    }, []);

    const filtrarRestaurantesPorFilme = async (event) => {};

    const getListaRestauranteDoFilme = async (nomeFilme) => {};

    const renderSelect = () => {};

    const renderCarometro = () => (
        <div className="card-row">
            {listaRealidades.length > 0
                ? listaRealidades.map((restaurante) => (
                    <div className="card dream draw-border" key={restaurante.idRestaurante}>
                        <img
                            className="card-img"
                            src={restaurante.url}
                            alt={"Avatar: " + restaurante.name}
                        />
                        <span className="card-title">{restaurante.name}</span>
                        <span className="card-description">Nota: {restaurante.avaliacao}</span>
                        <span className="card-description">Filme: {restaurante.nameFilme}</span>
                    </div>
                ))
                : null}
        </div>
    );

    return (
        <div className="container carometro">
            <h4 className="msgErro">{message}</h4>
            <div className="header">
                <h2>{titulo}</h2>
            </div>
            {renderSelect()}
            {/* Campo para o usuário digitar a pergunta */}
            <div className="input-container">
                <input
                    type="text"
                    value={pergunta}
                    onChange={handlePerguntaChange}
                    placeholder="Digite sua pergunta"
                />
                <button onClick={handlePerguntaSubmit}>Perguntar</button>
            </div>
            {/* Exibe as mensagens como um chat */}
            <div className="chat">
                {mensagens.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.tipo === "user" ? "user-message" : "ia-message"}`}
                    >
                        <p>{msg.texto}</p>
                    </div>
                ))}
            </div>
            <main>
                <div className="card-container">
                    {renderCarometro()}
                </div>
            </main>
        </div>
    );
}
//const div = document.createElement("div");

// Criar o elemento h3
//const h3 = document.createElement("h3");

// Definir o conteúdo do h3 (opcional)
//h3.textContent = "Título dentro da div";

// Adicionar o h3 dentro da div
//div.appendChild(h3);

// Adicionar a div ao corpo do documento (ou outro elemento)
//document.body.appendChild(div);

// Ou, se você quiser adicionar a div a um elemento específico:
// const container = document.getElementById("meu-container");
// container.appendChild(div);