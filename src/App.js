import {BrowserRouter as Router, Switch, Route, useParams, Redirect} from 'react-router-dom';
import React from "react";
import ListingPage from "./pages/ListingPage";
import ProductDetailsPage from './pages/ProductPage'
import {fetchTheQuery} from "./fetching";
import CurrencyContextProvider from "./contexts/CurrencyContext";
import CartContextProvider from "./contexts/CartContext";
import Navbar from './components/Navbar'
import {Cart} from "./pages/Cart";
import './css/MainBody.css'
import ThankYou from "./pages/ThankYou";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {categories: []}
    }

    async componentDidMount() {
        let categories = (await this.getCategories()).data.categories;
        this.setState({ categories: categories })
    }

    async getCategories(){
        return await fetchTheQuery(`query{ categories { name } }`)
    }

    render() {
        return (
            <div className='App'>
                <CartContextProvider>
                <CurrencyContextProvider>
                    <Router>
                        <Navbar categories = {this.state.categories}/>
                        <Switch>
                            {
                                //If we have a list of categories pick first category to be the main page route
                                this.state.categories.length !== 0 &&
                                <Route path="/" exact>
                                    {/*<ListingPage key={this.state.categories[0].name} category={this.state.categories[0].name}/>*/}
                                    <Redirect to={"/" + this.state.categories[0].name} />
                                </Route>
                            }

                            {this.state.categories.map(
                                category => {
                                    return (
                                        <Route path={"/" + category.name.toLowerCase()} >
                                            <ListingPage key={category.name} category={category.name} />
                                        </Route>
                                    )
                                }
                            )}

                            <Route path={"/product/:id"}>
                                <ProductDetailsPageWrapper/>
                            </Route>
                            <Route path={"/cart"}> <Cart/> </Route>
                            <Route path={"/thank-you"}> <ThankYou/> </Route>
                        </Switch>
                    </Router>
                </CurrencyContextProvider>
                </CartContextProvider>
            </div>

        )
    }
}

function ProductDetailsPageWrapper() {
    let {id} = useParams();
    return (<ProductDetailsPage id={id} />);
}