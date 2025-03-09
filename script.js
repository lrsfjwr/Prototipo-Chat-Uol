let nomeParticipante = prompt("Olá! Digite seu nome para entrar:");
let mensagens = [];
let participantesOnline = [];

//Participante entra na sala, e pede-se um nome:
const adicionarParticipante = () => {
    const novoParticipante = {
        name: nomeParticipante
    }

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants/603cf7f1-5371-456d-9798-b8a9f20ca74e",
        novoParticipante);
    promessa.then(logarNoChat);
    promessa.catch(nomeExistente);
}

//Em caso de sucesso ao inserir nome
const logarNoChat = resposta => {
    buscarMensagens();
    buscarParticipantes();
    /*     const atualizaMensagens = setInterval(buscarMensagens, 3000);
        const atualizaStatusParticipante = setInterval(enviarStatus, 5000);
        const atualizaListaParticipantes = setInterval(buscarParticipantes, 10000); */
}

//Em caso de nome inválido ou existente
const nomeExistente = erro => {

    if (erro.response.status === 400) {
        nomeParticipante = prompt("Este nome já está em uso. Digite outro nome:");
    }
    adicionarParticipante();
}

//Enviar status do partipante a cada 5s
const enviarStatus = () => {

    const participante = {
        name: nomeParticipante
    }

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status/603cf7f1-5371-456d-9798-b8a9f20ca74e",
        participante
    );
    promessa.then(retornoSucesso);
    promessa.catch(retornoErro);

}

const retornoSucesso = resposta => console.log(resposta);
const retornoErro = erro => console.log(erro);

//Buscar mensagens do servidor
const buscarMensagens = () => {
    const promessa = axios.get(
        "https://mock-api.driven.com.br/api/v6/uol/messages/603cf7f1-5371-456d-9798-b8a9f20ca74e"
    );
    promessa.then(processarMensagens);
    promessa.catch(retornoErro);
}

//processar receitas
const processarMensagens = resposta => {
    let main = document.querySelector("main");
    main.innerHTML = "";
    mensagens = resposta.data;
    mensagens.forEach(renderizarMensagens);
}

//renderiza mensagens
const renderizarMensagens = mensagem => {
    let main = document.querySelector("main");
    const eStatus = mensagem.type === "status";

    if (eStatus) {
        main.innerHTML += `
        <div class="msg status">
            <p><span class="horario">${mensagem.time} </span><span class="remetente"> ${mensagem.from}</span> ${mensagem.text}</p>
        </div>`;
    }
    else {
        main.innerHTML += `
        <div class="msg ${mensagem.type}">
            <p><span class="horario">${mensagem.time}</span> <span class="remetente">${mensagem.from}</span> <span class="destinatario">${mensagem.to}</span>: ${mensagem.text}</p>
        </div>`;
    }
    rolarAteFinal();
}

const rolarAteFinal = () => {
    const ultimoElemento = document.querySelector('main');
    ultimoElemento.scrollIntoView(false);
}

//buscar participantes
const buscarParticipantes = () => {
    const promessa = axios.get(
        "https://mock-api.driven.com.br/api/v6/uol/participants/603cf7f1-5371-456d-9798-b8a9f20ca74e"
    );
    promessa.then(processarParticipantes);
    promessa.catch(retornoErro);

}

const processarParticipantes = resposta => {
    let participantes = document.querySelector(".participantes");
    participantes.innerHTML = "";
    participantesOnline = resposta.data;
    participantesOnline.forEach(renderizarParticipantes);

}

const renderizarParticipantes = participante => {
    let participantes = document.querySelector(".participantes");
    participantes.innerHTML += `
                                <div class="participantes">
                <div class="tipo-usuario">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${participante.name}</p>
                </div>
                <div class="selecionado">
                </div>
            </div>`;
}

//abrir barra lateral
const abrirBarraLateral = () => {
    const aparecerFundo = document.querySelector(".fundo-escuro");
    aparecerFundo.classList.remove("escondido");

    const abrirMenu = document.querySelector(".menu-navegacao");
    abrirMenu.classList.add("aparecer");
}

//fechar barra lateral
const fecharBarraLateral = () => {
    const fecharMenu = document.querySelector(".menu-navegacao");
    fecharMenu.classList.remove("aparecer");

    const desaparecerFundo = document.querySelector(".fundo-escuro");
    desaparecerFundo.classList.add("escondido");
}

//executar funcao ao abrir pagina
adicionarParticipante();