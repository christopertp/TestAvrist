import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Overlay } from 'react-native-elements';
import { Text } from 'react-native-elements';

export default function DialogOverlay({ visible, toggleOverlay, content, title, type }) {

    const colorTitle = (type) => {
        switch (type) {
            case 'warning':
                return '#ffea00'
                break;
            case 'error':
                return '#ff6e40'
                break;

            default:
                return '#000'
                break;
        }
    }

    return (
        <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            // overlayStyle={styles.wrapper}
            overlayStyle={styles.wrapper}
        >
            <Text h1 style={styles.title, { color: colorTitle(type) }}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: 24,
        paddingHorizontal: 24,
        // backgroundColor: "transparent",
        borderRadius:16,
        elevation: 0,
        shadowOpacity: 0
    },
    title: {

    },
    content: {
        color:'#424242',
        fontSize: 16,
    }
})
