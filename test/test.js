var Ntwitter = require('ntwitter')
, ImmortalNTwitter = require('../lib/immortal-ntwitter')
, EventEmitter = require('events').EventEmitter
, Assert = require('assert');

describe('ImmortalNTwitter', function(){
	
	var twit = ImmortalNTwitter.create({
      consumer_key:         null,
      consumer_secret:      null,
      access_token_key:     null,
      access_token_secret:  null
    });

    describe('mock an Ntwitter stream', function(){ 

    	var mockStream;

    	beforeEach(function(){
    		mockStream = new EventEmitter();
    		mockStream.destroySilent = function(){};

    		twit.stream = function(method, params, callback){
				callback(mockStream);
				return mockStream;
			}
		})

		describe('#immortalStream()', function(){
		    it('should emit data', function(done){

				twit.immortalStream('statuses/sample', null, function(immortalStream) {    
					immortalStream.on('data', function(data){
				  		done();
				  	});
				});
			
				mockStream.emit('data', {});
		    })
		    it('should resurrect on an unknown error', function(done){
				
				twit.immortalStream('statuses/sample', null, function(immortalStream) {});
				twit.stream = function(){
					done();
					return null;
				}
				
				mockStream.emit('error', null);	
		    })
		    it('should resurrect on an http error', function(done){
		    	
		    	this.timeout(10001);
		    	twit.immortalStream('statuses/sample', null, function(immortalStream) {});
				twit.stream = function(){
					done();
					return null;
				}
				
				mockStream.emit('error', 'http');	
		    })
		    it('should resurrect on an Ntwitter destroy', function(done){
		    	
		    	twit.immortalStream('statuses/sample', null, function(immortalStream) {});
				twit.stream(null, null,function(){done()}) ;
				
				mockStream.emit('destroy', null);	
		    })

		    it('should resurrect on an Ntwitter end', function(done){
		    	
		    	twit.immortalStream('statuses/sample', null, function(immortalStream) {});
				twit.stream(null, null,function(){done()}) ;
					
				mockStream.emit('end', null);	
		    })

		    it('can be destroyed', function(done){
		    	
		    	var stream;
		    	twit.immortalStream('statuses/sample', null, function(immortalStream) {
		    		immortalStream.on('data', function(data){
				  		throw new Error("stream destroyed shouldn't recieve data");
				  	});
					stream = immortalStream;  	
		    	});
		    	stream.destroy();
		    	Assert(!stream.stream);
				mockStream.emit('data', {});
				done();	
		    })
		    it('should resurrect on error', function(done){
		    	
		    	var reconnects = 0;
		    	twit.stream = function(method, params, callback){
					
					if(reconnects > 2)
					{
						done();
					}
					callback(mockStream);
					mockStream.emit('error',null);
					reconnects++;
					return mockStream;
				}

				twit.immortalStream('statuses/sample', null, function(immortalStream) {});
		    })

		  })
	})
});
