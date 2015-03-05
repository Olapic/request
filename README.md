# request

## GET

```JavaScript
request.get(url, query, options);
```

```JavaScript
request.get(url, {
	key: 'value'
})
.success(function(response, xhr){
	console.log(response);
})
.error(function(message, xhr){
	console.log(message);
})
.always(function(){
	console.log('always');
});
```

###options.fail_on_404
The default value is `true` which would trigger an error. In case it's being turned off with `false` any *404* response would trigger a success.

## POST

```JavaScript
request.post(url, data, query);
```

```JavaScript
request.post(url, {
	key: 'value'
}, {
	key: 'value'
})
.success(function(response, xhr){
	console.log(response);
})
.error(function(message, xhr){
	console.log(message);
})
.always(function(){
	console.log('always');
});
```

## PUT

```JavaScript
request.put(url, data, query);
```

```JavaScript
request.put(url, {
	key: 'value'
}, {
	key: 'value'
})
.success(function(response, xhr){
	console.log(response);
})
.error(function(message, xhr){
	console.log(message);
})
.always(function(){
	console.log('always');
});
```

## DELETE

```JavaScript
request.delete(url, query);
```

```JavaScript
request.delete(url, {
	key: 'value'
})
.success(function(response, xhr){
	console.log(response);
})
.error(function(message, xhr){
	console.log(message);
})
.always(function(){
	console.log('always');
});
```
