// @flow
import React from 'react';
import type { Element as ReactElement } from 'react';
import RsgWrapper from 'react-styleguidist/lib/rsg-components/Wrapper';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const RsgMuiWrapper = ({ children, ...rest }: { children: ReactElement<*>, }) => (
	<RsgWrapper {...rest}>
		{children}
	</RsgWrapper>
);

export default RsgMuiWrapper;
