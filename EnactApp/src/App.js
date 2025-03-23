import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';
import React, {Component} from 'react';

import MainPanel from './views/MainPanel';
import SecondaryPanel from './views/SecondaryPanel';

class AppBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			path: ['main'],
			counter: 0
		};
	}
	
	handleNavigate = ({panel}) => {
		if (panel === 'main') {
			this.setState({
				path: ['main'],
				index: 0
			});
		} else if (panel === 'secondary') {
			this.setState({
				path: ['main', 'secondary'],
				index: 1
			});
		}
	};
	
	updateCounter = (value) => {
		if (typeof value === 'function') {
			this.setState(({counter}) => ({
				counter: value(counter)
			}));
		} else {
			this.setState({
				counter: value
			});
		}
	};

	render() {
		const {index, path, counter} = this.state;
		
		return (
			<Panels
				{...this.props}
				index={index}
				path={path}
				onBack={() => this.handleNavigate({panel: 'main'})}
			>
				<MainPanel 
					onNavigate={this.handleNavigate} 
					counter={counter} 
					updateCounter={this.updateCounter} 
				/>
				<SecondaryPanel 
					onNavigate={this.handleNavigate} 
				/>
			</Panels>
		);
	}
}

export default ThemeDecorator(AppBase);
