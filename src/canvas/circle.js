export const useCircle = (canvas) => {
    const ctx = canvas.getContext('2d');
    //INICIO
    function init(){
        canvas.width = 100;
        canvas.height = 100;
    }
    init()
    //ACTUALIZAR
    const numberOfRings = 3;
    const ringRadiusOffSet = 7;
    const ringRadius =20;
    const waveOfSet = 20;
    const colors = [`#ffffff`, `#000000`, `#ffffff`]
    //ANGULOS
    let startAngle = 0;

    function updateRing(){
        for(let i = 0; i < numberOfRings ; i++){
            const radius = i * ringRadiusOffSet + ringRadius
            const offSetAngle = i * waveOfSet * Math.PI / 180;
            drawRing(radius, colors[i], offSetAngle)
        }
        startAngle >= 360 ? startAngle = 0 : startAngle ++
    }

    //DIBUJAR
    //CANTRAR
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    //waves , amplitud , ring radius 
    const maxWaveAmplitud = 7;
    const numberOfWaves = 7;
   

    function drawRing(radius, colors, offSetAngle){
        if(ctx != undefined){
            ctx.strokeStyle = colors;
            ctx.lineWidth = 5; 
        }
        //
        ctx?.beginPath();
        //ctx?.moveTo(centerX, centerY);
        // 
        for(let j = -180; j < 180; j++){
            const currentAngle = (j + startAngle) * Math.PI / 180;
            let displacement = 0;
            const now = Math.abs(j);

            if(now > 70){
                displacement= (now - 70) / 70;
            }
            if(displacement>=1){
                displacement=1
            }
            const waveAmplitud = radius + displacement * Math.sin((currentAngle + offSetAngle) * numberOfWaves) * maxWaveAmplitud;
            const x = centerX + Math.cos(currentAngle) *  waveAmplitud;
            const y = centerY + Math.sin(currentAngle) * waveAmplitud;
            j > -180 ? ctx?.lineTo(x, y) : ctx?.moveTo(x, y);
        }
        ctx?.closePath();
        ctx?.stroke();
    }
    
    //MOVIMIENTO 
    function loop(){
        canvas.width |= 0;
        updateRing()
        requestAnimationFrame(loop)
    }
    loop();

    window.addEventListener('resize', init())
}