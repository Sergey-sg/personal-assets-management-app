import {describe, expect, test} from '@jest/globals';
import { convertDate, convertDateTime, currentImagesPath, getCorrectDateFormat, invoiceNotValid, sum } from '../../pages/invoicePages/secondaryFunctions/secondaryFunctions';
import { IInvoice } from 'redux/slice/invoiceServices/invoice.slice';
import { IUserProfile } from 'redux/slice/userProfile/userProfile.slice';
import { IInvoiceItem } from 'pages/invoicePages/interfaces/invoiceItem.interface';
import { addMinutes, addMonths } from 'date-fns';
import { CONSTANTS } from '../../shared/constants';
import profile from '../../assets/icons/profile.svg';

const initialInvoice: IInvoice = {
    billedTo: undefined,
    items: [],
    discount: 0,
    dueDate: '',
    invoiceDate: '',
    invoiceDetails: '',
    total: 0
}

const customer: IUserProfile = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@mail.com',
    address: null,
    phone: null,
    birthdate: null
}

const item: IInvoiceItem = {
    id: 1,
    price: 4,
    amount: 5,
    subTotal: 20,
    name: 'test'
}

describe('invoiceNotValid', () => {
    test('send invoice without customer', () => {
        expect(invoiceNotValid(initialInvoice))
            .toBe('the customer field cannot be empty')
    })

    test('send invoice without items', () => {
        expect(invoiceNotValid({...initialInvoice, billedTo: customer}))
            .toBe('the item field cannot be empty')
    })

    test('send invoice without Invoice and Due Dates', () => {
        expect(invoiceNotValid({...initialInvoice, billedTo: customer, items: [item]}))
            .toBe('the Invoice and Due Dates field cannot be empty')
    })

    test('send invoice with invalid invoice date', () => {
        expect(invoiceNotValid(
            {...initialInvoice, billedTo: customer, items: [item], invoiceDate: '2022-10-24', dueDate: '2022-10-30'}
        ))
            .toBe('invoice date must be not earlier than in 5 min')
    })

    test('send valid invoice', () => {
        const invoiceDate = addMinutes(new Date(), 30).toISOString()
        const dueDate = addMonths(new Date(), 1).toISOString()
        expect(invoiceNotValid(
            {...initialInvoice, billedTo: customer, items: [item], invoiceDate, dueDate}
        ))
            .toBe(false)
    })
})

describe('currentImagesPath', () => {
    const pathImagesFromCloudinary = '/v1666550101/MyFinance/pdgzuqsvehcok23oagpa.webp'
    
    test('get a path from Cloudinary', () => {
        expect(currentImagesPath(pathImagesFromCloudinary))
            .toBe(`${CONSTANTS.CLOUDINARY_FILE_STORAGE}${pathImagesFromCloudinary}`)
    })

    test('get a path to any other external resource', () => {
        expect(currentImagesPath('https://lh3.googleusercontent.com/f/G5wu33PEgL73ZU1EbTtR3anoenQnslTIJdi_Brrb7p=s95-c'))
            .toBe('https://lh3.googleusercontent.com/f/G5wu33PEgL73ZU1EbTtR3anoenQnslTIJdi_Brrb7p=s95-c')
    })

    test('get profile image path from static', () => {
        expect(currentImagesPath(''))
            .toBe(profile)
    })
})

describe('sum', () => {
    const testListNumbers = [3445, 4567, 34589, 5600]
    
    test('get the sum of all items', () => {
        expect(sum(testListNumbers))
            .toBe(48201)
    })

    test('get the sum of empty items', () => {
        expect(sum([]))
            .toBe(0)
    })
})

describe('convertDateTime', () => {
    test('convert date time to international format', () => {
        expect(convertDateTime('2022-10-31T16:45'))
            .toBe('31 Oct 2022 at 04:45 PM')
    })
})

describe('convertDate', () => {
    test('convert date to international format', () => {
        expect(convertDate('2022-10-31'))
            .toBe('31 Oct 2022')
    })
})

describe('getCorrectDateFormat', () => {
    const dateNow = new Date()
    const dateString = '2022-01-27'

    test('get correct date in ISO format', () => {
        expect(getCorrectDateFormat(dateString))
            .toBe(addMinutes(new Date(dateString), -dateNow.getTimezoneOffset()).toISOString().slice(0, 16))
    })

    test('get empty string', () => {
        expect(getCorrectDateFormat(''))
            .toBe('')
    })
})