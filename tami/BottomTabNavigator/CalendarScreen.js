"use client"

import { useState, useMemo } from "react"
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import { Calendar } from "react-native-calendars"
import { Plus } from "lucide-react-native"

const leftArrow = require("../assets/Images/Calendar/leftArrow.png")
const rightArrow = require("../assets/Images/Calendar/rightArrow.png")
const lineSeparator = require("../assets/Images/Calendar/line.png")
const addLogo = require('../assets/Images/Calendar/addLogo.png')

// 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 가져오는 함수
const getTodayDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, "0")
    const day = today.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
}

const CalendarScreen = () => {
  // 선택된 날짜를 저장하기 위한 state 추가 ---
  // 초기값으로 당일 날짜 설정
    const [selectedDate, setSelectedDate] = useState(getTodayDateString())

    const renderCustomHeader = (date) => {
        const header = date.toString("yyyy MMMM")
        const [year, month] = header.split(" ")
        return (
            <View style={styles.customHeaderContainer}>
                <Text style={styles.headerYear}>{year}</Text>
                <Text style={styles.headerMonth}>{month}</Text>
            </View>
        )
    }

  // 선택된 날짜에 따라 markedDates 객체를 동적으로 생성 ---
    const markedDates = useMemo(() => {
        if (!selectedDate) return {}
        return {
            [selectedDate]: {
                selected: true,
                // disableTouchEvent: true, // 이 옵션을 사용하면 선택된 날짜 재선택 방지 가능
                selectedColor: "#1485f7ff", // 피그마 디자인의 강조 색상으로 변경
                selectedTextColor: "#222B45",
            },
        }
    }, [selectedDate])

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.headerTitle}>캘린더</Text>

                <Calendar
                    markedDates={markedDates}
                    onDayPress={(day) => {
                        setSelectedDate(day.dateString)
                    }}
                    renderArrow={(direction) =>
                        direction === "left" ? (
                            <Image source={leftArrow} style={styles.arrowImage} />
                        ) : (
                            <Image source={rightArrow} style={styles.arrowImage} />
                        )
                    }
                    renderHeader={renderCustomHeader}
                    monthFormat={"yyyy MMMM"}
                    theme={{
                        backgroundColor: "#F2F7FE",
                        calendarBackground: "#F2F7FE",
                        textSectionTitleColor: "#8F9BB3",
                        todayTextColor: "#0080FF",
                        dayTextColor: "#222B45",
                        textDisabledColor: "#CED3DE",
                        monthTextColor: "#222B45",
                        textDayFontFamily: 'Pretendard-Regular',
                        textDayFontSize: 15,
                        textMonthFontSize: 28,
                        textDayHeaderFontSize: 14,
                        "stylesheet.calendar.header": {
                            week: {
                                marginTop: 15,
                                flexDirection: "row",
                                justifyContent: "space-around",
                            },
                        },
            // --- 수정사항 2-4: 선택된 날짜의 배경을 원에서 네모로 변경 ---
                        "stylesheet.day.basic": {
                            selected: {
                                backgroundColor: "#ADDEFF", // 테마 색상과 일치
                                borderRadius: 8, // 0으로 하면 직각, 숫자를 주면 둥근 사각형
                            },
                        },
                    }}
                    style={styles.calendar}
                />

                <Image source={lineSeparator} style={styles.separator} />

                <View style={styles.todoSection}>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>추가하기</Text>
                        <Image style={styles.addLogo} source={addLogo} />
                    </TouchableOpacity>

                    <View style={styles.wipCard}>
                        <Text style={styles.wipText}>체크리스트 기능 개발중...</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F2F7FE" },
    container: { paddingBottom: 100 },
    headerTitle: { fontSize: 22, fontFamily: 'Pretendard-Bold', textAlign: "center", marginVertical: 20, color: "#222B45" },
    calendar: { marginHorizontal: 20 },
    customHeaderContainer: { alignItems: "center", padding: 10 },
    headerYear: { fontSize: 13, fontFamily: 'Pretendard-Regular', color: "#8F9BB3" },
    headerMonth: { fontSize: 28, fontFamily: 'Pretendard-Bold', color: "#222B45", marginTop: 4 },
    arrowImage: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    separator: {
        width: "8%",
        height: 20,
        resizeMode: "contain",
        alignSelf: "center",
        marginVertical: 10,
    },
    todoSection: { marginTop: 10, paddingHorizontal: 20 },
    addButton: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginBottom: 10 },
    addButtonText: { color: "black", fontFamily: 'Pretendard-Bold', marginRight: 5 },
    addLogo: {width: 17, height: 17},
    wipCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    wipText: {
        fontSize: 16,
        color: "#8F9BB3",
        fontFamily: 'Pretendard-Regular'
    },
})

export default CalendarScreen
