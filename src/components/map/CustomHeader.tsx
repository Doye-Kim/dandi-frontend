import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import CustomText from '../common/CustomText';
import { LeftIcon, RightIcon } from '@/assets/icons';
import {
  changeDateByDays,
  convertDateFormat,
  convertDateTimeFormat,
  getTimeDifference,
  isSameOrAfter,
  responsive,
} from '@/utils';
import { UseRouteItem } from '@/api/map';

const CustomHeader = ({
  isMain,
  today,
  date,
  setDate,
  data,
  setData,
}: {
  isMain: boolean;
  today: Date;
  date?: Date;
  setDate?: (date: Date) => void;
  data?: UseRouteItem;
  setData?: (data: UseRouteItem) => void;
}) => {
  const [startTime, setStartTime] = useState(
    data && convertDateTimeFormat(new Date(data.createdAt)),
  );
  const [isOpenSelectDate, setIsOpenSelectDate] = useState(false);
  const [timeDiff, setTimeDiff] = useState<string>();
  useEffect(() => {
    if (data)
      setTimeDiff(
        getTimeDifference(new Date(data.createdAt), new Date(data.endedAt)),
      );
  }, []);
  const onPressNext = () => {
    if (isMain && date && setDate && !isSameOrAfter(today, date))
      setDate(changeDateByDays(date, 1));
  };

  const onPressPrev = () => {
    if (isMain && setDate && date) setDate(changeDateByDays(date, -1));
  };
  return (
    <HeaderContainer>
      <TouchableOpacity onPress={onPressPrev}>
        <LeftIcon />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!isMain}
        onPress={() => setIsOpenSelectDate(true)}
        style={{ width: responsive(312), alignItems: 'center' }}>
        {isMain && date && setDate ? (
          <>
            <CustomText style={{ fontSize: 16, color: colors.BLACK }}>
              {convertDateFormat(date)}
            </CustomText>
            <DatePicker
              modal
              open={isOpenSelectDate}
              date={date}
              mode="date"
              maximumDate={today}
              onConfirm={date => {
                setIsOpenSelectDate(false);
                setDate(date);
              }}
              onCancel={() => {
                setIsOpenSelectDate(false);
              }}
            />
          </>
        ) : (
          <View
            style={{
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomText style={{ fontSize: 15, color: colors.BLACK }}>
              {startTime} 출발
            </CustomText>
            <CustomText
              style={{ marginTop: 2, fontSize: 12, color: colors.GRAY_600 }}>
              {timeDiff} 이동
            </CustomText>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressNext}>
        <RightIcon />
      </TouchableOpacity>
    </HeaderContainer>
  );
};

export default CustomHeader;
const HeaderContainer = styled.View`
  height: 70px;
  background-color: ${colors.WHITE};
  z-index: 10;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  shadow-color: ${colors.GRAY_900};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;

  elevation: 4;
`;
