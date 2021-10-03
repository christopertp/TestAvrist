import React, { useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ListItem, Avatar, FAB, Text } from 'react-native-elements'
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDBContext } from './../../context/db'

export default function Home() {
    const db = useDBContext()
    const navigation = useNavigation();

    const [listUser, setListUser] = useState([])
    const [page, setPage] = useState(1)

    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('trigger home');
        getDataDB()
        return () => {
            // cleanup
        }
    }, [isFocused])

    const getData = () => {
        // Call API GET
        axios.get(`https://reqres.in/api/users?page=${page}&per_page=20`)
            .then(result => {
                setListUser([...listUser, ...result.data.data])
                console.log('result : ', listUser)
            })
            .catch(error => console.log('error : ', error))
    };

    const getDataDB = async () => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT id, first_name, last_name, email, avatar FROM users",
                    [],
                    (tx, result) => {
                        const len = result.rows.length;
                        if (len > 0) {
                            const dbDataList = [];
                            for (let index = 0; index < result.rows.length; index++) {
                                dbDataList.push(result.rows.item(index));

                            }
                            setListUser(dbDataList)
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error);
        }
    }

    const keyExtractor = (item, index) => { index.toString() }

    const loadMoreData = async () => {
        setPage(page + 1)
        console.log('bottom reach ', page);
    }

    const seeDetailUser = (user) => {
        navigation.navigate('EditUser', { user })
    }


    const renderItem = ({ key, item }) => (
        <TouchableOpacity onPress={() => seeDetailUser(item)}>
            <ListItem bottomDivider>
                <Avatar
                    title={item.first_name && item.first_name.slice(0, 2)}
                    source={{ uri: item.avatar || "https://i2.wp.com/ui-avatars.com/api//AB/128/532A8C/FFFFFF/?ssl=1", }}
                />
                <ListItem.Content>
                    <ListItem.Title>{item.first_name}</ListItem.Title>
                    <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </TouchableOpacity>
    )

    const createUser = () => {
        navigation.navigate('EditUser')
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText} h3>Email Contact Employment</Text>
                <Text style={styles.headerText} h2>Insurance Company</Text>
            </View>
            {
                listUser.length > 0
                    ? (
                        <FlatList
                            onEndReached={loadMoreData}
                            style={styles.listContainer}
                            keyExtractor={keyExtractor}
                            data={listUser}
                            renderItem={renderItem}
                        />
                    )
                    : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Empty Contact</Text>
                        </View>
                    )
            }
            <FAB
                onPress={() => { createUser() }}
                style={styles.fab}
                color="#532A8C"
                title="Create" />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        // backgroundColor: '#0D0D0D',
        width: '100%',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    emptyText:{
        color:'#0D0D0D',
        fontSize:14,
        fontWeight:'600',
    },
    headerContainer: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#5E608C',
    },
    headerText: {
        textAlign: 'center',
        color: 'white',
    },
})
