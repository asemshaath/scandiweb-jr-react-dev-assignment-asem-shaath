import React from "react";
import {fetchTheQuery} from "../fetching";
import { withRouter } from 'react-router-dom'
import '../css/PDP.css'
import ProductDetailsContainer from "../components/ProductDetailsContainer";


class ProductPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            product: null,
            failedToLoad: false,
            selectedImageIndex: 0
        }
    }

    async componentDidMount(){
        let id = this.props.id;
        let data = await this.getData(id);
        if (data.data.product) {
            this.setState({product: data.data.product});
        } else {
            this.setState({failedToLoad: true});
        }
    }

    async getData(id){
        return await fetchTheQuery(
            `query getProduct($id: String!){
                      product(id: $id){
                        name
                        inStock
                        brand
                        description
                        gallery
                        prices{
                          currency
                          amount
                        }
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
                    }`, {id: id}
        )
    }

    render() {
        let isImageAvailable = this.state.product

        if(this.state.failedToLoad){
            return (
                <div>Failed to load product description</div>
            )
        } else if(isImageAvailable) {
            return(
                <>
                <div className="pdp-page">
                    <div className="pdp-container">

                        <div className='all-images-container'>
                            <div className="small-images-container">
                                {this.state.product.gallery.map((image, index) => {
                                    return (<img key={index} src={image} className="small-image"
                                                 onMouseOver={() => {this.setState({selectedImageIndex: index})}} />)
                                })}
                            </div>

                            <div className="main-image-container">
                                <img src={ this.state.product.gallery[this.state.selectedImageIndex] } alt="product" className="main-image"/>
                            </div>
                        </div>


                        <div className="product-details-container">
                            <ProductDetailsContainer id={this.props.id} product={this.state.product}/>
                        </div>
                    </div>
                </div>
                </>
            )
        } else {
            return ( <div>Loading....................................</div>)
        }
    }
}


ProductPage.propTypes = {
    id: String
}

export default withRouter(props => <ProductPage {...props}/>)