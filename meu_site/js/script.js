let listaMedicamentos = []; // lista

// Selecionar elementos importantes
const selectMedicamentos = document.querySelector(".container2 select");
const btnAdd = document.querySelector(".btn-add");
const listaUL = document.querySelector(".lista-box ul");

const btnGerarPDF = document.querySelector(".btn-gerar");

// campos consulta
const inputsC1 = document.querySelectorAll(".container1 input");

const inputNome = inputsC1[0];     // primeiro input: nome
const inputDataIda = inputsC1[1];  // segundo input: data ida
const inputDataVolta = inputsC1[2]; // terceiro input: data volta
const inputGrade = document.querySelector("#grade"); // checkbox


// Campos adicionais
const instrucaoExtra = document.querySelector('.c2-box input[type="text"]');
const horarioInput = document.querySelector('.c2-box input[type="time"]');
const turnoSelect = document.querySelectorAll('.c2-box select')[1]; // segundo select da container2
const checkboxImagem = document.querySelector("#img-medicamento");
const checkboxTurno = document.querySelector("#turno-medicamento");

// Elemento de preview da imagem (imagem dentro da div .image-box)
const previewImg = document.querySelector('.image-box img');

// Limpa a lista ao iniciar
listaUL.innerHTML = "";

// --------------------------------------------------
// 1) Trocar imagem conforme o medicamento selecionado
// --------------------------------------------------
selectMedicamentos.addEventListener("change", () => {
    const val = selectMedicamentos.value;

    // Valor padrão
    if (val === "SELECIONE" || val === "") {
        previewImg.src = "image/imagem_padrao.png";
        return;
    }

    // Usando ifs para cada medicamento (arquivo conforme sua nomenclatura)
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

    // caso algum valor novo apareça, volta para padrão
    previewImg.src = "image/imagem_padrao.png";
});

// Função de adicionar item à lista
btnAdd.addEventListener("click", () => {

    const medicamentoSelecionado = selectMedicamentos.value;

    // Evitar inserir "SELECIONE" ou vazio
    if (medicamentoSelecionado === "SELECIONE") {
        alert("Selecione um medicamento antes de adicionar!");
        return;
    }

    // 🔵 CRIAR OBJETO DO ITEM
    const item = {
        nome: medicamentoSelecionado,
        instrucao: instrucaoExtra.value.trim(),
        horario: horarioInput.value,
        turno: turnoSelect.value,
        usarImagem: checkboxImagem.checked,
        usarTurnoVisual: checkboxTurno.checked
    };

    // 🔵 ADICIONAR NA LISTA
    listaMedicamentos.push(item);

    console.log("Lista atual:", listaMedicamentos); // ← você vê no console no navegador

    // Criar um novo item <li>
    const li = document.createElement("li");
    li.textContent = medicamentoSelecionado;

    // Adicionar na lista
    listaUL.appendChild(li);

    // 🔵 LIMPAR TODOS OS CAMPOS APÓS ADICIONAR
    selectMedicamentos.selectedIndex = 0;   // volta para "SELECIONE"
    instrucaoExtra.value = "";              // limpa texto
    horarioInput.value = "";                // limpa horário
    turnoSelect.selectedIndex = 0;          // volta para "SELECIONE"
    checkboxImagem.checked = false;         // desmarca
    checkboxTurno.checked = false;          // desmarca

    // RESETAR IMAGEM PARA A PADRÃO
    previewImg.src = "image/imagem_padrao.png";
});

function gerarPDF(pacienteInfo, listaMedicamentos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;

    // 📌 Título
    doc.setFontSize(16);
    doc.text("Plano de Medicamentos", 10, y);
    y += 10;

    // 📌 Informações do paciente
    doc.setFontSize(12);
    doc.text(`Paciente: ${pacienteInfo.nome}`, 10, y); y += 7;
    doc.text(`Data ida: ${pacienteInfo.dataIda}`, 10, y); y += 7;
    doc.text(`Data volta: ${pacienteInfo.dataVolta}`, 10, y); y += 7;
    doc.text(`Gerar grade? ${pacienteInfo.gradeDias ? "Sim" : "Não"}`, 10, y);
    y += 15;

    // 📌 Lista de medicamentos
    doc.setFontSize(14);
    doc.text("Medicamentos:", 10, y);
    y += 8;

    doc.setFontSize(12);

    listaMedicamentos.forEach((med) => {
        doc.text(`- ${med.nome}`, 12, y); y += 6;
        if (med.horario) doc.text(`  Horário: ${med.horario}`, 12, y), y += 6;
        if (med.turno) doc.text(`  Turno: ${med.turno}`, 12, y), y += 6;
        if (med.instrucao) doc.text(`  Instruções: ${med.instrucao}`, 12, y), y += 6;

        y += 4;

        // 📌 Nova página automática se necessário
        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save("medicamentos.pdf");
}


btnGerarPDF.addEventListener("click", () => {

    const pacienteInfo = {
        nome: inputNome.value,
        dataIda: inputDataIda.value,
        dataVolta: inputDataVolta.value,
        gradeDias: inputGrade.checked
    };

    console.log("Paciente:", pacienteInfo);
    console.log("Medicamentos:", listaMedicamentos);

    // aqui continua sua função de gerar PDF normalmente...
    gerarPDF(pacienteInfo, listaMedicamentos);

});
