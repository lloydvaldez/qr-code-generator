// Stored variables from element ids
const light = document.querySelector('.light')
const dark = document.querySelector('.dark')
const qrText = document.getElementById('qr-text')
const qrContainer = document.getElementById('qr-code')
const download = document.getElementById('download')
const share = document.getElementById('share')

// Event listeners
light.addEventListener('input', handleLightColor)
dark.addEventListener('input', handleDarkColor)
qrText.addEventListener('input', handleQRText)
share.addEventListener('click', handleShare)

// Defaults
const defaultUrl = 'https://google.com/'
let colorLight = '#FFF',
    colorDark = '#000',
    text = defaultUrl,
    size = 500

// Handles the light color selection
function handleLightColor(e) {
    colorLight = e.target.value
    generateQRCode()
}

// Handles the dark color selection
function handleDarkColor(e) {
    colorDark = e.target.value
    generateQRCode()
}

// Handles the QR text input
function handleQRText(e) {
    const value = e.target.value
    text = value
    if (!value) {
        text = defaultUrl
    }
    generateQRCode()
}

// Generates QR code
async function generateQRCode() {
    qrContainer.innerHTML = ''
    new QRCode('qr-code', {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark
    })
    download.href = await resolveDataUrl()
}

// Share button function
async function handleShare() {
    setTimeout(async () => {
        try {
            const base64url = await resolveDataUrl()
            const blob = await (await fetch(base64url)).blob()
            const file = new File([blob], 'QRCode.png', {
                type: blob.type
            })
            await navigator.share({
                files: [file],
                title: text
            })
        } catch (error) {
            alert("Your browser doesn't support sharing.")
        }
    }, 100)
}

// Creates url
function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector('#qr-code img')
            if (img.currentSrc) {
                resolve(img.currentSrc)
                return
            }
            const canvas = document.querySelector('canvas')
            resolve(canvas.toDataURL())
        }, 50)
    })
}

generateQRCode()