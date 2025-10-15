document.addEventListener('DOMContentLoaded', async () => {

    // 1. Definição do Jogo
    const NUMERO_SECRETO = Math.floor(Math.random() * 100) + 1;
    let tentativas = 0;
    let jogoAtivo = true;

    // Configurações para a nova guia (Lobby)
    const URL_PARA_ABRIR = 'lobby.html'; 
    const TEMPO_ESPERA_MS = 5000; // 5 segundos

    // Inicialização do display de resultados
    const resultadoDisplay = document.getElementById('resultado-jogo') || document.createElement('div');
    if (!document.getElementById('resultado-jogo')) {
        resultadoDisplay.id = 'resultado-jogo';
        document.body.appendChild(resultadoDisplay);
    }
    resultadoDisplay.textContent = "Tente adivinhar o número entre 1 e 100!";


    // --- FUNÇÃO AUXILIAR PARA A CONTGAGEM REGRESSIVA ---
    // Usamos uma função para não repetir o código da contagem regressiva.
    function iniciarContagemRegressiva(mensagemInicial) {
        let segundosRestantes = TEMPO_ESPERA_MS / 1000;
        
        // MENSAGEM INICIAL
        resultadoDisplay.textContent = `${mensagemInicial} Voltando ao lobby em ${segundosRestantes} segundos...`;

        const intervalo = setInterval(() => {
            segundosRestantes--; // Decrementa o contador
            
            // ATUALIZA A ESCRITA a cada segundo
            resultadoDisplay.textContent = `${mensagemInicial} Voltando ao lobby em ${segundosRestantes} segundos...`;
            
            // Verifica se o tempo acabou
            if (segundosRestantes <= 0) {
                clearInterval(intervalo); // Pára o setInterval
                
                resultadoDisplay.textContent = `Abrindo lobby agora...`; // Última atualização
                
                // EXECUTA A AÇÃO FINAL (Redirecionamento)
                window.location.href = URL_PARA_ABRIR; 
            }
        }, 1000); // 1000 milissegundos = 1 segundo de intervalo

        jogoAtivo = false; // Encerra o loop do jogo principal
    }
    // ----------------------------------------------------


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
        // TRATAMENTO PARA O BOTÃO "ENCERRAR JOGO" (Contagem Regressiva)
        // -----------------------------------------------------------------
        if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.close) {
            
            const mensagem = `Jogo encerrado, o número era ${NUMERO_SECRETO}.`;
            iniciarContagemRegressiva(mensagem); 
            break; 
        }

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
            
            // 1. Mostra o modal de Parabéns (o usuário clica OK)
            const sucessoResult = await Swal.fire({
                title: '🎉 Parabéns!',
                text: `Você acertou em ${tentativas} tentativas!`,
                icon: 'success',
                confirmButtonText: 'Continuar',
                allowOutsideClick: false,
            });

            if (sucessoResult.isConfirmed) {
                const mensagem = `🎉 Parabéns! O número era ${NUMERO_SECRETO}.`;
                iniciarContagemRegressiva(mensagem);
            }

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
