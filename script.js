let nomeParticipante = prompt("Olá! Digite seu nome para entrar:");
let mensagens = [];
let participantesOnline = [];
let participanteSelecionado = "Todos";

//Participante entra na sala, e pede-se um nome:
const adicionarParticipante = () => {
    
    const novoParticipante = {
        name: nomeParticipante
    }

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants/a4a3f92a-4af4-4fb7-a82c-8a9e61dba1c4",
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
        nomeParticipante = prompt("Nome em branco ou em uso. Digite novamente:");
    }
    adicionarParticipante();
}

//Enviar status do partipante a cada 5s
const enviarStatus = () => {

    const participante = {
        name: nomeParticipante
    }

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status/a4a3f92a-4af4-4fb7-a82c-8a9e61dba1c4",
        participante
    );
    /* promessa.then(retornoSucesso); */
    promessa.catch(recarregarPagina);

}

//caso o catch de erro, recarrega a página
const recarregarPagina = erro => {
    alert("Algo deu errado, a página será recarregada");
    window.location.reload();
}

//Buscar mensagens do servidor
const buscarMensagens = () => {
    const promessa = axios.get(
        "https://mock-api.driven.com.br/api/v6/uol/messages/a4a3f92a-4af4-4fb7-a82c-8a9e61dba1c4"
    );
    promessa.then(processarMensagens);
    promessa.catch(recarregarPagina);
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
        if(mensagem.from === nomeParticipante || mensagem.to === nomeParticipante){
            main.innerHTML += `
            <div class="msg ${mensagem.type}">
            <p><span class="horario">${mensagem.time}</span> <span class="remetente">${mensagem.from}</span> reservadamente para <span
                    class="destinatario">${mensagem.to}</span>: ${mensagem.text}</p>
            </div>`;
        }
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
        "https://mock-api.driven.com.br/api/v6/uol/participants/a4a3f92a-4af4-4fb7-a82c-8a9e61dba1c4"
    );
    promessa.then(processarParticipantes);
    promessa.catch(recarregarPagina);

}

const processarParticipantes = resposta => {
    let participantes = document.querySelector(".participantes");
    participantes.innerHTML = 
            `<li onclick="selecionarParticipante(this)">
                <div class="nome-participante">
                    <div class="icone-participante">
                        <ion-icon name="people"></ion-icon>
                        <span class="texto-lista">Todos</span>
                    </div>
                    <div class="check escondido">
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
            `<li onclick="selecionarParticipante(this)">
                <div class="nome-participante">
                    <div class="icone-participante">
                        <ion-icon name="person-circle"></ion-icon>
                        <span class="texto-lista">${participante.name}</span>
                    </div>
                    <div class="check escondido">
                        <ion-icon name="checkmark-sharp"></ion-icon>
                    </div>
                </div>
            </li>`;
    verificaParticipanteSelecionado();
}

//manter o check no participante
const verificaParticipanteSelecionado = () => {
    const listaParticipantes = document.querySelectorAll(".participantes li");
    listaParticipantes.forEach(analisaSelecionado);

}
const analisaSelecionado = index => { 
    const participante = index.querySelector(".texto-lista").innerHTML;
    const selecionado = index.querySelector(".participantes .check");
    if (participante === participanteSelecionado) {
        selecionado.classList.remove("escondido");
    }else{
        selecionado.classList.add("escondido");
    }
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
    let destinatario = participantesOnline.find(verificaPresenca);  
    let toValidado = validarDestinatario(destinatario);
    const text = document.querySelector(".campo-mensagem").value;
    let textoValidado = validarTextoVazio(text);
    let type = document.querySelector(".tipo-visibilidade").innerHTML;
    let typeValidado = validarTipoMensagem(type);

        const novaMensagem = {
            from: nomeParticipante,
            to: toValidado,
            text: textoValidado,
            type: typeValidado,
        }


    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/messages/a4a3f92a-4af4-4fb7-a82c-8a9e61dba1c4",
        novaMensagem
    );
    promessa.then(limparInput);
    promessa.catch(recarregarPagina);
}


//valida destinatário
const validarDestinatario = destinatario => {
    const to = document.querySelector(".participante-escolhido").innerHTML;
    if (destinatario || (!destinatario && to === "Todos")) {
    return to;    
    }else{
    return undefined;
    }
}

const verificaPresenca = to => {
    const destinatario = document.querySelector(".participante-escolhido").innerHTML;
    return destinatario === to.name;
}

//converte publico ou reservadamente para message ou private_message
const validarTipoMensagem = type => {

    if(type === "Público"){
        type = "message";
    }else{
        type = "private_message";
    }

    return type
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


//funcao selecionar participante

const selecionarParticipante = elemento => {
    const nomeSelecionado = elemento.querySelector(".texto-lista").innerHTML;
    participanteSelecionado = nomeSelecionado;
    
    
    if (participanteSelecionado === "Todos") {
        const liPrivacidade = document.querySelectorAll(".privacidade .check");
        let publico = document.querySelectorAll(".privacidade .texto-lista");
        liPrivacidade[0].classList.remove("escondido");
        liPrivacidade[1].classList.add("escondido");
        
        let texto = publico[0].innerHTML;
        let alterarTexto = document.querySelector(".tipo-visibilidade");
        alterarTexto.innerHTML = texto;
    }
    verificaParticipanteSelecionado();
    let alterarPessoa = document.querySelector(".participante-escolhido");
    alterarPessoa.innerHTML = participanteSelecionado;
    
}

//funcao selecionar msg publica ou privada

const selecionarPrivacidade = elemento => {
    const li = document.querySelectorAll(".privacidade .check");

    const selecionado = elemento.querySelector(".texto-lista").innerHTML;
    
    if (selecionado === "Público") {
        li[0].classList.remove("escondido");
        li[1].classList.add("escondido");
    } else if (selecionado === "Reservadamente" && participanteSelecionado === "Todos") {
        alert("Não é possivel enviar uma mensagem reservada para Todos");
        let manterTexto = document.querySelector(".tipo-visibilidade");
        manterTexto.innerHTML = "Público";
    }
    else{
        li[0].classList.add("escondido");
        li[1].classList.remove("escondido");
        let alterarTexto = document.querySelector(".tipo-visibilidade");
        alterarTexto.innerHTML = selecionado;
    }
}

//executar funcao ao abrir pagina
adicionarParticipante();