import React from "react";
import {ItemCard} from "../components/ItemCard";
import {fetchTheQuery} from "../fetching";
import '../css/ProductsPage.css'

export default class ListingPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            products: [],
            failedToLoad: false
        }
    }

    capitalize(str) {
        const lower = str.toLowerCase();
        return str.charAt(0).toUpperCase() + lower.slice(1);
    }


    async componentDidMount(){
        let data = await this.getData(this.props.category);
        if (data.data.category.products) {
            this.setState({products: data.data.category.products});
        } else {
            this.setState({failedToLoad: true});
        }

    }

    async getData(category){
        return await fetchTheQuery(
            `query ($title: String!){
                    category(input: {title: $title}){
                    name
                      products{
                        name
                        brand
                        id
                        prices{
                            amount
                            currency
                        }
                        gallery
                        inStock
                        attributes{
                          id
                          name
                          type
                          items{
                            displayValue
                            value
                            id
                          }
                        }
                      }
                      }
                    }`, {title: category}
        )
    }

    render() {
        let productsFetched = this.state.products

        if (this.state.failedToLoad){
            return (
                <div>Failed to load products </div>
            )
        }else if (productsFetched){
            // Load the page
            return (
                <div>
                    <h1 className='category-title'>{ this.capitalize(this.props.category)}</h1>
                    <div className="wrapper">
                        {this.state.products.map(
                            product => {
                                return <ItemCard key = {product.id} product={product} category = {this.props.category} />
                            }
                        )}
                    </div>
                </div>
            )
        }else {
            return ( <div>Loading....................................</div>)
        }


    }
}

ListingPage.propTypes = {
    category: String,
}