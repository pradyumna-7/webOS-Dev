import Button from '@enact/sandstone/Button';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import Slider from '@enact/sandstone/Slider';
import CheckboxItem from '@enact/sandstone/CheckboxItem';

const SecondaryPanel = kind({
	name: 'SecondaryPanel',
	
	handlers: {
		onBack: (ev, {onNavigate}) => {
			onNavigate({panel: 'main'});
		}
	},

	render: ({onBack, ...rest}) => (
		<Panel {...rest}>
			<Header title="Secondary Panel" />
			<Scroller>
				<div style={{padding: '20px'}}>
					<h2>This is a secondary view</h2>
					<p>Explore more Enact components below:</p>
					
					<Slider
						defaultValue={50}
						min={0}
						max={100}
						step={1}
						tooltip
					/>
					
					<CheckboxItem>Option 1</CheckboxItem>
					<CheckboxItem>Option 2</CheckboxItem>
					<CheckboxItem>Option 3</CheckboxItem>
					
					<div style={{marginTop: '20px'}}>
						<Button onClick={onBack}>
							Back to Main Panel
						</Button>
					</div>
				</div>
			</Scroller>
		</Panel>
	)
});

export default SecondaryPanel;
