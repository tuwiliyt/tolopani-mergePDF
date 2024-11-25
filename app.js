async function mergePDFs() {
    const pdfFiles = [
        document.getElementById('pdfFile1').files[0],
        document.getElementById('pdfFile2').files[0],
        document.getElementById('pdfFile3').files[0],
        document.getElementById('pdfFile4').files[0]
    ];

    const selectedFiles = pdfFiles.filter(file => file != undefined);

    if (selectedFiles.length < 2) {
        document.getElementById('status').innerText = 'Unggah minimal 2 file PDF.';
        return;
    }

    document.getElementById('progressBarContainer').style.display = 'block';

    const pdfLib = window.PDFLib;
    const pdfDoc = await pdfLib.PDFDocument.create();
    let fileCount = selectedFiles.length;
    let currentFileIndex = 0;

    for (const file of selectedFiles) {
        await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async function(event) {
                try {
                    const existingPdfBytes = event.target.result;
                    const existingPdfDoc = await pdfLib.PDFDocument.load(existingPdfBytes);
                    const copiedPages = await pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
                    copiedPages.forEach((page) => {
                        pdfDoc.addPage(page);
                    });

                    currentFileIndex++;
                    const progress = (currentFileIndex / fileCount) * 100;
                    document.getElementById('progressBarFill').style.width = `${progress}%`;

                    resolve();
                } catch (error) {
                    console.error("Error processing file:", error);
                    reject(error);
                }
            };

            reader.onerror = function(error) {
                console.error("Error reading file:", error);
                reject(error);
            };

            reader.readAsArrayBuffer(file);
        });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gabungan.pdf';
    link.click();

    document.getElementById('status').innerText = 'File PDF berhasil digabungkan!';
    document.getElementById('progressBarContainer').style.display = 'none';
}

function clearFiles() {
    document.getElementById('pdfFile1').value = '';
    document.getElementById('pdfFile2').value = '';
    document.getElementById('pdfFile3').value = '';
    document.getElementById('pdfFile4').value = '';
    document.getElementById('status').innerText = '';
    document.getElementById('progressBarFill').style.width = '0%';
    document.getElementById('progressBarContainer').style.display = 'none';
}
