import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements';

export default function StyleButton(props, { onPress, type, title, buttonStyle, containerStyle }) {
    console.log('button ', props);
    return (
        <Button
            {...props}
            // buttonStyle={{backgroundColor: "#532A8C"}}
            // containerStyle={containerStyle}
            // onPress={onPress}
            // type={type}
            // title={title}
            buttonStyle={{ backgroundColor: "#532A8C", borderRadius: 3, marginHorizontal: 8 }}
            // titleStyle={{ color: '#ffffff' }}
        />
    )
}

const styles = StyleSheet.create({})
