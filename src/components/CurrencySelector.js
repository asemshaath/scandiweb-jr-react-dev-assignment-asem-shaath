import React from 'react'
import {CurrencyContext} from "../contexts/CurrencyContext"
import {fetchTheQuery} from "../fetching"
import getSymbolFromCurrency from "currency-symbol-map";
import '../css/Navbar.css'

export class CurrencySelector extends React.Component{

    constructor(props) {
        super(props)
        this.state = { currencies: ["USD"] }
    }

    async componentDidMount(){
        let currencies = (await this.getCurrencies()).data.currencies
        this.setState({ currencies:currencies } )
        localStorage.setItem("currency", this.state.currencies[0])
    }

    async getCurrencies(){
        return await fetchTheQuery( `query{ currencies }` )
    }

    render() {
        return (
            <CurrencyContext.Consumer>
                {(currencyContext) => {
                    const {setCurrency} =currencyContext
                    return(
                        <>
                            {this.state.currencies.map(
                                (currency) => {
                                    return (
                                        <div key={currency} className='currency-option' onClick={()=> setCurrency(currency)}>
                                            { getSymbolFromCurrency(currency) + " " + currency}
                                        </div>
                                    )
                                }
                            )}
                        </>
                    )
                }}
            </CurrencyContext.Consumer>
        )
    }
}
