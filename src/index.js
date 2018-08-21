import React, { Component } from 'react';
import { render } from 'react-dom'
import Axios from 'axios';

// const response = async function () {
//     const resp = await Axios.get('/api/departments')
//     return resp.data
// }

class Main extends Component {
    render() {
        return (
            <div className="react-container">
                Hello World
            </div>
        )
    }
}

render(<Main />, document.getElementsById('root'))
