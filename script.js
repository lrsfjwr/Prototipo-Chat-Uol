let mensagens = [];
let novoNome = prompt("Olá! Digite seu nome para entrar:");

const adicionarNovoParticipante = () => {
    const novoParticipante = {
        name: novoNome
    };

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants/36779bab-ebca-4960-aa5c-78095c04c3f6", novoParticipante);
    promessa.then(buscarMensagens);
    promessa.catch(nomeExistente);
}

const nomeExistente = erro => {
    switch (erro.response.status) {
        case 400:
            novoNome = prompt("Nome já existente. Digite outro nome: ");
            adicionarNovoParticipante();
            break;
    }
}

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
                <div class="${mensagens[i].type}">
                    ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
                </div>
            `
        }
        else {
            div.innerHTML += `
                <div class="${mensagens[i].type}">
                    ${mensagens[i].from} ${mensagens[i].text}
                </div>
            `
        }
    }

}

adicionarNovoParticipante();
