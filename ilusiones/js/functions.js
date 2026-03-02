function horizontales(){
    const canvas = document.getElementById('canva1');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for(let i = 0; i < canvas.height; i+=10){
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function verticales(){
    const canvas = document.getElementById('canva2');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for(let i = 0; i < canvas.width; i+=10){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    ctx.strokeStyle = 'pink';
    ctx.lineWidth = 1;
    ctx.stroke();
}