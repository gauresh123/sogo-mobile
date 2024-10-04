import React, { useEffect, useRef, useState } from "react";
import {
  eachDayOfInterval,
  format,
  startOfMonth,
  endOfMonth,
  endOfDay,
} from "date-fns";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { useTheme, Text } from "react-native-paper";

const { width } = Dimensions.get("screen");

const HorizontalDatePicker = ({
  fromDate, // filter
  toDate, // filter
  startDate = startOfMonth(new Date()), // end of dates to show
  endDate = endOfMonth(new Date()), // start of dates to show
  onDateClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), "MMM"));

  const dates = eachDayOfInterval({
    start: new Date(startDate),
    end: endOfDay(new Date(endDate)),
  });
  const theme = useTheme();

  const CurrentIndex = dates.findIndex(
    (date) => date.getDate() === new Date().getDate()
  );
  const dateClicked = (date, i) => {
    onDateClick(date);
  };

  const ScrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    let index = Math.floor(contentOffset.x / 50);
    if (!index || index < 0 || contentOffset.x < 1) index = 0;
    const newMonth = format(dates[index], "MMM");
    if (newMonth !== currentMonth) setCurrentMonth(newMonth);
  };

  useEffect(() => {
    let timeoutId;
    if (ScrollViewRef.current) {
      timeoutId = setTimeout(() => {
        ScrollViewRef.current.scrollTo({
          y: CurrentIndex * 50 - width / 2 + 55,
        });
      }, 100);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, []);

  return (
    <View
      style={{
        height: "auto",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          transform: [{ rotate: "-90deg" }],
          fontWeight: "600",
          marginTop: "auto",
          marginBottom: "auto",
        }}
        variant="titleLarge"
      >
        {currentMonth}
      </Text>

      <ScrollView
        horizontal
        onScroll={handleScroll}
        scrollEventThrottle={200}
        ref={ScrollViewRef}
      >
        {dates.map((date, i) => {
          const highlightStyles =
            date >= fromDate && date <= toDate
              ? {
                  color: theme.colors.primary,
                  fontWeight: "700",
                }
              : {};
          const todayStyles =
            format(new Date(), "yyyy-MM-dd") ===
            format(new Date(date), "yyyy-MM-dd")
              ? {
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                }
              : {};
          return (
            <TouchableOpacity
              key={i}
              style={{
                justifyContent: "center",
                minHeight: 60,
                width: 50,
                ...todayStyles,
              }}
              onPress={() => dateClicked(date, i)}
            >
              <Text
                style={{
                  alignSelf: "center",
                  marginBottom: 5,
                  ...highlightStyles,
                }}
              >
                {format(date, "EEEE").substring(0, 3)}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  marginBottom: 5,
                  ...highlightStyles,
                }}
              >
                {format(date, "do").substring(0, format(date, "do").length - 2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HorizontalDatePicker;
