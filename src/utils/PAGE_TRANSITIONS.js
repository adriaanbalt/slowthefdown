import { isIphoneX } from "react-native-iphone-x-helper";
import { Animated } from "react-native";
import COLORS from "../constants/Colors";

const { add, multiply } = Animated;

/**
 * Standard iOS-style modal animation in iOS 13.
 * https://github.com/react-navigation/react-navigation/blob/master/packages/stack/src/TransitionConfigs/CardStyleInterpolators.tsx
 * forModalPresentationIOS()
 */
const cardStyleInterpolator = (params) => {
	const {
		index,
		current,
		next,
		inverted,
		layouts: { screen },
		insets,
	} = params;
	const modalHeight = screen.height;
	const isLandscape = screen.width > modalHeight;
	const topOffset = 0;
	const statusBarHeight = insets.top;
	const aspectRatio = modalHeight / screen.width;

	const progress = add(
		current.progress.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1],
			extrapolate: "clamp",
		}),
		// 0
		next
			? next.progress.interpolate({
					inputRange: [0, 1],
					outputRange: [0, 1],
					extrapolate: "clamp",
			  })
			: 0,
	);

	const nextOpacity = multiply(
		progress.interpolate({
			inputRange: [0, 1, 2],
			outputRange: [1, 1, 1],
		}),
		inverted,
	);

	const translateY = multiply(
		progress.interpolate({
			inputRange: [0, 1, 2],
			outputRange: [
				modalHeight,
				!!next ? 0 : topOffset,
				(!!next ? 0 : 0) - topOffset * aspectRatio,
			],
		}),
		inverted,
	);

	const overlayOpacity = progress.interpolate({
		inputRange: [0, 1, 1.0001, 2],
		outputRange: [0, 0.3, 1, 1],
	});

	const scale = isLandscape
		? 1
		: progress.interpolate({
				inputRange: [0, 1, 2],
				outputRange: [
					1,
					1,
					screen.width ? 1 - (10 * 2) / screen.width : 1,
				],
		  });

	const borderRadius = isLandscape
		? 0
		: !!next
		? progress.interpolate({
				inputRange: [0, 1, 1.0001, 2],
				outputRange: [0, 0, isIphoneX() ? 38 : 0, 10],
		  })
		: 10;

	return {
		cardStyle: {
			overflow: "hidden",
			borderTopLeftRadius: borderRadius,
			borderTopRightRadius: borderRadius,
			marginTop: 0,
			opacity: nextOpacity,
			transform: [{ translateY, scale }],
		},
		overlayStyle: { opacity: overlayOpacity },
	};
};

export default {
	FADE_IN: {
		gestureEnabled: false,
		transitionSpec: {
			open: {
				animation: "timing",
				config: {
					duration: 75,
				},
			},
		},
		cardStyleInterpolator: ({ current, next, layouts }) => {
			return {
				cardStyle: {
					opacity: current
						? current.progress.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 1],
						  })
						: 1,
				},
			};
		},
	},
	MODAL: {
		gestureDirection: "vertical",
		gestureEnabled: true,
		cardStyleInterpolator,
		cardStyle: {
			backgroundColor: COLORS.backgroundColor,
		},
	},
	HORIZONTAL_IN_SCALE_LAST: {
		gestureDirection: "horizontal",
		transitionSpec: {
			open: {
				animation: "timing",
				config: {
					duration: 75,
				},
			},
			close: {
				animation: "timing",
				config: {
					duration: 75,
				},
			},
		},
		cardStyleInterpolator: ({ current, next, layouts }) => {
			return {
				cardStyle: {
					transform: [
						{
							translateX: current.progress.interpolate({
								inputRange: [0, 1],
								outputRange: [layouts.screen.width, 0],
							}),
						},
						{
							translateX: next
								? next.progress.interpolate({
										inputRange: [0, 1],
										outputRange: [0, -100],
								  })
								: 0,
						},
					],
					opacity: next
						? next.progress.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
						  })
						: 1,
				},
				overlayStyle: {
					opacity: current.progress.interpolate({
						inputRange: [0, 1],
						outputRange: [0, 0.1],
					}),
				},
			};
		},
	},
};
