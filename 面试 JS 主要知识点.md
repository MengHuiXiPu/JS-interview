# 面试 JS 主要知识点

- 基本类型和引用类型
- 类型判断
- 强制类型转换
- 作用域
- 执行上下文
- 理解函数的执行过程
- this 指向
- 闭包
- 原型和原型链
- js 的继承
- event loop



## 基本类型和引用类型

js中数据类型分为基本类型和引用类型，基本类型有六种：

- `number`
- `string`
- `boolean`
- `null`
- `undefined`
- `symbol` （es6）

引用类型包括对象`object`、数组`array`、函数`function`等，统称对象类型：

- `object`

`string`类型即字符串，除了单引号双引号，es6 中引入了新的反引号 ` ` 来包含字符串。反引号的扩展功能是可以用`${…}`将变量和表达式嵌入到字符串中。使用如下：

```
let n = 3
let m = () => 4
let str = `m + n = ${m() + n}` // "m + n = 7"
```

`number`类型值包括整数、浮点数、`NaN`、`Infinity`等。其中`NaN`类型是js中唯一不等于自身的类型，当发生未定义的数学操作的时候，就会返回`NaN`，如：`1+'asdf'`、`Number('asdf')`。浮点数的运算可能会出现如`0.1 + 0.2 !== 0.3`的问题，这是由于浮点运算的精度的问题，一般采用`toFixed(10)`便可以解决此类问题。

`boolean`、`string`和`number`类型作为基本类型，按理说应该是没有函数可以调用的，因为基本类型没有原型链可以提供方法。但是，这三种类型却能调用`toString`等对象原型上的方法。不信？

```
true.toString() // 'true'
`asdf`.toString() // 'asdf'
NaN.toString() // 'NaN'
```

你可能会说，那为什么数字`1`不能调用`toString`方法呢？其实，不是不能调用：

```
1 .toString()
1..toString()
(1).toString()
```

以上三种调用都是可以的，数字后面的第一个点会被解释为小数点，而不是点调用。只不过不推荐这种使用方法，而且这样做也没什么意义。

为什么基本类型却可以直接调用引用类型的方法呢？其实是js引擎在解析上面的语句的时候，会把这三种基本类型解析为**包装对象**（就是下面的`new String()`），而包装对象是引用类型可以调用`Object.prototype`上的方法。大概过程如下：

```
'asdf'.toString()  ->  new String('asdf').toString()  -> 'asdf'
```

`null`含义为“无”、“空”或“值未知”的特殊值。

`undefined`的含义是“未被赋值”。除了变量已声明未赋值的情况下是`undefined`，若对象的属性不存在也是`undefined`。所以应该尽量避免使用`var a = undefined; var o = {b: undefined}`这样的写法，取而代之用`var a = null; var o = {b: null}`，以与“未被赋值”默认`undefined`的情况相区分。

`Symbol`值表示唯一的标识符。可以用`Symbol()`函数创建：

```
var a = Symbol('asdf')
var b = Symbol('asdf')
a === b // false
```

还可以创建全局标识符，这样可以在访问相同的名称的时候都得到同一个标识符。如下：

```
var a = Symbol.for('asdf')
var b = Symbol.for('asdf')
a === b // true
```

还可以用做对象的属性，但此时是不能被`for...in`遍历的：

```
let id = Symbol('id')
let obj = {
  [id]: 'ksadf2sdf3lsdflsdjf090sld',
  a: 'a',
  b: 'b'
}
for(let key in obj){ console.log(key) } // a b
obj[id] // "ksadf2sdf3lsdflsdjf090sld"
```

还存在很多系统内置的`Symbol`，如`Symbol.toPrimitive` `Symbol.iterator` 等。当发生引用类型强制转基本类型的操作时，就会触发内置的`Symbol.toPrimitive`函数，当然也可以给对象手动添加`Symbol.toPrimitive`函数来覆盖默认的强制类型转换行为。

`object`是引用类型，引用类型和基本类型不同的是，原始类型存储的是值，引用类型存储的是一个指向对象真实内存地址的指针。在 js 中，对象包括`Array Object Function RegExp Math`等。

