let nomeParticipante = prompt("Olá! Digite seu nome para entrar:");
let mensagens = [];
let participantesOnline = [];

//Participante entra na sala, e pede-se um nome:
const adicionarParticipante = () => {
    const novoParticipante = {
        name: nomeParticipante
    }

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants/8fd2a306-5788-4cb6-ae94-10e957cdfaf5",
        novoParticipante);
    promessa.then(logarNoChat);
    promessa.catch(nomeExistente);
}

//Em caso de sucesso ao inserir nome
const logarNoChat = resposta => {
    buscarMensagens();
    buscarParticipantes();
    const atualizaMensagens = setInterval(buscarMensagens, 3000);
    const atualizaStatusParticipante = setInterval(enviarStatus, 5000);
    const atualizaListaParticipantes = setInterval(buscarParticipantes, 10000);
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
        "https://mock-api.driven.com.br/api/v6/uol/status/8fd2a306-5788-4cb6-ae94-10e957cdfaf5",
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
        "https://mock-api.driven.com.br/api/v6/uol/messages/8fd2a306-5788-4cb6-ae94-10e957cdfaf5"
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
    const eMsgPublica = mensagem.type === "message";

    if (eStatus) {
        main.innerHTML += `
        <div class="msg status">
            <p><span class="horario">${mensagem.time} </span><span class="remetente"> ${mensagem.from}</span> ${mensagem.text}</p>
        </div>`;
    }
    else if(eMsgPublica) {
        main.innerHTML += `
        <div class="msg ${mensagem.type}">
            <p><span class="horario">${mensagem.time}</span> <span class="remetente">${mensagem.from}</span> para <span class="destinatario">${mensagem.to}</span>: ${mensagem.text}</p>
        </div>`;
    }
    else{
        console.log("Alguma coisa vai aqui");
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
        "https://mock-api.driven.com.br/api/v6/uol/participants/8fd2a306-5788-4cb6-ae94-10e957cdfaf5"
    );
    promessa.then(processarParticipantes);
    promessa.catch(retornoErro);

}

const processarParticipantes = resposta => {
    let participantes = document.querySelector(".participantes");
    participantes.innerHTML = 
            `<li>
                <div class="nome-participante">
                    <div class="icone-participante">
                        <ion-icon name="people"></ion-icon>
                        <span class="texto-lista">Todos</span>
                    </div>
                    <div class="selecionado">
                        <ion-icon name="checkmark-sharp"></ion-icon>
                    </div>
                </div>
            </li>`;
    participantesOnline = resposta.data;
    participantesOnline.forEach(renderizarParticipantes);

}

const renderizarParticipantes = participante => {
    let participantes = document.querySelector(".participantes");
    participantes.innerHTML += 
            `<li>
                <div class="nome-participante">
                    <div class="icone-participante">
                        <ion-icon name="person-circle"></ion-icon>
                        <span class="texto-lista">${participante.name}</span>
                    </div>
                    <div class="selecionado">
                        <ion-icon name="checkmark-sharp"></ion-icon>
                    </div>
                </div>
            </li>`;
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

//enviar mensagem no chat
const enviarMensagem = () => {
    const to = document.querySelector(".participante-escolhido").innerHTML;
    const text = document.querySelector(".campo-mensagem").value;
    let textoValidado = validarTextoVazio(text);
    let type = document.querySelector(".tipo-visibilidade").innerHTML;
    const typeValidado = validarTipoMensagem(type);

    const novaMensagem = {
        from: nomeParticipante,
        to: to,
        text: textoValidado,
        type: typeValidado,
    }

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/messages/8fd2a306-5788-4cb6-ae94-10e957cdfaf5",
        novaMensagem
    );
    promessa.then(limparInput);
    promessa.catch(retornoErro);

    console.log(novaMensagem);
}

//converte publico ou reservadamente para message ou private_message
const validarTipoMensagem = type => {

    if(type === "público"){
        type = "message";
    }else{
        type = "private_message";
    }

    return type;
}

//validar se texto em Branco

const validarTextoVazio = text => {
    if(text === ''){
        alert("Não é possivel enviar texto em branco");
    }
    return text;
}

//limpar input
const limparInput = () => {
    const limpar = document.querySelector(".campo-mensagem").value = '';
}

//executar funcao ao abrir pagina
adicionarParticipante();