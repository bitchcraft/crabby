// @flow
import React, { Component, cloneElement } from 'react';
import shallowEqual from 'recompose/shallowEqual';
import debounce from 'lodash/debounce';
import clamp, { SplitPatterns } from 'src/tools/clamp';
import getLineHeightForElement from 'src/tools/getLineHeightForElement';
import createTargetCondition from 'src/tools/createTargetCondition';

import type { Element as ReactElement } from 'react';




type Props = {
	/** Text to clamp */
	children?: string,
	/** Allow collapsing after expanding */
	collapsable?: boolean,
	/** Expand button label string or expand button component */
	collapseLabel?: string | ReactElement<*>,
	/** Override style for container */
	containerStyle?: { [string]: *, },
	/** Suffix that is added to the clamped text to indicate clamping */
	ellipsis?: string,
	/** Expand button label string or expand button component */
	expandLabel?: string | ReactElement<*>,
	/** The number of lines to display. Adds an expand action when clamping lines. */
	lines?: number,
	/** Override style for expand button label */
	labelStyle?: { [string]: *, },
	/** Styles for text */
	textStyle?: { [string]: *, },
};

type State = {
	clampedText: ?string,
	didResize?: boolean,
	firstPass: boolean,
	isClamped?: boolean,
	isCollapsed: boolean,
	isFit?: boolean,
	propsChanged?: boolean,
};


/**
 * Component to clamp plaintext to a fixed number of lines.
 */
class ClampText extends Component<Props, State> {
	static defaultProps = {
		collapsable: false,
		collapseLabel: '⌃',
		ellipsis: '…',
		expandLabel: 'read more',
		lines: 2,
	}

	constructor(props: Props) {
		super(props);

		this.state = {
			clampedText: props.children,
			firstPass: true,
			isCollapsed: true,
		};
	}

	componentDidMount() {
		setTimeout(this.clamp, 50);
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return !shallowEqual(nextProps, this.props)
			|| !shallowEqual(nextState, this.state);
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		const { didResize, isCollapsed, propsChanged } = this.state;
		const collapseChange = prevState.isCollapsed !== this.state.isCollapsed;
		const propsChange = !shallowEqual(prevProps, this.props);

		// do not reclamp for collapse state changes
		if (collapseChange && !didResize && !propsChange && !propsChanged) return;

		// initialize state when props changed
		if (propsChange) {
			this.handleNewPropsChange();
			return;
		}

		// reclamp on props changed or document resize
		if (isCollapsed && (propsChanged || didResize)) {
			setTimeout(this.clamp, 150);
		}
	}

	componentWillUnmount() {
		this.removeClampListeners();
	}

	render() {
		const { children, containerStyle, textStyle } = this.props;
		const { clampedText, isClamped, isCollapsed } = this.state;

		if (!children) return null;

		return (
			<div
				ref={(r) => { this.clampContainerRef = r; }}
				style={containerStyle}>

				<div style={Object.assign({}, { fontSize: 14 }, textStyle)}>

					<span>{isCollapsed && clampedText && isClamped ? clampedText : children}</span>
					{this.renderReadMoreElement()}

				</div>

			</div>
		);
	}

	clampContainerRef: ?HTMLDivElement

	/**
	 * Read more button
	 * @private
	 * @method renderReadMoreButton
	 * @return {ReactElement<HTMLButtonElement>}
	 */
	renderReadMoreElement = () => {
		const {
			collapsable,
			collapseLabel,
			expandLabel,
			labelStyle,
		} = this.props;

		const {
			firstPass,
			isClamped,
			isCollapsed,
			isFit,
		} = this.state;

		if (!firstPass && isFit && !isClamped) return null;
		if (!firstPass && !isCollapsed && !collapsable) return null;
		if (!firstPass && !isClamped && !isCollapsed) return null;

		const baseStyle = {
			background: 'none',
			border: 'none',
			color: 'rgb(255, 180, 220)',
			cursor: 'pointer',
			margin: 0,
			marginLeft: 8,
			outline: 'none',
			padding: 0,
		};
		const style = Object.assign({}, baseStyle, labelStyle);

		if (typeof expandLabel === 'object' && isCollapsed) {
			return cloneElement(expandLabel, {
				onTouchTap: this.onReadMoreClick,
				style,
			});
		}

		if (typeof collapseLabel === 'object' && !isCollapsed) {
			return cloneElement(collapseLabel, {
				onTouchTap: this.onCollapseClick,
				style,
			});
		}

		return (
			<button
				onTouchTap={isCollapsed ? this.onReadMoreClick : this.onCollapseClick}
				style={style}>
				{isCollapsed ? expandLabel : collapseLabel}
			</button>
		);
	}

