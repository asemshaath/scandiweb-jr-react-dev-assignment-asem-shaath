import React from 'react'
import {render, fireEvent} from "@testing-library/react";
import {CurrencyContext} from '../contexts/CurrencyContext';
import CurrencyContextProvider from '../contexts/CurrencyContext'
// import {describe} from '@testing-library/user-event'

// A test component for unit testing purposes
class TestCurrency extends React.Component{
    render(){
        return(
            <CurrencyContextProvider>
                <CurrencyContext.Consumer>
                    {context=>{
                        const {setCurrency, selectedCurrency} = context

                        return(<>
                            <button title='set-to-eur' onClick={()=>{setCurrency('EUR')}}>Set to EUR</button>
                            <h1 title='current-currency'>{selectedCurrency}</h1>
                        </>)
                    }}
                </CurrencyContext.Consumer>
            </CurrencyContextProvider>
        )
    }
}

// eslint-disable-next-line no-undef
describe("Setting and changing a currency", ()=>{
    // eslint-disable-next-line no-undef
    it('set currency to EUR', ()=> {

        const {queryByTitle} = render(<TestCurrency/>)
        const btn = queryByTitle("set-to-eur")
        const txt = queryByTitle("current-currency")

        // eslint-disable-next-line no-undef
        expect(btn.innerHTML).toBe("Set to EUR")
        fireEvent.click(btn)
        // eslint-disable-next-line no-undef
        expect(txt.innerHTML).toBe("EUR")
    })
})