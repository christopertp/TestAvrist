import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Overlay } from 'react-native-elements';
import { Text } from 'react-native-elements';

export default function LoadingOverlay({ visible, toggleOverlay}) {

    return (
        <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            // overlayStyle={styles.wrapper}
            overlayStyle={styles.wrapper}
        >
            <Text h1 style={styles.title, { color: '#5E608C' }}>Loading...</Text>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 24,
        // backgroundColor: "transparent",
        borderRadius:16,
        elevation: 0,
        shadowOpacity: 0
    },
})