	/**
	 * Clamps the description if necessary
	 * @private
	 * @method clampDescription
	 * @return {void}
	 */
	clamp = debounce(() => {
		const { ellipsis: suffix, children: original, lines } = this.props;
		const { isCollapsed } = this.state;
		const { clampContainerRef } = this;

		if (!original || !clampContainerRef || !isCollapsed || typeof lines !== 'number') return;

		this.setState({ firstPass: false });

		const textElement = clampContainerRef.firstChild;
		if (!textElement || !(textElement instanceof HTMLElement)) return;
		const lineHeight = getLineHeightForElement(textElement);

		if (textElement.offsetHeight <= lineHeight * Number(lines)) {
			this.setState({
				isClamped: false,
				isFit: true,
			});
			return;
		}

		// clone elements for clamping while bypassing component lifecycles
		const clonedClampContainerElement = clampContainerRef.cloneNode(true);
		const cloneContainerElement = document.createElement('div');
		const cloneElementStyle = [
			'display: block',
			'padding: 0',
			'visibility: hidden',
			'z-index: -10000',
			`width: ${clampContainerRef.offsetWidth}px`,
		].join(';');
		cloneContainerElement.setAttribute('style', cloneElementStyle);
		cloneContainerElement.appendChild(clonedClampContainerElement);
		document.getElementsByTagName('body')[0].appendChild(cloneContainerElement);

		const clonedTextElement = clonedClampContainerElement.firstChild;
		if (!clonedTextElement || !(clonedTextElement instanceof HTMLElement)) {
			this.setState({ isClamped: false });
			return;
		}

		const sentences = original.split(SplitPatterns.SENTENCES).filter(c => Boolean(c));
		const testFunction = createTargetCondition(clonedTextElement, lines);
		const clamped = clamp(sentences, testFunction, { suffix });
		const isClamped = clamped !== original;

		this.setState({
			clampedText: !isClamped ? null : clamped,
			isClamped,
			isFit: clamped === original,
			didResize: false,
		});

		document.getElementsByTagName('body')[0].removeChild(cloneContainerElement);

		window.addEventListener('resize', this.onResize);
	}, 250, {
		leading: true,
		maxWait: 5000,
		trailing: true,
	})

	/**
	 * Remove event listeners
	 * @method removeClampListeners
	 * @return {void}
	 */
	removeClampListeners = () => window.removeEventListener('resize', this.onResize)

	/**
	 * Read more button click handler
	 * @method onReadMoreClick
	 * @param {SyntheticEvent<HTMLElement>} event
	 * @return {void}
	 */
	onReadMoreClick = (event: SyntheticEvent<HTMLElement>) => {
		event.stopPropagation();
		this.setState({ isCollapsed: false });
	}

	/**
	 * Event handler for collapse button clicks
	 * @method onCollapseClick
	 * @param {SyntheticEvent<HTMLElement>} event
	 * @return {void}
	 */
	onCollapseClick = (event: SyntheticEvent<HTMLElement>) => {
		event.stopPropagation();
		this.setState({ isCollapsed: true });
	}

	/**
	 * Debounced window resize events handler
	 *
	 * @method onResize
	 * @param {Event<EventTarget>} event
	 * @return {void}
	 */
	onResize = debounce(
		(event: Event<EventTarget>): void => {
			this.setState({ didResize: true });
		},
		250
	)

	handleNewPropsChange = (
		firstPass?: boolean = true,
		isCollapsed?: boolean = true,
		propsChanged?: boolean = true,
	) => {
		this.setState({
			clampedText: null,
			isClamped: false,
			isCollapsed,
			firstPass,
			propsChanged,
		});
	}
}

export default ClampText;
