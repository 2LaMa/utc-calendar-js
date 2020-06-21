import React from 'react';


export default class addSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idEtu: '',
            error:false,
            uvs: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        this.props.getSchedule(this.state.idEtu,false);
     }

    handleChange = (event) => {
        this.setState({idEtu: event.target.value});
        console.log(this.state.idEtu);
    }

	handleNew = (event) => {
		event.preventDefault();
        this.setState({idOtherEtu: event.target.value});
		console.log(this.state.idOtherEtu);
		this.props.getSchedule(this.state.idOtherEtu,true)
	}
	
	handleOtherChange = (event) => {
        this.setState({idOtherEtu: event.target.value});
        console.log(this.state.idOtherEtu);
    }


	
    render() {
        return (
            <div>
                <h1 style={{ marginLeft: 10, marginBottom: 0, marginTop: 10 }}>Hello {this.state.idEtu}</h1>
                <div id={'errMessage'} style={{ visibility: 'hidden', color:'red', marginLeft: 10 }}>Could not find this id. Please retry.</div>
                <div class="flex-container">
                    <span>
                        <form onSubmit={this.handleSubmit} >
                            Find your schedule:
                            <input
                                type='text' value={this.state.idEtu} onChange={this.handleChange}
                            />
                            <input
                                type='submit' value={'Search'}
                            />
                        </form>
                    </span>
                    <span>
                        <form onSubmit={this.handleNew}>
                            <div>
                              Add another schedule to compare:
                                <input
                                    type='text' value={this.state.idOtherEtu} onChange={this.handleOtherChange}
                                />
                                <input
                                    type='submit' value={'Search'}
                                />

                            </div>
                        </form>
                    </span>
                </div>
            </div>
        );
    }
}