import React from "react";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import Dispatchers from "../../redux/dispatchers";
import COLORS from "../../constants/Colors";
import ButtonCircle from "../../shared/ButtonCircle";
import Join from "./Join";

var { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "transparent",
		height: "100%",
	},
	closeBtn: {
		position: "absolute",
		zIndex: 2,
		top: 60,
		right: 10,
	},
	modal: {
		marginTop: 50,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		backgroundColor: COLORS.backgroundColor,
		// alignItems: "center",
		bottom: 10,
		width,
		padding: 20,
		height: "90%",
		shadowOffset: { width: 0, height: 0 },
		shadowColor: COLORS.shadowColor,
		shadowOpacity: COLORS.shadowOpacity,
		shadowRadius: COLORS.shadowRadius,
	},
});

class ModalLoginPhone extends React.Component {
	goBack = () => {
		this.props.navigation.goBack();
	};

	render() {
		return (
			<KeyboardAwareScrollView style={styles.container}>
				<View>
					<ButtonCircle
						style={styles.closeBtn}
						iconName='close'
						backgroundColor={COLORS.red}
						iconFamily='antdesign'
						iconStyle={{ paddingTop: 2 }}
						onPress={this.goBack}
					/>
					<View style={[styles.modal]}>
						<Join navigation={this.props.navigation} />
					</View>
					<TouchableOpacity
						onPress={this.goBack}
						style={styles.screen}
					/>
				</View>
			</KeyboardAwareScrollView>
		);
	}
}

export default connect(null, Dispatchers)(ModalLoginPhone);
