// ===============================
// LISTA PRINCIPAL DE MEDICAMENTOS
// ===============================
let listaMedicamentos = [];


// ===============================
// SELEÇÃO DE ELEMENTOS
// ===============================

// selects e inputs principais
const selectMedicamentos = document.getElementById("selectMedicamentos");
const btnAdd = document.querySelector(".btn-add");
const listaUL = document.querySelector(".lista-box ul");
const btnGerarPDF = document.querySelector(".btn-gerar");

// campos do paciente (container1)
const inputsC1 = document.querySelectorAll(".container1 input");
const inputNome = inputsC1[0];
const inputDataIda = inputsC1[1];
const inputDataVolta = inputsC1[2];
const inputGrade = document.querySelector("#grade");

// campos adicionais (container2)
const instrucaoExtra = document.querySelector('.c2-box input[type="text"]');
const horarioInput = document.querySelector('.c2-box input[type="time"]');
const turnoSelect = document.querySelectorAll('.c2-box select')[1];
const checkboxImagem = document.querySelector("#img-medicamento");
const checkboxTurno = document.querySelector("#turno-medicamento");

// preview da imagem
const previewImg = document.querySelector('.image-box img');

// limpar lista visual
listaUL.innerHTML = "";


// ===============================
// FUNÇÃO: Trocar imagem por medicamento (PREVIEW NO FORMULÁRIO)
// ===============================
function atualizarImagemMedicamento() {
    const val = selectMedicamentos.value;

    if (val === "SELECIONE" || val === "") {
        previewImg.src = "image/imagem_padrao.png";
        return;
    }

    if (val === "CLORIDRATO DE PROPRANOLOL 40MG") {
        previewImg.src = "image/cloridrato_de_propanol.webp";
        return;
    }

    if (val === "SUCCINATO DE METOPROLOL 25MG") {
        previewImg.src = "image/succinato_de_metoprolol.webp";
        return;
    }

    if (val === "ALENDRONATO DE SÓDIO 70MG") {
        previewImg.src = "image/alendronato_de_sodio.webp";
        return;
    }

    if (val === "BUDESONIDA 50MCG") {
        previewImg.src = "image/budesonida.webp";
        return;
    }

    previewImg.src = "image/imagem_padrao.png";
}


// aplica mudança de imagem
selectMedicamentos.addEventListener("change", atualizarImagemMedicamento);


// ===============================
// FUNÇÃO: Limpar campos após adicionar
// ===============================
function limparCampos() {
    selectMedicamentos.selectedIndex = 0;
    instrucaoExtra.value = "";
    horarioInput.value = "";
    turnoSelect.selectedIndex = 0;
    checkboxImagem.checked = false;
    checkboxTurno.checked = false;
    previewImg.src = "image/imagem_padrao.png";
}


// ===============================
// FUNÇÃO: Adicionar medicamento à lista
// ===============================
function adicionarMedicamento() {
    const medicamentoSelecionado = selectMedicamentos.value;

    if (medicamentoSelecionado === "SELECIONE") {
        alert("Selecione um medicamento antes de adicionar!");
        return;
    }

    const item = {
        nome: medicamentoSelecionado,
        instrucao: instrucaoExtra.value.trim(),
        horario: horarioInput.value,
        turno: turnoSelect.value,
        usarImagem: checkboxImagem.checked,
        usarTurnoVisual: checkboxTurno.checked
    };

    listaMedicamentos.push(item);

    console.log("Lista atual:", listaMedicamentos);

    const li = document.createElement("li");
    li.textContent = medicamentoSelecionado;
    listaUL.appendChild(li);

    limparCampos();
}

btnAdd.addEventListener("click", adicionarMedicamento);


// ===============================
// LÓGICA AUXILIAR PARA IMAGENS (PDF)
// ===============================

// 1. Retorna a imagem base64 do medicamento
function obterImagemMedicamento(nome) {
    if (nome === "CLORIDRATO DE PROPRANOLOL 40MG") return imagemCloridrato;
    if (nome === "SUCCINATO DE METOPROLOL 25MG") return imagemMetoprolol; // Atenção: no seu imagens.js o nome da var pode ser imagemMetoprolol ou imagemSuccinato, verifique o arquivo. Usei imagemMetoprolol baseado no contentFetchId fornecido anteriormente, ajuste se necessário.
    if (nome === "ALENDRONATO DE SÓDIO 70MG") return imagemAlendronato;
    if (nome === "BUDESONIDA 50MCG") return imagemBudesonida;
    return null;
}

