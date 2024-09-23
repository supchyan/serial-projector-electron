const { SerialPort, ReadlineParser } = require('serialport');
const sendToast = require('./toast');
const data_container = document.getElementById('data_container');

let serialport;

function readPort(serialport) {
    port_btn.innerText = 'Close port';

    const parser = serialport.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    parser.on('data', data => {
        data_container.innerText = `${data}`;
    });
}

SerialPort.list().then((ports) => {
    console.log(ports);
});

function openPort(baudRate, portPath) {
    SerialPort.list().then((ports) => {
        if (ports.length == 0) return sendToast("Existing ports hasn't been detected.");

        if(serialport && serialport.isOpen) {
            port_btn.innerText = 'Open port';
            return serialport.close((e) => {
                sendToast(e == null ? `Port [${portPath}] has been closed.` : e);
            });
        }
        
        ports.forEach((port, i) => {
            if (port.path == portPath) {
                sendToast(`Openning ${portPath}...`);
                
                serialport = new SerialPort({
                    path: portPath,
                    baudRate: baudRate,
                    autoOpen: false
                });

                serialport.open((e) => sendToast(e == null ? `Done! Listening port: [${portPath}]` : e));

                return readPort(serialport);
            }
        });

        return sendToast(`Chosen port hasn't been detected.`);
    });
}

const baud_rate_input = document.getElementById('baud_rate_input');
const port_path_input = document.getElementById('port_path_input');
const port_btn = document.getElementById('port_btn');

baud_rate_input.addEventListener("keydown", (event) => {
    if(event.key == 'Enter') {
        parseBaudInput();
    }
});
port_path_input.addEventListener("keydown", (event) => {
    if(event.key == 'Enter') {
        parseBaudInput();
    }
});
port_btn.onclick = () => {
    parseBaudInput();
};

function parseBaudInput() {
    if (baud_rate_input.value == '') {
        return sendToast('You have to set baud rate.');
    }
    if (port_path_input.value == '') {
        return sendToast('You have to set port path. (COM1 / COM2 / etc.)');
    }
    openPort( parseInt(baud_rate_input.value, 10), port_path_input.value );
}