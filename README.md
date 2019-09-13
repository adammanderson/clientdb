### CLIENT DB

This package gives you possibility to create your own client database and work with it.
All what you need, create new instance of this and use it throw your app.

```js
import ClientDB from 'clientdb';

const YOUR_DB_NAME_HERE = new ClientDB();
```

Then you need to create collection of data:

```js
YOUR_DB_NAME_HERE.createCollection('some_collection_name');
```

If by some reason you will need to remove it use:

```js
YOUR_DB_NAME_HERE.createCollection('some_collection_name');
```

#### Collections:

You need add data to the collection so:

```js
YOUR_DB_NAME_HERE.some_collection_name.add('object_here');
```
Return:
```js
{ docs: ['docs_with_added_data'] }
```

```js
YOUR_DB_NAME_HERE.some_collection_name.bulkAdd('array_here');
```
Return:
```js

{ 
  docs: ['docs_with_added_data'],
  status: 'success'
}
```
In case if you use `bulkAdd` and some of added data already exists at the store, will be added only uniq data, and you will get next response: 

```js
{
  added: ['added_data'],
  docs:  ['docs_with_updated_data'],
  status: 'added with warnings',
  warning: 'Some data was not added because it is already in collection'
}
```


For updating use:

```js
    YOUR_DB_NAME_HERE.some_collection_name.update('object_here');
    YOUR_DB_NAME_HERE.some_collection_name.bulkUpdate('array_here');
```

Responses will be same as during creation but with corrected error messages.

Sometimes you need add some data and update existed data, but not remove else data. For this you can use:

```js
YOUR_DB_NAME_HERE.some_collection_name.upsert('object_here');
```
Return:
```js

{ docs: ['docs_with_new data_data'] }
```

```js
YOUR_DB_NAME_HERE.some_collection_name.bulkUpsert('array_here');
```
Both methods will return:
```js

{ 
  docs: ['docs_with_updated_data'],
  status: 'success'
}
```

Data from collections could be get by 2 methods.

```js
YOUR_DB_NAME_HERE.some_collection_name.getAll();
YOUR_DB_NAME_HERE.some_collection_name.where({ 'filter options here' });
```
These methods are start of chain. But if you want to finish it use `exec()`. It will return Promise with data.

```js
YOUR_DB_NAME_HERE.some_collection_name.getAll().exec().then( data => { /** ... */ } );
YOUR_DB_NAME_HERE.some_collection_name.where({ 'filter options here' }).exec().then( data => { /** ... */ } );
```

#### Collection chain's

Between `getAll` and `exec` could be used chain methods:

- sort - this method is sorting data by fields at the array. At the second argument ( this is optional ) you could describe direction of sorting `desc` or `asc` for fields one by one;
- limit - this method will return only number of arguments according with a didgit at the arguments.
- offset - this is helper for `limit` method and it takes in argument from where limit should count elements. It should be executed before `limit`.