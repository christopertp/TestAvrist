import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function Detail({ route }) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState({})

    useEffect(() => {
        console.log('route ', route);
        setUserData(route.params.user)
        console.log('item ', route.params.user);
        console.log('userData.first_name ',userData.first_name);
        return () => {

        }
    }, [])

    return (
        <View>
            <Text>Detail</Text>
            <Button title="back" onPress={() => {navigation.goBack()}}/>
            {
                userData
                &&
                <View style={styles.wrapperProfile}>
                    <Avatar
                        size={'xlarge'}
                        rounded
                        title={userData.first_name && userData.first_name.slice(0, 2)}
                        source={{
                            uri: userData.avatar,
                        }}
                    />
                    <Text h2>{userData.first_name} {userData.last_name}</Text>
                    <Text h4>{userData.email}</Text>
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    wrapperProfile: {
        backgroundColor: 'red',
        alignItems: 'center'
    }
})
