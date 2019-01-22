/* This is a test file for a new currency lib */

function Currency () {}

function createCurrency ({symb}) {
  const currencyConstructor = function ( value, isIntValue = false ) {
    if (!(this instanceof currencyConstructor)) {
      return new currencyConstructor(value, isIntValue)
    }

    this.intValue = isIntValue ? value : value * 100 
  }

  currencyConstructor.prototype = Object.assign(
    Object.create(Currency.prototype),
    {
      compat: [currencyConstructor],
      add: function ( value ) {
        if (this.compat.some(type => value instanceof type)) { return new currencyConstructor(this.intValue + value.intValue, true) }
        else { throw Error('Trying to add non-compatible type/currency to currency object') }
      },
      value: function () {
        return this.intValue / 100
      },
      addCompat: function ( currency ) {
        if (!(currency.prototype instanceof Currency)) {
          throw Error('Cannot add non-Currency object as compatible to a Currency')
        } else if (!(this.compat.some(type => type === currency))) {
          this.compat.push(currency)
        }
      },
      symb
    }
  )

  currencyConstructor.addCompat = function ( currency ) {
    currencyConstructor.prototype.addCompat( currency )
  }

  return currencyConstructor
}

function SomeConstructor ( shit ) {
  this.shit = shit
}

module.exports = {
  createCurrency,
  SomeConstructor,
  Currency
}
