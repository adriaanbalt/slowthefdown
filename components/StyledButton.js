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
      disabled: this.props.disabled
    };

    if (Platform.OS === 'ios') {
      buttonProps.color = Colors.buttonForegroundColor;

      if (this.props.skin === 'minor') {
        return <View style={{
          padding: 11
        }}>{this.renderButton({
          ...buttonProps,
          color: '#777'
        })}</View>;
      }

      return <View style={{
        padding: 11,
        backgroundColor: Colors.buttonBackgroundColor
      }}>{this.renderButton(buttonProps)}</View>;
    }

    return this.renderButton(buttonProps);
  }
}


export default StyledButton;