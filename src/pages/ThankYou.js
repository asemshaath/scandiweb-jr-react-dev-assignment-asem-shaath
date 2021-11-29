import React, {Component} from 'react';
import '../css/ThankYou.css'

class ThankYou extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log(this.props)
        return (
            <div className='thank-container'>
                <div className='thank-div'>
                    <h1 className='thank-text'>Thank you for your purchase 😃👍</h1>
                </div>
            </div>
        )
    }
}

export default ThankYou;