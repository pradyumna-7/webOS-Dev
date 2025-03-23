import Button from '@enact/sandstone/Button';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import Item from '@enact/sandstone/Item';
import SwitchItem from '@enact/sandstone/SwitchItem';

const MainPanel = kind({
	name: 'MainPanel',
	
	defaultProps: {
		counter: 0
	},
	
	handlers: {
		onIncrement: (ev, {updateCounter}) => {
			updateCounter(counter => counter + 1);
		},
		onReset: (ev, {updateCounter}) => {
			updateCounter(0);
		},
		onSecondary: (ev, {onNavigate}) => {
			onNavigate({panel: 'secondary'});
		}
	},

	render: ({counter, onIncrement, onReset, onSecondary, ...rest}) => (
		<Panel {...rest}>
			<Header title="webOS Enact Sample App" />
			<Scroller>
				<div style={{padding: '20px'}}>
					<h2>Welcome to webOS!</h2>
					<p>This is a sample application built with Enact framework.</p>
					
					<Item>Counter: {counter}</Item>
					<Button onClick={onIncrement}>Increment</Button>
					<Button onClick={onReset}>Reset</Button>
					
					<SwitchItem defaultSelected>Toggle Feature</SwitchItem>
					
					<div style={{marginTop: '20px'}}>
						<Button onClick={onSecondary}>
							Go to Secondary Panel
						</Button>
					</div>
				</div>
			</Scroller>
		</Panel>
	)
});

export default MainPanel;


