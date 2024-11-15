const clipButton = document.getElementById('clip-bttn');
const fileInput = document.getElementById('file-input');
const modalContainer = document.getElementById('modal-container');
const imagePreview = document.getElementById('image-preview');
const sendImageButton = document.getElementById('send-image-bttn');
const changeImageButton = document.getElementById('change-image-bttn');
const closeModalButton = document.getElementById('close-bttn');

import { socket } from './script.js';

clipButton.addEventListener('click', () => {
    fileInput.click();
});

let fileToSend = null;

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        fileToSend = file;
        const reader = new FileReader();

        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            modalContainer.style.display = 'flex'; 
        };

        reader.readAsDataURL(file);
    }
});

sendImageButton.addEventListener('click', () => {
    if (fileToSend && socket.readyState == WebSocket.OPEN) {
        const reader = new FileReader();

        reader.onload = ()=> {
            const arrayBuffer = new Uint8Array(reader.result);
            socket.send(arrayBuffer);

            modalContainer.style.display = 'none';
            fileInput.value = '';
            fileToSend = null;
        };
        reader.readAsArrayBuffer(fileToSend);
    } else {
        alert("Not successfull");
    }
});

changeImageButton.addEventListener('click', () => {
    fileInput.click(); 
});

closeModalButton.addEventListener('click', () => {
    modalContainer.style.display = 'none';
    fileInput.value = ''; 
});