// 2. Retorna a imagem base64 do Turno/Horário
function obterImagemVisual(turno, horario) {
    // Prioridade 1: Turno Selecionado
    if (turno === "MANHÃ") return imagemManha;
    if (turno === "TARDE") return imagemTarde;
    if (turno === "NOITE") return imagemNoite;

    // Prioridade 2: Horário
    if (horario) {
        // horario vem no formato "HH:MM", pegamos apenas a hora
        const hora = parseInt(horario.split(":")[0]);

        // 05:00 - 11:59 -> Manhã
        if (hora >= 5 && hora < 12) return imagemManha;

        // 12:00 - 18:59 -> Tarde
        if (hora >= 12 && hora < 19) return imagemTarde;

        // 19:00 - 04:59 -> Noite (Qualquer outro caso)
        return imagemNoite;
    }

    return null;
}


// ===============================
// FUNÇÃO: Gerar PDF
// ===============================
function gerarPDF(pacienteInfo, listaMedicamentos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20; // Posição vertical inicial

    // Título
    doc.setFontSize(18);
    doc.text("Plano de Medicamentos", 105, y, null, null, "center");
    y += 15;

    // Dados Paciente
    doc.setFontSize(12);
    doc.text(`Paciente: ${pacienteInfo.nome}`, 14, y); y += 7;
    doc.text(`Período: ${pacienteInfo.dataIda} até ${pacienteInfo.dataVolta}`, 14, y); y += 7;
    doc.text(`Grade de dias: ${pacienteInfo.gradeDias ? "Sim" : "Não"}`, 14, y);
    y += 15;

    // Linha divisória
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Medicamentos prescritos:", 14, y);
    y += 10;

    doc.setFontSize(12);

    listaMedicamentos.forEach((med, index) => {
        // Verifica se precisa criar nova página antes de começar o item
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        // Nome do medicamento
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${med.nome}`, 14, y);
        doc.setFont(undefined, 'normal');
        y += 6;

        // Detalhes em texto
        if (med.horario) { doc.text(`   Horário: ${med.horario}`, 14, y); y += 5; }
        if (med.turno && med.turno !== "SELECIONE") { doc.text(`   Turno: ${med.turno}`, 14, y); y += 5; }
        if (med.instrucao) { doc.text(`   Instruções: ${med.instrucao}`, 14, y); y += 5; }

        // --- LÓGICA DAS IMAGENS ---
        let imagemMed = null;
        let imagemVis = null;

        // Verifica se deve pegar imagem do medicamento
        if (med.usarImagem) {
            imagemMed = obterImagemMedicamento(med.nome);
        }

        // Verifica se deve pegar imagem visual (sol/lua)
        if (med.usarTurnoVisual) {
            imagemVis = obterImagemVisual(med.turno, med.horario);
        }

        // Se houver imagens para mostrar
        if (imagemMed || imagemVis) {
            y += 2; // espacinho antes das imagens

            // Se tiver imagem do medicamento
            if (imagemMed) {
                // (imagem, formato, x, y, largura, altura)
                doc.addImage(imagemMed, "WEBP", 14, y, 30, 30); 
            }

            // Se tiver imagem visual (turno)
            if (imagemVis) {
                // Se tiver a do medicamento, coloca ao lado, senão coloca no inicio
                let xPos = imagemMed ? 50 : 14; 
                doc.addImage(imagemVis, "PNG", xPos, y, 30, 30);
            }

            // Incrementa Y baseado na altura da imagem (30) + margem
            y += 35;
        } else {
            y += 5; // apenas um espaço extra se não tiver imagens
        }

        // Espaço entre itens da lista
        y += 5;
    });

    doc.save(`plano_${pacienteInfo.nome || "paciente"}.pdf`);
}


// ===============================
// BOTÃO: Gerar PDF
// ===============================
btnGerarPDF.addEventListener("click", () => {

    const pacienteInfo = {
        nome: inputNome.value,
        dataIda: inputDataIda.value,
        dataVolta: inputDataVolta.value,
        gradeDias: inputGrade.checked
    };

    if (listaMedicamentos.length === 0) {
        alert("A lista está vazia! Adicione medicamentos antes de gerar.");
        return;
    }

    gerarPDF(pacienteInfo, listaMedicamentos);
});