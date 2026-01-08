const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const qrContainer = document.getElementById('qrContainer');
const qrcodeElement = document.getElementById('qrcode');
const actionsConfig = document.getElementById('actions');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');

let qrCodeObj = null;

function generateQR() {
    const url = urlInput.value.trim();
    if (!url) return;

    qrcodeElement.innerHTML = '';
    qrContainer.classList.remove('hidden');
    actionsConfig.classList.remove('hidden');

    qrCodeObj = new QRCode(qrcodeElement, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    setTimeout(() => {
        const qrImage = qrcodeElement.querySelector('img');
        if (qrImage) {
            qrImage.style.display = 'block';
        }
    }, 50);
}

generateBtn.addEventListener('click', generateQR);

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQR();
    }
});

downloadBtn.addEventListener('click', () => {
    const qrImage = qrcodeElement.querySelector('img');
    if (qrImage) {
        const link = document.createElement('a');
        link.href = qrImage.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

shareBtn.addEventListener('click', async () => {
    const qrImage = qrcodeElement.querySelector('img');
    if (qrImage && navigator.share) {
        try {
            const res = await fetch(qrImage.src);
            const blob = await res.blob();
            const file = new File([blob], 'qrcode.png', { type: 'image/png' });

            await navigator.share({
                title: 'QR Code',
                text: 'Check out this QR code!',
                files: [file]
            });
        } catch (err) {
            console.error('Error sharing:', err);
            if (urlInput.value) {
                navigator.clipboard.writeText(urlInput.value);
                alert('Link copied to clipboard!');
            }
        }
    } else {
        if (urlInput.value) {
            navigator.clipboard.writeText(urlInput.value);
            alert('Link copied to clipboard!');
        }
    }
});
