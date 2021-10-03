import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackActions, useNavigation } from '@react-navigation/native';

export default function Splash() {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            console.log('navigate');
            navigation.dispatch(StackActions.replace('Home'));
        }, 1000);
        return () => {
        }
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Splash Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
