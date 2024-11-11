import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import AlertListItem from '@/components/lost/AlertListItem';
import { responsive } from '@/utils/common';
import { AlertData } from '@/types/lost';
import Toast from 'react-native-toast-message';

interface AlertListProps {
  data: AlertData[];
  isSelectMode: boolean;
  selected: number[];
  handleSelect: (id: number) => void;
  handleLongPress: (id: number) => void;
  goToDetail: (itmeId: number) => void;
}

const AlertList = ({
  data,
  isSelectMode,
  selected,
  handleSelect,
  handleLongPress,
  goToDetail,
}: AlertListProps) => {
  return (
    <Container>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          const itemId = item.foundItemId || item.lostItemId;

          return (
            <AlertListItem
              data={item}
              isSelectMode={isSelectMode}
              isSelected={selected.includes(item.id)}
              handleSelect={() => handleSelect(item.id)}
              handleLongPress={() => handleLongPress(item.id)}
              goToDetail={() => {
                if (itemId) {
                  goToDetail(itemId);
                } else {
                  Toast.show({
                    type: 'error',
                    text1: '해당 분실물 정보를 찾을 수 없습니다.',
                  });
                }
              }}
            />
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          !isSelectMode ? {} : { paddingBottom: responsive(70) }
        }
      />
    </Container>
  );
};

export default AlertList;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
`;
