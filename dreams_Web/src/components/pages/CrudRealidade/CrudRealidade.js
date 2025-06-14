import React, { useState, useEffect } from "react";
import "./CrudRealidade.css";
// import UserService from "../../../services/UserService"; // Removido por não ser usado no exemplo
import Main from "../../templates/Main";

export default function CrudCarometro() {
    const titulo = "Aqui seus sonhos viram realidade";
    const [message, setMessage] = useState("");

    const [mensagens, setMensagens] = useState([]);
    const [pergunta, setPergunta] = useState("");
    const [carregando, setCarregando] = useState(false); // Estado para feedback de carregamento

    // Função para fazer a requisição para a API da Maritaca
    const getRespostaIA = async (textoPergunta, historicoMensagens) => {
        setCarregando(true);
        const apiKey = '66d0cf0694d1e514ee227bca_d1ab4d1fa47d9c2c'; // <<< IMPORTANTE: Mova para um local seguro
        const url = '/api/chat/completions'; 

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Key ${apiKey}`,
        };

        // Construindo o histórico de mensagens para enviar para a API
        const apiMessages = [
            {
                role: 'system',
                content: "Você é uma falsa cartomante mística e conselheira chamada 'Maritaca Vidente'. Seja educada, gentil e um pouco enigmática. Sempre inicie a conversa se apresentando e oferecendo ajuda para desvendar os mistérios do amor ou da carreira. Não ofereça nenhuma verdadeira previsão do futuro, apenas repita o que o usuário informou como se fosse uma grande descoberta. Faça uma pergunta por vez."
            },
            // Adiciona o histórico anterior da conversa
            ...historicoMensagens.map(msg => ({
                role: msg.tipo === 'user' ? 'user' : 'assistant',
                content: msg.texto
            })),
            // Adiciona a nova pergunta do usuário
            { role: 'user', content: textoPergunta }
        ];

        const bodyData = {
            model: 'sabia-3', // Verifique o modelo mais recente na documentação
            messages: apiMessages,
            // Outros parâmetros como temperature, max_tokens, etc., podem ser adicionados aqui
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                // <<< CORREÇÃO 1: Converter o corpo da requisição para uma string JSON
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                // Se a resposta não for OK (ex: 400, 401, 500), lança um erro
                const errorData = await response.json();
                throw new Error(`Erro ${response.status}: ${errorData.detail || response.statusText}`);
            }

            const result = await response.json();

            if (result.choices && result.choices.length > 0) {
                const resposta = result.choices[0].message.content;
                // Adiciona a resposta da IA à lista de mensagens do chat
                setMensagens(prev => [...prev, { tipo: "ia", texto: resposta }]);
            } else {
                setMensagens(prev => [...prev, { tipo: "ia", texto: "Desculpe, não consegui processar a resposta." }]);
            }
        } catch (error) {
            console.error('Erro ao buscar resposta da IA:', error);
            setMensagens(prev => [...prev, { tipo: "ia", texto: `Erro na requisição: ${error.message}` }]);
        } finally {
            setCarregando(false);
        }
    };
    
    // <<< CORREÇÃO 2: Lógica inicial alterada
    // Busca uma saudação inicial da IA quando o componente é montado
    useEffect(() => {
        const fetchInitialGreeting = async () => {
            // Apenas envia a mensagem de sistema para obter uma saudação
            await getRespostaIA("Olá!", []);
        };
        
        // fetchInitialGreeting(); // Descomente esta linha para a IA saudar ao iniciar
    }, []);


    const handlePerguntaChange = (event) => {
        setPergunta(event.target.value);
    };

    const handlePerguntaSubmit = (event) => {
        event.preventDefault();
        if (pergunta.trim() === "" || carregando) {
            return; // Não faz nada se a pergunta estiver vazia ou se já estiver carregando
        }
        
        const novaPergunta = { tipo: "user", texto: pergunta };
        const historicoAtual = [...mensagens, novaPergunta];

        // Adiciona a pergunta do usuário imediatamente na tela
        setMensagens(historicoAtual);
        
        // <<< CORREÇÃO 3: Passa a pergunta e o histórico para a função
        getRespostaIA(pergunta, mensagens);
        setPergunta(""); // Limpa o campo de input
    };

    // Renderiza as mensagens do chat
    const renderChat = () => (
        <div className="chat-container">
            {mensagens.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.tipo}`}>
                    <p c>{msg.texto}</p>
                </div>
            ))}
            {carregando && <div className="chat-message ia"><p>Digitando...</p></div>}
        </div>
    );

    return (
        <Main title={titulo}>
            <div className="chat-wrapper">
                {renderChat()}
                <form className="input-container" onSubmit={handlePerguntaSubmit}>
                    <input
                        type="text"
                        value={pergunta}
                        onChange={handlePerguntaChange}
                        placeholder="Faça sua pergunta ao oráculo..."
                        disabled={carregando}
                    />
                    <button type="submit" disabled={carregando}>
                        {carregando ? "..." : "Perguntar"}
                    </button>
                </form>
            </div>
        </Main>
    );
}