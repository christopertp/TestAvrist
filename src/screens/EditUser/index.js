import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
    StyleSheet,
    View,
    PermissionsAndroid,
    Platform,
} from 'react-native'
import { Formik } from 'formik';
import { Input, Text, Avatar } from 'react-native-elements';
import axios from 'axios';
import * as Yup from 'yup'
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import CameraRoll from "@react-native-community/cameraroll";
import { useDBContext } from './../../context/db'
import LoadingOverlay from './../../components/LoadingOverlay';
import Button from './../../components/Button';

export default function EditUser({ route }) {
    const initUser = {
        avatar: "https://i2.wp.com/ui-avatars.com/api//AB/128/5E608C/FFFFFF/?ssl=1",
        email: "",
        first_name: "",
        ID: 1,
        last_name: "",
    };

    const navigation = useNavigation();
    const ref = useRef(null);
    const [userData, setUserData] = useState(initUser)
    const [imageProfile, setImageProfile] = useState('')
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isUpdatingData, setIsUpdatingData] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)
    const db = useDBContext()

    useEffect(() => {
        console.log('user ', route.params?.user);
        if (route.params?.user) {
            setUserData(route.params.user)
            setIsEmpty(false);
        }

        return () => {
            // cleanup
        }
    }, [])


    const putData = () => {
        // Call API PUT
        axios.put(`https://reqres.in/api/users/${userData.ID}`, userData)
            .then(result => {
                console.log('result : ', result)
            })
            .catch(error => console.log('error : ', error))
    };


    const hasAndroidPermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        console.log('hasPermission ', hasPermission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    const doPickImage = async () => {
        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            return;
        }

        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {

            console.log('before picker process ref value ', ref);
            console.log('before picker process userdata ', userData);

            ref.current.set
            setUserData({
                ...ref.current.values,
                avatar: image.path,
            })

            console.log('picker process userData', userData);

            try {
                CameraRoll.save(image.path, {
                    type: "photo",
                    album: "./avatarCollection"
                }).
                    then((res) => {
                        console.log("save img...", res);
                    }).
                    catch((err) => {
                        console.log("err for save img...", err);
                    })
            } catch {
                //your code...
            }

        });
    }


    const updateDataDB = async (formData) => {
        try {
            await db.transaction(async (tx) => {
                console.log('formData update ', formData);
                await tx.executeSql(
                    "UPDATE Users SET first_name=?, last_name=?, email=?, avatar=? WHERE ID=?",
                    [formData.first_name, formData.last_name, formData.email, formData.avatar, formData.ID],
                    () => { Alert.alert('Success!', 'Data Updated!') },
                    err => console.log('err', err)
                )
            })

            // getDataDB();
        } catch (error) {
            console.log(error);
        }
    }

    const insertDataDB = async (userData) => {
        try {
            await db.transaction(async (tx) => {
                await tx.executeSql(
                    "INSERT INTO users (first_name, last_name, email, avatar) VALUES (?,?,?,?)",
                    [userData.first_name, userData.last_name, userData.email, userData.avatar]
                )
            })
            await db.transaction(async (tx) => {


                await tx.executeSql(
                    "SELECT seq FROM sqlite_sequence WHERE name='users'",
                    [],
                    (tx, result) => {
                        const len = result.rows.length;
                        console.log('len last id');
                        if (len > 0) {
                            setUserData({
                                ...userData,
                                ID: result.rows.item(0).seq
                            })
                            console.log('last id ', result.rows.item(0));
                            Alert.alert('Success!', 'Data Created!')
                        }
                    }
                )
                console.log('tx ', tx);
            })
            setIsEmpty(false);
        } catch (error) {
            console.log(error);
        }
    }




    const doProcessForm = (formData, setSubmitting) => {
        console.log('formData ', formData);
        setIsUpdatingData(true)

        console.log('before form process userdata ', userData);
        setUserData(
            {
                ...userData,
                avatar: formData.avatar,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
            }
        )

        console.log('form process userData', userData);
        if (isEmpty) {
            console.log('insert db');
            insertDataDB(formData);
        } else {
            console.log('update db');
            console.log('ld ', userData.ID);
            updateDataDB(formData);
        }

        putData();
        setSubmitting(false);
        setIsUpdatingData(false)
    }

    const getAbbrName = () => {
        return userData.first_name.slice(0, 2) || "ab";
    }


    const LoginSchema = Yup.object().shape({
        first_name: Yup.string()
            .label('First Name')
            .required('Please enter your first name')
            .min(4, 'First name must have at least 4 characters'),
        last_name: Yup.string()
            .label('Last Name')
            .required('Please enter your last name')
            .min(4, 'Last name must have at least 4 characters'),
        email: Yup.string().email('Invalid email').required('Required'),
    });

    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText} h1>Contact Detail</Text>
            </View>
            <LoadingOverlay visible={isLoadingData} />
            <View style={styles.wrapperUser}>
                <Avatar
                    size={'xlarge'}
                    rounded
                    title={getAbbrName}
                    source={{
                        uri: userData.avatar,
                    }}
                >
                    <Avatar.Accessory size={48} onPress={() => doPickImage(``)} />
                </Avatar>
                <Formik
                    innerRef={ref}
                    // isInitialValid={(val) => {
                    //     // console.log('Formik userData ', userData);
                    // }}
                    enableReinitialize
                    initialValues={userData}
                    onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
                        setSubmitting(true)
                        doProcessForm(values, setSubmitting)
                    }}
                    validationSchema={LoginSchema}
                >
                    {({ handleChange, values, handleSubmit, errors, isValid, touched, isSubmitting, handleBlur }) => {
                        return (
                            <>
                                <Input
                                    value={values.first_name}
                                    placeholder="First Name"
                                    errorMessage={touched.first_name && errors.first_name}
                                    onChangeText={handleChange('first_name')}
                                    onBlur={handleBlur('first_name')}
                                    autoCapitalize='none'
                                    returnKeyType='done' />
                                <Input
                                    value={values.last_name}
                                    placeholder="Last Name"
                                    errorMessage={touched.lastName && errors.last_name}
                                    onChangeText={handleChange('last_name')}
                                    onBlur={handleBlur('last_name')}
                                    autoCapitalize='none'
                                    returnKeyType='done' />
                                <Input
                                    placeholder="Enter Email"
                                    value={values.email}
                                    keyboardType='email-address'
                                    errorStyle={{ color: 'red' }}
                                    returnKeyType='done'
                                    autoCapitalize='none'
                                    errorMessage={touched.email && errors.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                />
                                <Button
                                    containerStyle={styles.buttonContainer}
                                    buttonStyle={styles.buttonStyle}
                                    disabled={!isValid || isSubmitting}
                                    onPress={handleSubmit}
                                    type="solid"
                                    title={isEmpty ? "SAVE" : "EDIT"}
                                    loading={isUpdatingData}
                                />
                            </>
                        )
                    }
                    }
                </Formik>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperUser: {
        marginTop: 24,
        alignItems: 'center',
        backgroundColor: '#e1e1e1',
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginHorizontal: 24,
    },
    headerContainer: {
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#5E608C',
    },
    headerText: {
        textAlign: 'center',
        color: 'white',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 16,
    },
    buttonStyle:{
        backgroundColor:'#532A8C',
    }
})
