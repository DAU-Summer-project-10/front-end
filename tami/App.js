import React from 'react'
import {
	View,
    Text,
	StyleSheet,
	ScrollView,
    SafeAreaView
} from 'react-native'



const App = () => {
	return (
		<SafeAreaView style={styles.testContainer}>
            <Text style={styles.testText}>테스트</Text>
        </SafeAreaView>
	)
}

const styles = StyleSheet.create({
	testContainer: {
		borderRadius: 10,
		justifyContent: 'center',
		margin: 20
	},
	testText: {
		fontSize: 25,
		marginVertical: 10,
		marginHorizontal: 20,
		color: 'black',
		fontFamily: 'Pretendard-Regular'
	}
})

export default App