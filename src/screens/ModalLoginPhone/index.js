import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Dispatchers from "../../redux/dispatchers";
import COLORS from "../../constants/Colors";
import ButtonCircle from "../../shared/ButtonCircle";
import Join from "./Join";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "transparent",
		height: "100%",
	},
	closeBtn: {
		zIndex: 2,
		top: 60,
	},
	modal: {
		marginTop: 50,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		backgroundColor: COLORS.backgroundColor,
		// alignItems: "center",
		bottom: 10,
		width: "100%",
		padding: 20,
	},
});

class ModalLoginPhone extends React.Component {
	goBack = () => {
		this.props.navigation.goBack();
	};

	render() {
		return (
			<React.Fragment>
				<ButtonCircle
					style={styles.closeBtn}
					iconName='close'
					backgroundColor={COLORS.backgroundColor}
					iconFamily='antdesign'
					iconStyle={{ paddingTop: 2 }}
					onPress={this.goBack}></ButtonCircle>
				<View style={[styles.modal]}>
					<Join
						navigation={this.props.navigation}
						setUserDataLocal={this.props.setUserDataLocal}
					/>
				</View>
				<TouchableOpacity onPress={this.goBack} style={styles.screen} />
			</React.Fragment>
		);
	}
}

export default connect(null, Dispatchers)(ModalLoginPhone);
