# cataract
A utility for helping make inline stylesheets from plain javascript objects. Probably for use with react.

## Example

```js
import cataract from 'cataract'

const styles = {
  background: 'black',
  color: 'white',
  link: {
    fontStyle: 'inherit',
    active: {
      color: 'orange',
      fontSize: '2.1em',
      border: '1px'
    }
  }
}

var styleSheet = cataract(styles)
```

`styleSheet` will be:

```js
{
  $base: {
    color: 'white'
  },
  link: {
    color: 'white',
    fontStyle: 'inherit'
  },
  'link:active': {
    color: 'orange',
    fontStyle: 'inherit',
    fontSize: '2.1em',
    border: '1px'
  }
}
```

So then you can just do something like this (in react 0.14)
```js
function MyComponent (props) {
  const { isActive } = props
  const { $base, link, 'link:active': linkActive } = styleSheet

  return (
    <div style={$base}>
      <h1>Hello World</h1>
      <a style={isActive ? linkActive : link}>
        Follow Me
      </a>
    </div>
  )
}
```

More documentation to come...
