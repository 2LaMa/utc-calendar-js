import React from 'react';


export default class deleteSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };


    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        this.props.getSchedule(this.state.idEtu);
    };

    handleChange = (event) => {
        this.setState({idEtu: event.target.value});
        console.log(this.state.idEtu);
    };


    render() {
        var select = document.getElementById("delSchedule");
        var options = this.state.users;
        for(let i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = (
                <option value={opt} >
                    {opt}
                </option>
            );
            select.appendChild(el)
        }​;
        return (
            <form onSubmit={this.handleSubmit} >
                <p>Supprimez un emploi du temps :</p>
                <select id="delSchedule" name="delSchedule" value={this.state.users} onChange={this.handleChange}>
                </select>

                <input
                    type='submit' value={'Submit'}
                />
            </form>
        );
    }
}