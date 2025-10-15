document.addEventListener('DOMContentLoaded', async () => {

    // 1. Definição do Jogo
    const NUMERO_SECRETO = Math.floor(Math.random() * 100) + 1;
    let tentativas = 0;
    let jogoAtivo = true;

    // Configurações para a nova guia
    const URL_PARA_ABRIR = 'lobby.html'; 
    const TEMPO_ESPERA_MS = 5000; // 5 segundos

    // Inicialização do display de resultados
    const resultadoDisplay = document.getElementById('resultado-jogo') || document.createElement('div');
    if (!document.getElementById('resultado-jogo')) {
        resultadoDisplay.id = 'resultado-jogo';
        document.body.appendChild(resultadoDisplay);
    }
    resultadoDisplay.textContent = "Tente adivinhar o número entre 1 e 100!";


    // 2. Loop principal do jogo usando SweetAlert2
    while (jogoAtivo) {
        
        // Chamada do modal principal de palpite
        const result = await Swal.fire({
            title: 'Adivinhe o número!',
            html: `Digite seu palpite (Tentativa #${tentativas + 1}):`,
            input: 'number',
            inputPlaceholder: 'Número de 1 a 100...',
            
            showCancelButton: true,
            cancelButtonText: 'Encerrar Jogo',
            showCloseButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Adivinhar',
            customClass: {
                popup: 'meu-modal-adivinha',
                confirmButton: 'meu-botao-confirmar',
                cancelButton: 'meu-botao-cancelar'
            },
            inputValidator: (value) => {
                const num = parseInt(value);
                if (isNaN(num) || num < 1 || num > 100) {
                    return 'Atenção: Digite um número válido entre 1 e 100!';
                }
            }
        });

        // -----------------------------------------------------------------
        // TRATAMENTO PARA O BOTÃO "ENCERRAR JOGO" (Abertura de Guia)
        // -----------------------------------------------------------------
 if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.close) {
    
    // VARIÁVEL DE CONTADOR: Inicia com o valor do tempo de espera em segundos (5)
    let segundosRestantes = TEMPO_ESPERA_MS / 1000; 
    
    // MENSAGEM INICIAL
    resultadoDisplay.textContent = `Jogo encerrado, o número era ${NUMERO_SECRETO}. Voltando ao lobby em ${segundosRestantes} segundos...`;

    // 1. Usa setInterval para REPETIR a atualização a cada 1000ms (1 segundo)
    const intervalo = setInterval(() => {
        
        segundosRestantes--; // Decrementa o contador
        
        // 2. ATUALIZA A ESCRITA a cada segundo
        resultadoDisplay.textContent = `Jogo encerrado, o número era ${NUMERO_SECRETO}. Voltando ao lobby em ${segundosRestantes} segundos...`;
        
        // 3. Verifica se o tempo acabou
        if (segundosRestantes <= 0) {
            clearInterval(intervalo); // Pára o setInterval
            
            resultadoDisplay.textContent = `Abrindo lobby agora...`; // Última atualização
            setInterval(2000);
            // EXECUTA A AÇÃO FINAL
            // Como você quer que abra na mesma guia, usamos window.location.href
            window.location.href = URL_PARA_ABRIR; 
            
            // Não é necessário window.location.reload() pois o href já redireciona a página.
        }
    }, 1000); // 1000 milissegundos = 1 segundo de intervalo

    jogoAtivo = false; // Encerra o loop do jogo principal
    break; 
}

        // -----------------------------------------------------------------


        // Se o modal foi fechado sem um palpite válido após confirmação, continua no loop
        const palpiteInput = result.value; 
        if (palpiteInput === undefined) { 
            continue;
        }

        const palpite = parseInt(palpiteInput);
        tentativas++;

        // 3. Lógica de Verificação
        if (palpite === NUMERO_SECRETO) {
            // ACERTOU
            resultadoDisplay.textContent = `🎉 Parabéns! Você acertou o número ${NUMETO_SECRETO} em ${tentativas} tentativas!`;
            
            await Swal.fire({
                title: 'Parabéns!',
                text: `Você acertou em ${tentativas} tentativas!`,
                icon: 'success',
                confirmButtonText: 'Jogar Novamente',
                allowOutsideClick: false,
            }).then((reloadResult) => {
                if (reloadResult.isConfirmed) {
                    window.location.reload(); 
                }
            });

            jogoAtivo = false;
        } else if (palpite < NUMERO_SECRETO) {
            // Palpite Baixo
            resultadoDisplay.textContent = `Tentativa #${tentativas}: ${palpite}. Muito baixo! Tente um número maior.`;
            await Swal.fire({
                icon: 'warning',
                title: 'Tente Mais Alto',
                text: `Seu palpite (${palpite}) foi muito baixo.`,
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            // Palpite Alto
            resultadoDisplay.textContent = `Tentativa #${tentativas}: ${palpite}. Muito alto! Tente um número menor.`;
            await Swal.fire({
                icon: 'warning',
                title: 'Tente Mais Baixo',
                text: `Seu palpite (${palpite}) foi muito alto.`,
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

});