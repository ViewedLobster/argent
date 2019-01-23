/* This is a test file for a new currency lib */

function Currency () {}

/* Math.round has weird behavior when rounding negative numbers */
const round = num => Math.round(Math.abs(num)) * (num >= 0 ? 1 : -1)
const signOf = num => appliedTo => num >= 0 ? appliedTo : -appliedTo

function createCurrency ({symb}) {
  const currencyConstructor = function ( value, isIntValue = false ) {
    if (!(this instanceof currencyConstructor)) {
      return new currencyConstructor(value, isIntValue)
    }

    if (!isNaN(value)) {
      throw Error('Input to currency constructor must be valid number')
    }

    this.intValue = round(isIntValue ? value : value * 100)
  }

  // TODO should add check for safe integer after each calculation?
  currencyConstructor.prototype = Object.assign(
    Object.create(Currency.prototype),
    {
      compat: [currencyConstructor],
      symb,

      /* Method to add compatible currencies */
      addCompat ( currency ) {
        if (!(currency.prototype instanceof Currency)) {
          throw Error('Cannot add non-Currency object as compatible to a Currency')
        } else if (!(this.compat.some(type => type === currency))) {
          this.compat.push(currency)
        }
      },

      /* Currency operations */
      add ( value ) {
        if (this.compat.some(type => value instanceof type)) { return new currencyConstructor(this.intValue + value.intValue, true) }
        else { throw Error('Trying to add non-compatible type/currency to currency object') }
      },
      subtract ( value ) {
        if (this.compat.some(type => value instanceof type)) { return new currencyConstructor(this.intValue - value.intValue, true) }
        else { throw Error('Trying to add non-compatible type/currency to currency object') }
      },
      sub ( value ) {
        return this.subtract( value )
      },
      multiply ( number ) {
        if (!isNaN(number)) {
          return new currencyConstructor(round(this.intValue* number), true)
        } else {
          throw Error('Multiplying currency by non-number')
        }
      },
      divide ( number ) {
        if (!isNaN(number)) {
          return new currencyConstructor(round(this.intValue / number), true)
        } else {
          throw Error('Dividing currency by non-number')
        }
      },
      negate () {
        return new currencyConstructor(-this.intValue, true)
      },
      distribute ( n ) {
        if (Number.isSafeInteger(n) && n > 0) {
          const { intValue } = this
          const sign = signOf(intValue)
          const absVal = Math.abs(intValue)
          const absLeastShare = Math.floor(absVal / n)
          const absRemainder = absVal - ( n * leastShare )
          
          /* Distribute leastShare and one part of the absRemainder into absRemainder currency objects */
          const a = []
          for ( var i = 0; i < absRemainder; i++ ) {
            a.push(new currencyConstructor(sign(absLeastShare + 1), true))
          }

          /* Distribute leastShare into n - absRemainder currency objects */
          const b = []
          for ( var i = 0; i < n - absRemainder; i++) {
            b.push(new currencyConstructor(sign(absLeastShare), true))
          }

          return a.concat(b)
        } else {
          throw Error('Trying to distribute Currency object into non-integer number of shares')
        }
      },
      value () {
        return this.intValue / 100
      },
      gt ( value ) {
        if (this.compat.some(type => value instanceof type)) { return this.intValue > value.intValue }
        else { throw Error('Trying to compare non-compatible type/currency to currency object') }
      },
      lt ( value ) {
        if (this.compat.some(type => value instanceof type)) { return this.intValue < value.intValue }
        else { throw Error('Trying to compare non-compatible type/currency to currency object') }
      },
      geq ( value ) {
        if (this.compat.some(type => value instanceof type)) { return this.intValue >= value.intValue }
        else { throw Error('Trying to compare non-compatible type/currency to currency object') }
      },
      leq ( value ) {
        if (this.compat.some(type => value instanceof type)) { return this.intValue <= value.intValue }
        else { throw Error('Trying to compare non-compatible type/currency to currency object') }
      },
      eq ( value ) {
        if (this.compat.some(type => value instanceof type)) { return this.intValue === value.intValue }
        else { throw Error('Trying to compare non-compatible type/currency to currency object') }
      }
    }
  )

  currencyConstructor.addCompat = function ( currency ) {
    currencyConstructor.prototype.addCompat( currency )
  }

  return currencyConstructor
}

module.exports = {
  createCurrency,
  SomeConstructor,
  Currency
}
