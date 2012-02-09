##immortal-ntwitter

Ntwitter that reconnects following twitter [stream concepts](https://dev.twitter.com/docs/streaming-api/concepts).

###Notes
Had to make a change to ntwitter there is a [pull request](https://github.com/AvianFlu/ntwitter/pull/29) but you can use [my fork](https://github.com/horixon/ntwitter)
 
###Usage
``` var twit = ImmortalNTwitter.create({
      consumer_key:         'CONSUMER_KEY',
      consumer_secret:      'CONSUMER_SECRET',
      access_token_key:     'ACCESS_TOKEN_KEY',
      access_token_secret:  'ACCES_TOKEN_SECRET'
    });

   twit.immortalStream('statuses/sample', null, function(immortalStream) {
       immortalStream.on('data', function(data){
         console.log('immortalData ' + data);
       });         
   });
```

