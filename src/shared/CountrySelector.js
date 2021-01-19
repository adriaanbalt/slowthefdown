
import React, { useState } from 'react'
import CountryPicker from 'react-native-country-picker-modal'
import Colors from '../../constants/Colors'

export default function CountrySelector(props) {

    const THEME = {
        "activeOpacity": 0.5,
        "backgroundColor": Colors.backgroundColor,
        "filterPlaceholderTextColor": "#FFF",
        "flagSize": 30,
        "flagSizeButton": 30,
        "fontFamily": "System",
        "fontSize": 16,
        "itemHeight": 50,
        "onBackgroundTextColor": "#fff",
        "primaryColor": "#222",
        "primaryColorVariant": "#444",
    }


    const [countryCode, setCountryCode] = useState()
    const [country, setCountry] = useState(null)
    const [withCallingCodeButton, setWithCallingCodeButton] = useState(
        true,
    )
    const [withFlag, setWithFlag] = useState(true)
    const [withFilter, setWithFilter] = useState(true)
    const [withCallingCode, setWithCallingCode] = useState(true)
    const [withModal, setWithModal] = useState(true)
    const [visible, setVisible] = useState(false)
    const [disableNativeModal, setDisableNativeModal] = useState(false)
    const onSelect = (country) => {
        props.selectedCountry(country.callingCode[0]);
        setCountryCode(country.cca2)
        setCountry(country)
    }
    return (
        <CountryPicker
            theme={THEME}
            {...{
                containerButtonStyle: props.style,
                countryCode,
                withCallingCodeButton,
                withFilter,
                withFlag,
                withCallingCode,
                withModal,
                onSelect,
                disableNativeModal,
                preferredCountries: ['US'],
                onClose: () => setVisible(false),
                onOpen: () => setVisible(true),
            }}
        />
    )
}