## @bajuh/type-switch

I created this function to make overloading easier in typescript.

#### Usage

##### Constructor overload

```typescript
class StringContainer {
	
  private data: string;
  
  constructor(count: number, char: string);
  constructor(initialValue: string);
  constructor(cpy: StringContainer);
  constructor(arg1: number | string | StringContainer, char?: string){
    this.data = '';
    TypeSwitch(arg1)(
      Case(Number)
        ((count: number) => this.data = (<string>char).repeat(count)),
      Case(String)
        ((initialValue: string) => this.data = initialValue),
      Case(StringContainer)
        ((cpy: StringContainer) => this.data = cpy.data)
    );
  }
}
```

##### Type group

```typescript
TypeSwitch(maybeNumber)(
  Case(Number, Array)
    ('This is either a number or an array.'),
  Case(Object, Promise)
    ("This is something we don't want")
);
```

##### Null/Undefined Check

```typescript
// only one case type
TypeSwitch(maybeNumber)(
  Case(Number)
  ('Is good.'),
  Case(null)
  (() => {
    throw new Error('Not good.')
  })
);

// behold! case group!
TypeSwitch(maybeNumber)(
  Case(Number)
    ('Is good.'),
  Case(null, undefined)
    (() => {
      throw new Error('Not good.')
    })
);
```

##### Fall-through

```typescript
TypeSwitch(5)(
  Case(Array)
    (FALL_THROUGH, "Won't happen."),
  Case(Number)
    (FALL_THROUGH, 'Will happen.'),
  Case(String)
    (FALL_THROUGH, () => 'This will also happen.'),
  Case(Boolean)
    ('And this will also happen!'),
  Case(Promise)
    ("But this won't."),
  Default('And this one neither.')
);
```

##### Result of TypeSwitch

```typescript
const complicatedNumberToString = TypeSwitch(5)(
  Case(Number)
    (Number.prototype.toString.call),
  Default('Default: in case 5 is not a number')
);

const fallthroughResult = TypeSwitch(5)(
  Case(Array)
  (FALL_THROUGH, "Won't happen."),
  Case(Number)
  (FALL_THROUGH, 'Will happen but result will be something else.'),
  Case(String)
  (FALL_THROUGH, () => 'This will also happen but the result is still not this value.'),
  Case(Boolean)
  ("Yup. This will be the value of 'result'")
);

// assert(fallthroughResult === "Yup. This will be the value of 'result'");
```