let mensagens = [];
let participantes = [];
let novoNome = prompt("Olá! Digite seu nome para entrar:");

//Adicionar usuário no chat
const adicionarNovoParticipante = () => {

    const novoParticipante = {
        name: novoNome
    };

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants/36779bab-ebca-4960-aa5c-78095c04c3f6", novoParticipante);
    promessa.then(buscarMensagens);
    promessa.catch(nomeExistente);
    participantes.push(novoParticipante);

}

//informa que o nome já está em uso e pede um novo (e fica em looping até mudar)
const nomeExistente = erro => {
    switch (erro.response.status) {
        case 400:
            novoNome = prompt("Nome já existente. Digite outro nome: ");
            adicionarNovoParticipante();
            break;
    }
}

//mantém conexão do usuario enviando o objeto para a API a cada 5s.
//chama função a cada de buscar e atualizar mensagens
const participantesOnline = () => {

    const usuariosOnline = {
        name: novoNome
    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status/36779bab-ebca-4960-aa5c-78095c04c3f6", usuariosOnline);
    promessa.then(atualizarMensagens);
    promessa.catch(participanteOffline);

}

const atualizarParticipantes = () => setInterval(participantesOnline, 5000);

//Faz um get na API e tras as mensagens e chama função de renderizar msgs e atualiza a cada 3s
const buscarMensagens = () => {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages/36779bab-ebca-4960-aa5c-78095c04c3f6");
    promessa.then(renderizarMensagens);
}

const renderizarMensagens = resposta => {
    mensagens = resposta.data;

    const div = document.querySelector("main");
    div.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "message") {
            div.innerHTML += `
                <p class="${mensagens[i].type}">
                ${mensagens[i].time} ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
                <p>
            `

        }
        else {
            div.innerHTML += `
                <p class="${mensagens[i].type}">
                ${mensagens[i].time} ${mensagens[i].from} ${mensagens[i].text}
                <p>
            `
        }
    }

}

const atualizarMensagens = () => setInterval(buscarMensagens, 3000);



const participanteOffline = erro => {
    console.log(erro);
}


/* const buscarParticipantes = () => {
    const 
} */

//funções que inicializam quando abre a página
adicionarNovoParticipante();
atualizarParticipantes();

