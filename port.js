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

function openPort(baudRate) {
    SerialPort.list().then((ports) => {
        if (ports.length == 0) return sendToast("Existing ports hasn't been detected.");

        if(serialport && serialport.isOpen) {
            port_btn.innerText = 'Open port';
            return serialport.close((e) => {
                sendToast(e == null ? `Port [${ports[0].path}] has been closed.` : e);
            });
        }
        
        ports.forEach((port, i) => {
            if (i == 0) {
                sendToast(`Openning ${port.path}...`);
                
                serialport = new SerialPort({
                    path: port.path,
                    baudRate: baudRate,
                    autoOpen: false
                });

                serialport.open((e) => sendToast(e == null ? `Done! Listening port: [${port.path}]` : e));

                return readPort(serialport);
            }
        });
    });
}

const baud_rate_input = document.getElementById('baud_rate_input');
const port_btn = document.getElementById('port_btn');

port_btn.onclick = () => {
    if (baud_rate_input.value == '') {
        return sendToast('You have to set baud rate.');
    }
    openPort( parseInt(baud_rate_input.value, 10) );
};