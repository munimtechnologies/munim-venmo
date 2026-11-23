import { checkoutUrlForOrder, parseReturnUrl } from '../urls'

describe('checkoutUrlForOrder', () => {
  it('builds the link PayPal’s mobile SDK opens', () => {
    expect(checkoutUrlForOrder('612506081R733101H')).toBe(
      'https://account.venmo.com/go/web/paypal?channel=in-app&token=612506081R733101H'
    )
    expect(checkoutUrlForOrder('5O190127TN364715T', 'sandbox')).toBe(
      'https://account.ext.live.venmo.com/go/web/paypal?channel=in-app&token=5O190127TN364715T'
    )
  })
})

describe('parseReturnUrl', () => {
  it('reads an approval', () => {
    expect(
      parseReturnUrl(
        'https://example.com/venmo/return?approved=true&token=612506081R733101H&PayerID=ABC123'
      )
    ).toEqual({ status: 'approved', orderId: '612506081R733101H', payerId: 'ABC123' })
  })

  it('reads names in any case, like the SDK', () => {
    expect(
      parseReturnUrl('myapp://venmo/return?APPROVED=TRUE&Token=O1&payerid=P1')
    ).toEqual({ status: 'approved', orderId: 'O1', payerId: 'P1' })
  })

  it('reads a cancel, with or without the order', () => {
    expect(parseReturnUrl('myapp://venmo/return?canceled=true')).toEqual({
      status: 'canceled',
      orderId: null,
    })
    expect(
      parseReturnUrl('https://example.com/r?canceled=true&token=O1')
    ).toEqual({ status: 'canceled', orderId: 'O1' })
  })

  it('says unknown when an approval lacks the payer', () => {
    expect(parseReturnUrl('myapp://venmo/return?approved=true&token=O1')).toEqual({
      status: 'unknown',
      orderId: 'O1',
    })
    expect(parseReturnUrl('myapp://venmo/return')).toEqual({
      status: 'unknown',
      orderId: null,
    })
  })

  it('ignores a fragment', () => {
    expect(
      parseReturnUrl('https://e.com/r?approved=true&token=O1&PayerID=P1#done')
    ).toEqual({ status: 'approved', orderId: 'O1', payerId: 'P1' })
  })
})
