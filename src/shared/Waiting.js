import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import StyledButton from './StyledButton';

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    spacer: {
        height: 22
    }
});

export default ({ errorMessage, loading, onReset, style }) => <View style={[styles.loadingContainer, style]}>
    {errorMessage && (
        <View>
            <Text>{errorMessage}</Text>
            <View style={styles.spacer} />
            <StyledButton onPress={onReset} title="Retry" />
        </View>
    )}
    {!errorMessage && <ActivityIndicator />}
</View>;
