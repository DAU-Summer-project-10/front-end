import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';

import addLogo from './Image/addLogo.png'

const AddEventForm = ({ selectedDate, onAdd }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');


  const handleSubmit = () => {
    if (!title) return;
    onAdd({
      id: Date.now(),
      date: selectedDate,
      title,
      time,
      location,
    });
    setTitle('');
    setTime('');
    setLocation('');
  };

  return (
    <View style={styles.form}>
      <TextInput placeholder="제목" value={title} onChangeText={setTitle} />
      <TextInput placeholder="시간" value={time} onChangeText={setTime} />
      <TextInput placeholder="장소" value={location} onChangeText={setLocation} />
      <Button title="추가하기" onPress={handleSubmit} />
    </View>
  );
};


const App = () => {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const renderHeader = (date) => {
    const year = dayjs(date).format('YYYY');
    const month = dayjs(date).format('MMMM');

    return (
      <View style={styles.header}>
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.month}>{month}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>캘린더</Text>
      </View>

      <Calendar
        style={styles.calendar}
        renderHeader={renderHeader}
        dayComponent={({ date, state }) => {
          const isSelected = date.dateString === selectedDate;
          const isToday = date.dateString === dayjs().format('YYYY-MM-DD');

          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(date.dateString)}
              style={[
                styles.dayBox,
                isSelected && styles.selectedBox,
                isToday && styles.todayBox,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedText,
                  state === 'disabled' && styles.disabledText,
                  isToday && styles.todayText,
                ]}
              >
                {date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
        theme={{
          backgroundColor: '#f2f7fe',
          calendarBackground: '#f2f7fe',
          textSectionTitleColor: '#333',
        }}
        renderArrow={(direction) => (
          <View style={styles.arrowBox}>
            <Image
              source={
                direction === 'left'
                  ? require('./Image/leftarrow.png')
                  : require('./Image/rightarrow.png')
              }
              style={styles.arrowImage}
            />
          </View>
        )}
      />
	  <View>
  		{events
    	  .filter((event) => event.date === selectedDate)
    	  .map((event) => (
      		<View key={event.id} style={styles.eventItem}>
        	  <Text>{event.title}</Text>
       		  <Text>{event.time}</Text>
              <Text>{event.location}</Text>
      		</View>
   		 ))}
	  </View>
	  <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
  		<Text style={styles.addButtonText}>추가하기</Text>
		<Image source={addLogo} style={styles.addLogo}></Image>
	  </TouchableOpacity>

	  {isModalVisible && (
  		<Modal visible={true} transparent={true} animationType="slide">
    		<View style={styles.modalContainer}>
     		<AddEventForm
      		  selectedDate={selectedDate}
    		    onAdd={(newEvent) => {
     		     setEvents([...events, newEvent]);
    		      setIsModalVisible(false);
    		    }}
  		    />
  		  </View>
 		 </Modal>
		)}
		<View style={styles.eventList}>
  		{events
    		.filter((event) => event.date === selectedDate)
    .map((event) => (
      <View key={event.id} style={styles.eventBlock}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventTime}>{event.time}</Text>
        <Text style={styles.eventLocation}>{event.location}</Text>
      </View>
    ))}
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f7fe',
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Regular',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  month: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Pretendard-Regular',
  },
  year: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Pretendard-Regular',
  },
  arrowBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e7f0',
    backgroundColor: '#f2f7fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    width: 13,
    height: 13,
  },
  calendar: {
    backgroundColor: '#f2f7fe',
  },
  dayBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedBox: {
    backgroundColor: '#007fff',
  },
  todayBox: {
    borderWidth: 1,
    borderColor: '#5662f6',
  },
  dayText: {
    color: '#333',
    fontFamily: 'Pretendard-Regular',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#cccccc',
  },
  addButton: {
	height: 40,
	width: 90,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
	justifyContent:'center',
	flexDirection: 'row',
	marginLeft: 315,
  },
  addButtonText: { 
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addLogo:{
	height: 17,
	width: 17,
	marginTop: 3,
	marginLeft: 3,
  },
  eventBlock: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventTime: {
    color: '#666',
    marginTop: 4,
  },
  eventLocation: {
    color: '#999',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

export default App;

