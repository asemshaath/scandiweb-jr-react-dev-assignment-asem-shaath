import React, {Component, createContext} from "react"
import PropTypes from "prop-types";

export const CurrencyContext = createContext()

class CurrencyContextProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCurrency: 'USD'
        }
    }

    setCurrency(c){
        this.setState({selectedCurrency: c})
    }

    render() {
        return (
            <CurrencyContext.Provider value={{...this.state, setCurrency: this.setCurrency.bind(this)}}>
                {this.props.children}
            </CurrencyContext.Provider>
        )
    }
}

CurrencyContextProvider.propTypes = {
    children: PropTypes.node
}

export default CurrencyContextProvider;
