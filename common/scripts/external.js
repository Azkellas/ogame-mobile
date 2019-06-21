function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function ex() {
    const colors = ['blue','blue', 'blue'];
    rand = getRandomInt(3);
    const color = colors[rand];
    var interval = setInterval(() => {
        const body = $('body');
        if (body.length) {
            document.body.style.color = color;
            clearInterval(interval);
        }
    }, 10);
}
