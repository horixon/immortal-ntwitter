##immortal-ntwitter

[Ntwitter](https://github.com/AvianFlu/ntwitter) that reconnects following twitter [stream concepts](https://dev.twitter.com/docs/streaming-apis/connecting).

###Usage
``` 
var twit = ImmortalNTwitter.create({
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

