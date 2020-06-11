import React from 'react';


export default class addSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idEtu: '',
            uvs: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        this.props.getSchedule(this.state.idEtu);
     }

    handleChange = (event) => {
        this.setState({idEtu: event.target.value});
        console.log(this.state.idEtu);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <h1>Hello {this.state.idEtu}</h1>
                <p>Enter your name, and submit:</p>
                <input
                    type='text' value={this.state.idEtu} onChange={this.handleChange}
                />
                <input
                    type='submit' value={'Submit'}
                />
            </form>
        );
    }
}