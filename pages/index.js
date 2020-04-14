import {PureComponent} from 'react';
import { ipcRenderer } from 'electron';

export default class HomePage extends PureComponent {
	state = {
		input: '',
		message: null,
	}

	componentDidMount() {
		ipcRenderer.on('message', this.handleMessage)
	}

	componentWillUnmount() {
		ipcRenderer.removeListener('message', this.handleMessage)
	}

	handleMessage = (event, message) => {
		this.setState({ message })
	}

	handleChange = event => {
		this.setState({ input: event.target.value })
	}

	handleSubmit = event => {
		event.preventDefault();
		ipcRenderer.send('message', this.state.input)
	}

	render() {
	
		return (
			<div>
				<h1>Network-Wizard</h1>

				{this.state.message &&
					<p>{this.state.message}</p>
				}

				<form onSubmit={this.handleSubmit}>
					<input type="text" onChange={this.handleChange} />
				</form>

				<style jsx>{`
					h1 {
						color: red;
						font-size: 50px;
					}
				`}</style>
			</div>
		)
	}
}