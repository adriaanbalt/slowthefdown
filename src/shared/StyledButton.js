import React from 'react';
import { Platform, Button, View } from 'react-native';
import Colors from '../constants/Colors';

class StyledButton extends React.Component {
  renderButton(buttonProps) {
    return <Button {...buttonProps} />;
  }

  render() {
    const buttonProps = {
      title: this.props.title,
      onPress: this.props.onPress,
      disabled: this.props.disabled,
    };

    if (Platform.OS === 'ios') {
      buttonProps.color = Colors.fontColor;

      return <View style={{
        borderWidth: 1,
        marginBottom: 10,
        borderColor: Colors.fontColor,
      }}>{this.renderButton(buttonProps)}</View>;
    }

    return this.renderButton(buttonProps);
  }
}


export default StyledButton;