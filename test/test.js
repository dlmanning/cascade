var cataract = require('../index')

var withConstants = cataract.withConstants
var withBase = cataract.withBase
var compose = cataract.compose

const constants = {
  '$appText': 'orange'
}

const flex = {
  display: 'flex',
  flexDirection: 'column',
  link: {
    fontSize: '2em'
  }
}

const borders = {
  flexDirection: 'row',
  border: '1px'
}

const styles = {
  color: 'white',
  link: {
    fontStyle: 'inherit',
    active: {
      color: '$appText',
      fontSize: '2.1em',
      border: '1px'
    }
  }
}

var output = compose(
  withBase(flex),
  withBase(borders),
  withConstants(constants)
)(cataract)(styles)

console.log(JSON.stringify(output, null, '\t'))
