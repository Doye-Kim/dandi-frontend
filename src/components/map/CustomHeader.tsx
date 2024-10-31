import { colors } from '@/constants';
import styled from 'styled-components/native';
import CustomText from '../common/CustomText';
import { LeftIcon, RightIcon } from '@/assets/icons';
import { TouchableOpacity } from 'react-native';
import {
  changeDateByDays,
  convertDateFormat,
  isSameOrAfter,
  responsive,
} from '@/utils';
import DatePicker from 'react-native-date-picker';
import { useState } from 'react';

const CustomHeader = () => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [open, setOpen] = useState(false);

  const onPressNext = () => {
    if (!isSameOrAfter(today, date)) setDate(changeDateByDays(date, 1));
  };

  const onPressPrev = () => {
    setDate(changeDateByDays(date, -1));
  };
  return (
    <HeaderContainer>
      <TouchableOpacity
        // style={{ backgroundColor: 'red' }}
        onPress={onPressPrev}>
        <LeftIcon />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{ width: responsive(312), alignItems: 'center' }}>
        <CustomText style={{ fontSize: 16, color: colors.BLACK }}>
          {convertDateFormat(date)}
        </CustomText>
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        maximumDate={today}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <TouchableOpacity
        // style={{ backgroundColor: 'red' }}
        onPress={onPressNext}
        disabled={isSameOrAfter(today, date)}>
        <RightIcon />
      </TouchableOpacity>
    </HeaderContainer>
  );
};

export default CustomHeader;
const HeaderContainer = styled.View`
  height: 70px;
  background-color: ${colors.WHITE};

  flex-direction: row;
  align-items: center;
  justify-content: center;

  shadow-color: ${colors.GRAY_900};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;

  elevation: 8;
`;
