let nomeParticipante = prompt("Olá! Digite seu nome para entrar:");

//Participante entra na sala, e pede-se um nome:
const adicionarParticipante = () => {
    const novoParticipante = {
        name: nomeParticipante
    }

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants/2859eeff-8821-45c5-ab78-67cda96705d2",
        novoParticipante);
    promessa.then(logarNoChat);
    promessa.catch(nomeExistente);
}

//Em caso de sucesso ao inserir nome
const logarNoChat = resposta => {
    const atualizaStatusParticipante = setInterval(enviarStatus, 5000);
    const atualizaMensagens = setInterval(buscarMensagens,3000);
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
        "https://mock-api.driven.com.br/api/v6/uol/status/2859eeff-8821-45c5-ab78-67cda96705d2",
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
        "https://mock-api.driven.com.br/api/v6/uol/messages/2859eeff-8821-45c5-ab78-67cda96705d2"
    );
    promessa.then(retornoSucesso);
    promessa.catch(retornoErro);
}

//executar funcao ao abrir pagina
adicionarParticipante();