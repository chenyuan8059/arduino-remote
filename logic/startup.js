var SerialPort = require('../node_modules/serialport');
var arduinoport;

function portready(p) {
  $('.app-intro').addClass('animated fadeOut');
  $('.onready').show();
  $('#info-port').text(p);
  $('.app-intro').hide();
}

function getConnectedArduino() {
  $('#searchProcess').empty()
  SerialPort.list(function(err, ports) {
    var allports = ports.length;
    var count = 0;
    var done = false
    ports.forEach(function(port) {
      count += 1;
      pm = port['manufacturer'];
      if (typeof pm !== 'undefined' && pm.includes('arduino')) {
        arduinoport = port.comName.toString();
        var serialPort = require('../node_modules/serialport');
        sp = new serialPort(arduinoport, {
          buadRate: 9600
        })
        sp.on('open', function() {
          portready(arduinoport)
        })
        sp.on('close', function (err) {
          alert('i think you disconnected the arduino!');
          window.location.reload()
        })
        done = true;
      }
      if (count === allports && done === false) {
        if (confirm('can\'t find arduino, please make sure you installed it\'s drivers by downloading arduino app from the offical website, press ok to go to the website')) {
          require('nw.gui').Shell.openExternal('https://www.arduino.cc/en/Main/Software');
        };
      }
    });

  });
}

function send(data) {
  sp.write(data.toString())

}
$('#listenbtn').on('click', function() {
  $('#listenbtn').addClass('disabled');
  $('#listenbtn').text('lesting...')
  sp.on('data', function(data) {
    $('#serialogplaceholder').hide()
    $('#serialog').append(data + '<br>')
  })
})

function clearlog() {
  $('#serialog').empty()
}
