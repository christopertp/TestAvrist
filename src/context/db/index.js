import React, { useContext, useEffect } from 'react'
import { StyleSheet} from 'react-native'
import SQLite from "react-native-sqlite-storage";

const DBContext = React.createContext()

export function useDBContext(){
    return useContext(DBContext);
}

export function DBProvider({ children }) {

    useEffect(() => {
        createTable()
        return () => {
            // cleanup
        }
    }, [])

    const dbConnection = SQLite.openDatabase({
        name: 'testDB',
        location: 'default',
    }, () => {
        console.log('db success open')
    },
        err => {
            console.log('err ', err);
        }
    );


    const createTable = () => {
        dbConnection.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "users "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, email TEXT, avatar TEXT);"
            )
        })
    }

    return (
        <DBContext.Provider value={dbConnection}>
            {children}
        </DBContext.Provider>
    )
}

const styles = StyleSheet.create({})
