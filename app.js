const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert('Tu navegador no soporta reconocimiento de voz. Usa Google Chrome o Microsoft Edge.');
}

let recognition = null;
let isRecording = false;
let isPaused = false;
let startTime = null;
let timerInterval = null;
let transcriptSegments = [];
let currentSegment = '';
let segmentTimestamp = null;

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
const btnPdf = document.getElementById('btn-pdf');
const btnClear = document.getElementById('btn-clear');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const timerDisplay = document.getElementById('timer');
const notesContent = document.getElementById('notes-content');
const interimDisplay = document.getElementById('interim');
const wordCount = document.getElementById('word-count');

function initRecognition() {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-MX';

    recognition.onstart = () => {
        isRecording = true;
        isPaused = false;
        updateUI();
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            const timestamp = formatTime((Date.now() - startTime) / 1000);
            const segment = {
                text: capitalizeFirstLetter(finalTranscript.trim()),
                timestamp: timestamp,
                time: Date.now()
            };
            transcriptSegments.push(segment);
            currentSegment = '';
            updateNotesDisplay();
        }

        interimDisplay.textContent = interimTranscript;
    };

    recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        if (event.error === 'not-allowed') {
            statusText.textContent = 'Permiso de micrófono denegado';
            statusIndicator.className = 'status-dot';
        } else if (event.error === 'no-speech') {
            statusText.textContent = 'No se detectó voz, reintentando...';
        } else if (event.error === 'network') {
            statusText.textContent = 'Error de red, verifica tu conexión';
        }
    };

    recognition.onend = () => {
        if (isRecording && !isPaused) {
            recognition.start();
        }
    };
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = formatTime(elapsed);
}

function updateUI() {
    btnStart.disabled = isRecording && !isPaused;
    btnPause.disabled = !isRecording;
    btnStop.disabled = !isRecording;
    btnPdf.disabled = transcriptSegments.length === 0;

    if (isRecording && !isPaused) {
        statusIndicator.className = 'status-dot recording';
        statusText.textContent = 'Grabando...';
        btnPause.innerHTML = '<span class="icon">&#9208;</span> Pausar';
    } else if (isPaused) {
        statusIndicator.className = 'status-dot paused';
        statusText.textContent = 'Pausado';
        btnPause.innerHTML = '<span class="icon">&#9654;</span> Reanudar';
    } else {
        statusIndicator.className = 'status-dot';
        statusText.textContent = 'Listo para grabar';
        btnPause.innerHTML = '<span class="icon">&#9208;</span> Pausar';
    }
}

function updateNotesDisplay() {
    if (transcriptSegments.length === 0) {
        notesContent.innerHTML = '<p class="placeholder">La transcripción aparecerá aquí cuando inicies la grabación...</p>';
    } else {
        notesContent.innerHTML = transcriptSegments
            .map(seg => `<p><strong>[${seg.timestamp}]</strong> ${seg.text}</p>`)
            .join('');
        notesContent.scrollTop = notesContent.scrollHeight;
    }

    const totalWords = transcriptSegments.reduce((count, seg) => {
        return count + seg.text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);
    wordCount.textContent = `${totalWords} palabras`;
}

btnStart.addEventListener('click', () => {
    initRecognition();
    startTime = Date.now();
    transcriptSegments = [];
    timerInterval = setInterval(updateTimer, 1000);
    recognition.start();
});

btnPause.addEventListener('click', () => {
    if (!isPaused) {
        recognition.stop();
        isPaused = true;
    } else {
        recognition.start();
        isPaused = false;
    }
    updateUI();
});

btnStop.addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
    }
    isRecording = false;
    isPaused = false;
    clearInterval(timerInterval);
    interimDisplay.textContent = '';
    updateUI();
});

btnClear.addEventListener('click', () => {
    if (confirm('¿Estás seguro de limpiar todas las notas?')) {
        transcriptSegments = [];
        currentSegment = '';
        updateNotesDisplay();
        updateUI();
    }
});

btnPdf.addEventListener('click', () => {
    generatePDF();
});

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const conferenceName = document.getElementById('conference-name').value || 'Sin nombre';
    const date = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const time = new Date().toLocaleTimeString('es-ES');

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    doc.setFillColor(26, 26, 46);
    doc.rect(0, 0, pageWidth, 60, 'F');

    doc.setTextColor(0, 212, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Minutas GARVI', margin, y);
    y += 12;

    doc.setTextColor(160, 160, 176);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${date} - ${time}`, margin, y);
    y += 10;

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(conferenceName, margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Duración total: ${timerDisplay.textContent}`, margin, y);

    y += 15;

    doc.setDrawColor(0, 212, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    doc.setTextColor(26, 26, 46);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Transcripción', margin, y);
    y += 12;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 80);

    const maxWidth = pageWidth - (margin * 2);

    transcriptSegments.forEach((segment, index) => {
        const linePrefix = `[${segment.timestamp}] `;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 150, 200);
        doc.text(linePrefix, margin, y);

        const prefixWidth = doc.getTextWidth(linePrefix);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 60);

        const textLines = doc.splitTextToSize(segment.text, maxWidth - prefixWidth - 5);

        if (y + (textLines.length * 6) > 275) {
            doc.addPage();
            y = 20;
        }

        doc.text(textLines, margin + prefixWidth, y);
        y += (textLines.length * 6) + 4;
    });

    const totalWords = transcriptSegments.reduce((count, seg) => {
        return count + seg.text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);

    if (y > 260) {
        doc.addPage();
        y = 20;
    }

    y += 10;
    doc.setDrawColor(0, 212, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 140);
    doc.text(`Total de palabras: ${totalWords}`, margin, y);
    y += 6;
    doc.text(`Segmentos transcritos: ${transcriptSegments.length}`, margin, y);
    y += 15;

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 170);
    doc.text('Generado por Minutas GARVI - Transcriptor IA', pageWidth / 2, y, { align: 'center' });

    const filename = `minuta-${conferenceName.toLowerCase().replace(/\s+/g, '-')}-${date.replace(/\//g, '-')}.pdf`;
    doc.save(filename);
}
