import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import AlertListItem from '@/components/lost/AlertListItem';
import { responsive } from '@/utils/common';
import { AlertListData } from '@/types/lost';

interface AlertListProps {
  data: AlertListData[];
  isSelectMode: boolean;
  selected: number[];
  handleSelect: (id: number) => void;
  handleLongPress: (id: number) => void;
  goToDetail: (id: number) => void;
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
        renderItem={({ item }) => (
          <AlertListItem
            data={item}
            isSelectMode={isSelectMode}
            isSelected={selected.includes(item.id)}
            handleSelect={() => handleSelect(item.id)}
            handleLongPress={() => handleLongPress(item.id)}
            goToDetail={() => goToDetail(item.id)}
          />
        )}
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