js 所有的函数语句都是在执行栈中执行的，所有的变量也在执行栈中保存着值或引用。基本类型就存储在栈内存中，保存的是实际值；引用类型存储在堆内存中，在栈中只保存着变量指向内存地址的指针。

![图片](https://mmbiz.qpic.cn/mmbiz_png/C94aicOicyXpJ51l1xicF3Dbp8GdRocTRhiabNNaf39YOjjdsaWr6g8vLtT0Y1bum1ibdLDloDGIn7pohBVcRWvo1gg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

```
var o = {
  a: 'a',
  b: 'b'
}
var o2 = o // 变量o2复制了变量o的指针，现在他们都指向同一个内存地址，现在开始他们的增删改其实是在同一个内存地址上的操作
o2.c = 'c' // （增）现在o.c也是'c'
delete o2.b // （删）现在o.b也不存在了
o2.a = 'a2' // (改)现在o.a也是'a2'
o2 = 'o2' // 现在变量o2被赋值'o2'，已经和原来的内存地址断绝了关系，但变量 o 仍然指向老地址
```



## 类型判断

判断引用类型和基本类型的类型是不同的，判断基本类型可以用`typeof`：

```
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof null // 'object'
```

可以看到除了`null`其他基本类型的判断都是正常的，`typeof(null) === 'object'`是一个历史悠久的 bug，就是在 JS 的最初版本中`null`的内存存储信息是`000`开头的，而`000`开头的会被判断为`object`类型。虽然现在内部类型判断代码已经改变了，但是这个 bug 却不得不随着版本保留了下来，因为修改这个 bug 会导致巨多的网站出现 bug 。

`typeof`对引用类型，除了函数返回`function`，其他都返回`object`。但我们开发中数组肯定是要返回`array`类型的，所以`typeof`对引用类型来说并不是很适用。判断引用类型一般用`instanceof`：

```
var obj = {}
var arr = []
var fun = () => {}
typeof obj // 'object'
typeof arr // 'object'
typeof fun // 'function'
obj instanceof Object // true
arr instanceof Array // true
fun instanceof Function // true
```

可以看到`instanceof`操作符可以正确判断出引用类型的类型。`instanceof`本质上是判断右边的构造函数的`prototype`对象是否存在于左边的原型链上，是的话返回true。所以不论数组、对象还是函数，`... instanceof Object`都返回`true`。

最后来一种全能型判断类型方法：`Object.prototype.toString.call(...)`，可以自行尝试。



## 强制类型转换

JS 是弱类型语言，不同类型之间在一定情况下会发生强制类型转换，比如在相等性比较的时候。

基本类型的相等性比较的是值是否一样，对象相等性比较的是内存地址是否相同。下面来看一个有意思的比较把：

```
[] == [] // ?
[] == ![] // ?
```

对于`[]` `{}` `function (){}`这样的没有被赋值给变量的引用类型来说，他们只在当前语句中有效，而且不相等于其他任何对象。因为根本无法找到他们的内存地址的指针。所以`[] == []`是`false`。

对于`[] == ![]`，因为涉及到强制类型转换，所以复杂的多了。想要更加详细了解强制类型转换可以看我这篇文章 。

在 JS 中类型转换只有三种情况：`toNumber` 、 `toString` 、 `toBoolean` 。正常情况下转换规则如下：

|原始值/类型|目标类型：number|结果|
|-|-|-|-|
|null|number|`0`|
|symbol|number|抛错|
|string|number|`'1'=>1` `'1a'=>NaN` ，含非数字则为`NaN`|
|数组|number|`[]=>0` `['1']=>1` `['1', '2']=>NaN`|
|object/function/undefined|number|`NaN`|

|原始值/类型|目标类型：string|结果|
|-|-|-|-|
|number|string|`1=>'1'`|
|array|string|`[1, 2]=>'1,2'`|
|布尔值/函数/symbol|string|原始值直接加上引号，如：`'true'`|
|object|string|`{}=>'[object Object]'`|

|原始值/类型|目标类型：boolean|结果|
|-|-|-|-|
|number|boolean|除了`0`、`NaN`为`false`，其他都是`true`|
|string|boolean|除了空字符串为`false`，其他都为`true`|
|null/undefined|boolean|false|
|引用类型|boolean|true|

现在来揭开 `[] == ![]` 返回`true`的真相把：

```
[] == ![] // true
/*
 * 首先，布尔操作符!优先级更高，所以被转变为：[] == false
 * 其次，操作数存在布尔值false，将布尔值转为数字：[] == 0
 * 再次，操作数[]是对象，转为原始类型（先调用valueOf()，得到的还是[]，再调用toString()，得到空字符串''）：'' == 0
 * 最后，字符串和数字比较，转为数字：0 == 0
*/
NaN == NaN // false     NaN不等于任何值
null == undefined // true
null == 0 // false
undefined == 0 // false
```



## 作用域

js 中的作用域是词法作用域，是由 **函数声明时** 所在的位置决定的。词法作用域是指在编译阶段就产生的，一整套函数标识符的访问规则。说到底js的作用域只是一个“空地盘”，其中并没有真实的变量，但是却定义了变量如何访问的规则。（词法作用域是在编译阶段就确认的，区别于词法作用域，动态作用域是在函数执行的时候确认的，js的没有动态作用域，但js的`this`很像动态作用域，后面会提到。语言也分为静态语言和动态语言，静态语言是指数据类型在编译阶段就确定的语言如 java，动态语言是指在运行阶段才确定数据类型的语言如 javascript。）

作用域链本质上是一个指向变量对象的指针列表，它只引用不包含实际变量对象，是作用域概念的延申。作用域链定义了在当前上下文访问不到变量的时候如何沿作用域链继续查询变量的一套规则。



### 执行上下文：

执行上下文是指 **函数调用时** 在执行栈中产生的变量对象，这个变量对象我们无法直接访问，但是可以访问其中的变量、`this`对象等。例如：

```
let fn, bar; // 1、进入全局上下文环境
bar = function(x) {
  let b = 5;
  fn(x + b); // 3、进入fn函数上下文环境
};
fn = function(y) {
  let c = 5;
  console.log(y + c); //4、fn出栈，bar出栈
};
bar(10); // 2、进入bar函数上下文环境
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/C94aicOicyXpJ51l1xicF3Dbp8GdRocTRhiaKdVoVibXOXYcSB2iaS5brlEX2ooPpHPPZ1oVxS7ic4H38MV3ZUSTcrMrA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

每次函数调用时，执行栈栈顶都会产生一个新的执行上下文环境，JavaScript引擎会以栈的方式来处理它们，这个栈，我们称其为函数调用栈(call stack)。栈底永远都是全局上下文，而栈顶就是当前处于活动状态的正在执行的上下文，也称为活动对象（running execution context，图中蓝色的块），区别与底下被挂起的变量对象（执行上下文）。



## 理解函数的执行过程

函数的执行过程分成两部分，一部分用来生成执行上下文环境，确定this的指向、声明变量以及生成作用域链；另一部分则是按顺序逐行执行代码。

建立执行上下文阶段：(发生在 函数被调用时 && 函数体内的代码执行前 )

1. 生成**变量对象**，顺序：创建 arguments 对象 --> 创建function函数声明 --> 创建var变量声明
2. 生成作用域链
3. 确定this的指向

函数执行阶段：

1. 逐行执行代码，这个阶段会完成变量赋值，函数引用，以及执行其他代码。



## this 指向

```
let fn = function(){
  alert(this.name)
}
let obj = {
  name: '',
  fn
}
fn() // 方法1
obj.fn() // 方法2
fn.call(obj) // 方法3
let instance = new fn() // 方法4
```

1. 方法1中直接调用函数`fn()`，这种看着像光杆司令的调用方式，`this`指向`window`（严格模式下是`undefined`）。
2. 方法2中是点调用`obj.fn()`，此时`this`指向`obj`对象。点调用中`this`指的是点前面的对象。
3. 方法3中利用`call`函数把`fn`中的`this`指向了第一个参数，这里是`obj`。即利用`call`、`apply`、`bind`函数可以把函数的`this`变量指向第一个参数。
4. 方法4中用`new`实例化了一个对象`instance`，这时`fn`中的`this`就指向了实例`instance`。

如果同时发生了多个规则怎么办？其实上面四条规则的优先级是递增的：

> ```
> fn() < obj.fn() < fn.call(obj) < new fn()
> ```

首先，`new`调用的优先级最高，只要有`new`关键字，`this`就指向实例本身；接下来如果没有`new`关键字，有`call、apply、bind`函数，那么`this`就指向第一个参数；然后如果没有`new、call、apply、bind`，只有`obj.foo()`这种点调用方式，`this`指向点前面的对象；最后是光杆司令`foo()` 这种调用方式，`this`指向`window`（严格模式下是`undefined`）。

es6中新增了箭头函数，而箭头函数最大的特色就是没有自己的`this、arguments、super、new.target`，并且箭头函数没有原型对象`prototype`不能用作构造函数（`new`一个箭头函数会报错）。**因为没有自己的`this`，所以箭头函数中的`this`其实指的是包含函数中的`this`**。无论是点调用，还是`call`调用，都无法改变箭头函数中的`this`。



## 闭包

很长时间以来我对闭包都停留在“定义在一个函数内部的函数”这样肤浅的理解上。事实上这只是闭包形成的必要条件之一。直到后来看了kyle大佬的《你不知道的javascript》上册关于闭包的定义，我才豁然开朗：

> 当函数能够记住并访问所在的词法作用域时，就产生了闭包。

```
let single = (function(){
  let count = 0
  return {
    plus(){
      count++
      return count
    },
    minus(){
      count--
      return count
    }
  }
})()
single.plus() // 1
single.minus() // 0
```

这是个单例模式，这个模式返回了一个对象并赋值给变量`single`，变量`single`中包含两个函数`plus`和`minus`，而这两个函数都用到了所在词法作用域中的变量`count`。正常情况下`count`和所在的执行上下文会在函数执行结束时被销毁，但是由于`count`还在被外部环境使用，所以在函数执行结束时`count`和所在的执行上下文不会被销毁，这就产生了闭包。每次调用`single.plus()`或者`single.minus()`，就会对闭包中的`count`变量进行修改，这两个函数就保持住了对所在的词法作用域的引用。

闭包其实是一种特殊的函数，它可以访问函数内部的变量，还可以让这些变量的值始终保持在内存中，不会在函数调用后被垃圾回收机制清除。

看个经典安利：

```
// 方法1
for (var i = 1; i <= 5; i++) {
  setTimeout(function() {
    console.log(i)
  }, 1000)
}
// 方法2
for (let i = 1; i <= 5; i++) {
  setTimeout(function() {
    console.log(i)
  }, 1000)
}
```

方法1中，循环设置了五个定时器，一秒后定时器中回调函数将执行，打印变量`i`的值。毋庸置疑，一秒之后`i`已经递增到了5，所以定时器打印了五次5 。（定时器中并没有找到当前作用域的变量`i`，所以沿作用域链找到了全局作用域中的`i`）

方法2中，由于es6的`let`会创建局部作用域，所以循环设置了五个作用域，而五个作用域中的变量`i`分布是1-5，每个作用域中又设置了一个定时器，打印一秒后变量`i`的值。一秒后，定时器从各自父作用域中分别找到的变量`i`是1-5 。这是个利用闭包解决循环中变量发生异常的新方法。



## 原型和原型链

js 中的几乎所有对象都有一个特殊的`[[Prototype]]`内置属性，用来指定对象的原型对象，这个属性实质上是对其他对象的引用。在浏览器中一般都会暴露一个私有属性 `__proto__`，其实就是`[[Prototype]]`的浏览器实现。假如有一个对象`var obj = {}`，那么可以通过`obj.__proto__` 访问到其原型对象`Object.prototype`，即`obj.__proto__ === Object.prototype`。对象有`[[Prototype]]`指向一个原型对象，原型对象本身也是对象也有自己的`[[Prototype]]`指向别的原型对象，这样串接起来，就组成了原型链。

```
var obj = [1, 2, 3]
obj.__proto__ === Array.prototype // true
Number.prototype.__proto__ === Object.prototype // true
Array.prototype.__proto__ === null // true
obj.toString()
```

可以看出，上例中存在一个从`obj`到`null`的原型链，如下：

```
obj----__proto__---->Array.prototype----__proto__---->Object.prototype----__proto__---->null
```

上例中最后一行调用`obj.toString()`方法的时候，js 引擎就是沿着这条原型链查找`toString`方法的。js 首先在`obj`对象自身上查找`toString`方法；未找到，继续沿着原型链查找`Array.prototype`上有没有`toString`；未找到，继续沿着原型链在`Object.prototype`上查找。最终在`Object.prototype`上找到了`toString`方法，于是泪流满面的调用该方法。这就是原型链最基本的作用。原型链还是 js 实现继承的本质所在，下一小节再讲。

上面我说“js 中的**几乎所有**对象都有一个特殊的`[[Prototype]]`内置属性”，为什么不是全部呢？因为 js 可以创建没有内置属性`[[Prototype]]`的对象：

```
var o = Object.create(null)
o.__proto__ // undefined
```

`Object.create`是 es5 的方法，所有浏览器都已支持。该方法创建并返回一个新对象，并将新对象的原型对象赋值为第一个参数。在上例中，`Object.create(null)`创建了一个新对象并将对象的原型对象赋值为`null`。此时对象 `o` 是没有内置属性`[[Prototype]]`的（不知道为什么`o.__proto__`不是`null`，希望知道的大佬评论解释下，万分感激）。



## js 的继承

js 的继承是通过原型链实现的，具体可以参考我的这篇文章，这里我只讲一讲大家可能比较陌生的“行为委托”。行为委托是《你不知道的JavaScript》系列作者 kyle 大佬推荐的一种代替继承的方式，该模式主要利用`setPrototypeOf`方法把一个对象的内置原型[[Protytype]]关联到另一个对象上，从而达到继承的目的。

```
let SuperType = {
  initSuper(name) {
    this.name = name
    this.color = [1,2,3]
  },
  sayName() {
    alert(this.name)
  }
}
let SubType = {
  initSub(age) {
    this.age = age
  },
  sayAge() {
    alert(this.age)
  }
}
Object.setPrototypeOf(SubType,SuperType)
SubType.initSub('17')
SubType.initSuper('gim')
SubType.sayAge() // 'gim'
SubType.sayName() // '17'
```

上例就是把父对象`SuperType`关联到子对象`SubType`的内置原型上，这样就可以在子对象上直接调用父对象上的方法。行为委托生成的原型链比class继承生成的原型链的关系简单清晰，一目了然。

![图片](https://mmbiz.qpic.cn/mmbiz_png/C94aicOicyXpJ51l1xicF3Dbp8GdRocTRhiabZJDIcCoibtPjgnILpq8GAXPHNeFibN271W8qUrvVeib3xNbKu9awcbBw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)kyle大佬倡导的行为委托



## event loop

js 是单线程的，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。但是IO设备（输入输出设备）很慢（比如Ajax操作从网络读取数据），js 不可能等待IO设备执行完成才继续执行下一个的任务，这样就失去了这门语言的意义。所以 js 的任务分为同步任务和异步任务。

1. 所有同步任务都是在主线程执行，形成一个“执行栈”（execution context stack）；
2. 所有的异步任务都会暂时挂起，等待运行有了结果之后，其回调函数就会进入“任务队列”（task queue）排队等待；
3. 当执行栈中的所有同步任务都执行完成之后，就会读取任务队列中的第一个的回调函数，并将该回调函数推入执行栈开始执行；
4. 主线程不断循环重复第三步，这就是“event loop”的运行机制。

![图片](https://mmbiz.qpic.cn/mmbiz_png/C94aicOicyXpJ51l1xicF3Dbp8GdRocTRhiaSkAunjic9OfyE9gX1LPqooAxITzFxibicoDZGNuGSeFpJicMNKGNIm8VVA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

上图中，主线程运行的时候，产生堆（heap）和栈（stack），堆用来存放数组对象等引用类型，栈中的代码调用各种外部API，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。

任务队列中有两种异步任务，一种是宏任务，包括`script setTimeout setInterval`等，另一种是微任务，包括`Promise process.nextTick MutationObserver`等。每当一个 js 脚本运行的时候，都会先执行`script`中的整体代码；当执行栈中的同步任务执行完毕，就会执行微任务中的第一个任务并推入执行栈执行，当执行栈为空，则再次读取执行微任务，循环重复直到微任务列表为空。等到微任务列表为空，才会读取宏任务中的第一个任务并推入执行栈执行，当执行栈为空则再读取执行微任务，微任务为空才再读取执行宏任务，如此循环。

