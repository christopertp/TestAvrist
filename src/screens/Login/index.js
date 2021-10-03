import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Text } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import DialogOverlay from './../../components/DialogOverlay'
import Button from './../../components/Button'
import { StackActions, useNavigation } from '@react-navigation/native';

export default function Login() {
    const TITLE_DIALOG_ERROR = "ERROR!"
    const TYPE_DIALOG_ERROR = "error"

    const navigation = useNavigation();

    const [dialogText, setDialogText] = useState('')
    const [isShowDialog, setIsShowDialog] = useState(false)

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string()
            .label('Password')
            .required('Please enter your password')
            .min(4, 'Password must have at least 4 characters')
    });

    const postData = (dataForAPI, resetForm, setSubmitting) => {
        console.log('post data ', dataForAPI);

        axios.post('https://reqres.in/api/login', dataForAPI)
            .then(result => {
                console.log('result : ', result.data.token)
                if (result.data.token === "QpwL5tke4Pnpja7X4") {
                    console.log("LOGIN OK!");
                    navigation.dispatch(StackActions.replace('Home'));
                }
            })
            .catch(error => {
                console.log('error : ', error)
                setIsShowDialog(true)
                setDialogText(error.response.data.error);
                console.log('error response ', error.response.data.error);
                resetForm()
                setSubmitting(false);
            })
    };

    const onBackOverlay = () => {
        setIsShowDialog(false)
    }

    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText} h3>Email Contact Employment</Text>
                <Text style={styles.headerText} h1>Insurance Company</Text>
            </View>
            <DialogOverlay visible={isShowDialog} toggleOverlay={onBackOverlay} title={TITLE_DIALOG_ERROR} content={dialogText} type={TYPE_DIALOG_ERROR} />
            <View
                style={styles.formContainer}
            >
                <Formik
                    initialValues={{
                        email: 'eve.holt@reqres.in',
                        password: 'cityslicka'
                    }}
                    onSubmit={(values, { setSubmitting, resetForm, setStatus }) => {
                        console.log('masuk submit formik', values)
                        postData(values, resetForm, setSubmitting)
                        resetForm({ values: initialValues })
                    }}
                    validationSchema={LoginSchema}
                >
                    {({ handleChange, values, handleSubmit, errors, isValid, touched, isSubmitting, handleBlur }) => (
                        <>
                            <Input
                                placeholder="Enter Email"
                                value={values.email}
                                leftIcon={{ type: 'antdesign', name: 'mail', size: 24 }}
                                keyboardType='email-address'
                                errorStyle={{ color: 'red' }}
                                returnKeyType='done'
                                autoCapitalize='none'
                                errorMessage={touched.email && errors.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                            />
                            <Input
                                value={values.password}
                                placeholder="Enter Password"
                                leftIcon={{ type: 'antdesign', name: 'lock', size: 24 }}
                                errorMessage={touched.password && errors.password}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                autoCapitalize='none'
                                returnKeyType='done'
                                secureTextEntry={true} />
                            <Button
                                containerStyle={styles.buttonContainer}
                                buttonStyle={styles.buttonStyle}
                                disabled={!isValid || isSubmitting}
                                onPress={handleSubmit}
                                title="Login"
                                loading={isSubmitting}
                            />
                        </>
                    )}
                </Formik>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 10
    },
    errorText: {
        color: 'red'
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
    formContainer: {
        marginTop: 24,
        marginHorizontal: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#e1e1e1',
        color: 'red',
    },
    // buttonContainer: {
    //     width: '100%',
    //     marginTop: 16,
    // },
    // buttonStyle: {
    //     backgroundColor: '#532A8C',
    // }
})
