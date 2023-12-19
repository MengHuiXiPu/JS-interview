# React、Vue3中父组件如何调用子组件内部的方法

# React

当父组件需要调用子组件的方法时，可以通过useImperativeHandle钩子函数实现。以下例子是ts实现方式。

- 在子组件中使用 `useImperativeHandle` 钩子，将指定的方法暴露给父组件，以便父组件可以通过子组件的引用来调用该方法。 在子组件中使用了 useImperativeHandle 钩子将 someMethod 方法暴露给父组件。注意，为了使用 useImperativeHandle，需要将子组件包裹在 forwardRef 函数中，并在参数列表中添加 ref。

```react
// 子组件
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
type ChildProps = {
  // 子组件的其他 props
};
type ChildMethods = {
  // 子组件暴露给父组件的方法
  someMethod: () => void;
};
const ChildComponent: React.ForwardRefRenderFunction<ChildMethods, ChildProps> = ({}, ref) => {
  // 子组件的其他代码...
  const someMethod = () => {
    // 子组件的方法实现
    console.log('Child method called!');
  };
  // 将子组件的方法暴露给父组件
  useImperativeHandle(ref, () => ({
    someMethod,
  }));
  return <div>Child Component</div>;
};
export default forwardRef(ChildComponent);
```

上述代码中 `React.ForwardRefRenderFunction` 是 TypeScript 中的一个泛型类型，用于定义 forwardRef 的 render 函数的类型。 在这个类型参数中，`ChildMethods` 表示子组件暴露给父组件的方法的类型，`ChildProps` 表示子组件的 props 类型。`({})` 是 render 函数的参数列表，表示子组件接收的 props，此处为空对象，即没有额外的 props。`ref` 是 `forwardRef` 传递的 ref 参数，用于获取对子组件实例的引用。 总而言之，`React.ForwardRefRenderFunction<ChildMethods, ChildProps>` 定义了一个 forwardRef 的 render 函数类型，接收的 props 类型为 `ChildProps`，暴露给父组件的方法的类型为 `ChildMethods`，而在具体的函数实现中，参数列表为空对象，并接收 `ref` 参数用于获取对子组件实例的引用。 这些是常见的父组件调用子组件内部方法的方式。

有了上面的子组件，在父组件中，可以使用 useRef 钩子来创建一个对子组件的引用，并通过引用调用子组件的方法：

```jsx
// 父组件
import React, { useRef } from 'react';
import ChildComponent, { ChildMethods } from './ChildComponent';
const ParentComponent: React.FC = () => {
  const childRef = useRef<ChildMethods>(null);
  const handleClick = () => {
    // 通过子组件的引用调用子组件的方法
    if (childRef.current) {
      childRef.current.someMethod();
    }
  };
  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleClick}>Call Child Method</button>
    </div>
  );
};
export default ParentComponent;
```

# Vue3

在 Vue 3 中，父组件调用子组件内部的方法可以通过下面的方式实现：

使用 `$refs` 引用子组件：

- 在父组件中使用 `ref` 给子组件添加一个引用，并通过该引用调用子组件的方法。
- 注意：在 Vue 3 中，`$refs` 不再自动包含子组件实例，而是返回一个组件实例或 DOM 元素的直接引用。

```

<!-- 子组件 -->
<template>
  <div>
    <button @click="childMethod">Click Me</button>
  </div>
</template>

<script>
export default {
  methods: {
    childMethod() {
      console.log('Child method called!');
    }
  }
};
</script>

<!-- 父组件 -->
<template>
  <div>
    <ChildComponent ref="childRef" />
    <button @click="callChildMethod">Call Child Method</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent
  },
  setup() {
    const childRef = ref(null);

    const callChildMethod = () => {
      childRef.value.childMethod();
    };

    return {
      childRef,
      callChildMethod
    };
  }
};
</script>
```



 