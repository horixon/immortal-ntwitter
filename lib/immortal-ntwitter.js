var util = require('util'), 
    EventEmitter = require('events').EventEmitter, 
    Ntwitter = require('ntwitter');

function ImmortalStream()
{
  EventEmitter.call(this);
  
  this.httpErrorSleepRange = {
    min:     10000,
    max:     320000,
    current: 10000}

  this.networkErrorSleepRange = {
    min:     250,
    max:     16000,
    current: 250}
}
util.inherits(ImmortalStream, EventEmitter);

ImmortalStream.create = function()
{
  return new ImmortalStream();
}

ImmortalStream.prototype.resetSleeps = function(){
  this.httpErrorSleepRange.current = this.httpErrorSleepRange.min;
  this.networkErrorSleepRange.current = this.networkErrorSleepRange.min;
}

ImmortalStream.prototype.httpErrorSleep = function( range, callback ){
  console.log('sleep init');
  var self = this;
  self.sleepAndBackOff(range.current,  function(){
    self.exponentialBackOff(range)
  }, callback); 
} 

ImmortalStream.prototype.tcpipErrorSleep = function(range, callback ){
  var self = this;
  self.sleepAndBackOff(range.current,  function(){
    self.linearBackOff(range);
  }, callback);
}

ImmortalStream.prototype.linearBackOff = function(range){
  if(range.current < range.max)
    range.current = range.current + range.min;
}

ImmortalStream.prototype.exponentialBackOff = function(range){
  if(range.current < range.max)
    range.current = range.current * 2;   
}

ImmortalStream.prototype.sleepAndBackOff = function(delay, backOff, callback ){
  setTimeout( function(){
    backOff();
    callback();
  }, delay); 
}


function ImmortalNTwitter(options)
{
  Ntwitter.call(this, options);
}

util.inherits(ImmortalNTwitter, Ntwitter);

ImmortalNTwitter.prototype.immortalStream = function(method, params, callback) {

  var self = this;
  var immortalStream = ImmortalStream.create();

  immortalStream.resurrectStream = function()
  {
    self.stream(method, params, function(stream){
      stream
      .on('error', function(error){
        if( error != 'http'){
          console.log('tcp/ip' + error + ' sleep ' + immortalStream.networkErrorSleepRange.current);
          immortalStream.tcpipErrorSleep(immortalStream.networkErrorSleepRange, function(){ 
            immortalStream.resurrectStream(); 
          });  
        }else {
          console.log('http ' + error + ' sleep ' + immortalStream.httpErrorSleepRange.current);
          immortalStream.httpErrorSleep(immortalStream.httpErrorSleepRange, function(){ 
            immortalStream.resurrectStream();
          });
        }
      })
      .on('destroy',function(){
        immortalStream.resetSleeps();
        immortalStream.resurrectStream();
      }).on('end', function(){
        immortalStream.resetSleeps();
        immortalStream.resurrectStream();  
      })
      .on('data', function(data){
       immortalStream.emit('data',data);
      });
    });
  }

  callback(immortalStream);     
  immortalStream.resurrectStream();

  return this;
}

ImmortalNTwitter.create = function( options ){
  return new ImmortalNTwitter( options );
}

module.exports = ImmortalNTwitter;
