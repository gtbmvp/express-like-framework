# express-like framework

CRUD posts with express-like wrapper around http and events modules.

- **Router.js** saves routes and its handlers (_endpoints_ object);
- **Server.js**
  - for each endpoint in _endpoints_ object registers its handler to `[${path}]:[${method}]` event;
  - on request: executes all middlewares and emits `[${path}]:[${method}]` event;
- **writeHead.js** adds `send` method to response in _JSON_ (`res.writeHead` + `res.end`);
- **parseReqBody.js** parses _JSON_ and adds it to `body` property in `request` object;
- **parseURL.js** parses URL and adds `pathname` and `query` properties in `response` object.

**Execution explanation in details (in Russian)**

1. `const server = new Server()` создает в своем конструкторе this.emitter, запускает метод `_createServer` и инициализирует пустой массив `middlewares`;
2. метод `_createServer` возвращает `http.createServer`, который запускает все middlewares:

- `writeHead` - изменяет объект res (+send):
  у объекта res создает метод `send` (которого нет в модуле _http_), который обьединяет `res.writeHead` и `res.end` => ответ через `send` будет в JSON формате с правильным _Content-Type_;
- `parseURL` - изменяет объект req (+pathname, +query):
  чтобы вычленить из `req.url`параметры query создаем объект URL из`req.url`и`baseURL`, который передаем явно в метод `use`; в объекте `req` создаем свойство `pathname`, полученное из парсинга объекта `URL` и свойство `query`, которое содержит объект с query параметрами из объекта `URL`;
- `parseReqBody` - изменяет объект req (+body):
  `request` это readable stream, следовательно чтобы перевести его в _flowing mode_ необходимо подписаться на событие _data_, в обработчике этого события по мере поступления chunk-ов запроса они суммируется в переменную `body`. При окончании запроса (событие _end_) из итоговой строки в body записываем объект в `req.body = JSON.parse(body)` и вызываем `resolve`; все это обёрнуто в промис.

3. Ждем через _await_ выполнение всех middleware прежде чем `this.emitter` эмитит событие вида `[path]:[method]` и передает в подписанный на это событие обработчик объекты `req` и `res`. Если `emitted` возвращает `false`, то у такого события не существует listeners и закрываем запрос `res.end()`, чтобы браузер не висел;
4. `server.addRouter(postRouter)` для каждого пути в объекте `endpoints` роутера `postRouter` и для каждого метода в этом пути создает обработчик события вида `[path]:[method]`, который принимает объекты `req` и `res` и передает в обработчик, указанный в объекте `endpoints[path][method]`;
5. `postRouter` это экземпляр созданного нами класса `Router`, который инициализирует пустой объект `this.endpoints` и использует методы для заполнения этого объекта до вида:

```
{
   "/posts": {
        "GET": getPost,
        "POST": createPost,
        "PUT": updatePost,
        "DELETE": deletePost
        }
   }
}
```

6. В `postRouter` как раз описаны четыре эндпоинта, объект выше. Соответственно пункт 4, `addRouter` назначает обработчики `getPost, createPost, updatePost, deletePost` соответствующего события `[path]:[method]`, а `emitter` передает в них объекты `req` и `res`. Эти обработчики, используя модель `Post`, получают необходимые данные и отправляет `res.send(data)`.
