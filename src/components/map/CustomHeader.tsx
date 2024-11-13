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
  showErrorToast,
} from '@/utils';
import { UseRouteProps } from '@/api/map';

const CustomHeader = ({
  isMain,
  today,
  date,
  setDate,
  route,
  setRouteId,
}: {
  isMain: boolean;
  today: Date;
  date?: Date;
  setDate?: (date: Date) => void;
  route?: UseRouteProps;
  setRouteId?: (routeId: number) => void;
}) => {
  const [isOpenSelectDate, setIsOpenSelectDate] = useState(false);

  const onPressNext = () => {
    if (isMain && !!date && !!setDate && !isSameOrAfter(today, date))
      setDate(changeDateByDays(date, 1));
    else if (!isMain && !!route && !!setRouteId && !!route.nextRouteId) {
      setRouteId(route.nextRouteId);
    } else showErrorToast('NO_NEXT');
  };

  const onPressPrev = () => {
    if (isMain && !!setDate && !!date) setDate(changeDateByDays(date, -1));
    else if (!isMain && !!route && !!setRouteId && !!route.previousRouteId) {
      console.log(route.previousRouteId);
      setRouteId(route.previousRouteId);
    } else showErrorToast('NO_PREV');
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
              mode='date'
              maximumDate={today}
              onConfirm={(date) => {
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
            {route && (
              <>
                <CustomText style={{ fontSize: 15, color: colors.BLACK }}>
                  {convertDateTimeFormat(new Date(route.createdAt))} 출발
                </CustomText>
                <CustomText
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    color: colors.GRAY_600,
                  }}>
                  {getTimeDifference(
                    new Date(route.createdAt),
                    new Date(route.endedAt),
                  )}{' '}
                  이동
                </CustomText>
              </>
            )}
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
