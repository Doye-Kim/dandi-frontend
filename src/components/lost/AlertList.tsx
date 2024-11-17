import React from 'react';
import { useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import AlertListItem from '@/components/lost/AlertListItem';
import { responsive } from '@/utils/common';
import { AlertData } from '@/types/lost';
import { showCustomErrorToast } from '@/utils';

interface AlertListProps {
  data: AlertData[];
  isSelectMode: boolean;
  selected: number[];
  handleSelect: (id: number) => void;
  handleLongPress: (id: number) => void;
  goToDetail: (itmeId: number, type?: string | undefined) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

const AlertList = ({
  data,
  isSelectMode,
  selected,
  handleSelect,
  handleLongPress,
  goToDetail,
  onEndReached,
  onEndReachedThreshold,
}: AlertListProps) => {
  return (
    <Container>
      <FlatList
        initialNumToRender={20}
        removeClippedSubviews={true}
        data={data}
        renderItem={({ item }) => {
          const itemId = item.foundItemId || item.lostItemId || item.commentId;
          const type = item.commentId ? item.title : undefined;

          return (
            <AlertListItem
              data={item}
              isSelectMode={isSelectMode}
              isSelected={selected.includes(item.id)}
              handleSelect={() => handleSelect(item.id)}
              handleLongPress={() => handleLongPress(item.id)}
              goToDetail={() => {
                if (itemId) {
                  goToDetail(itemId, type);
                } else {
                  showCustomErrorToast('분실물 정보를 찾을 수 없습니다.');
                }
              }}
            />
          );
        }}
        keyExtractor={(item, index) => `${item.id.toString() + index}`}
        contentContainerStyle={
          isSelectMode && { paddingBottom: responsive(70), flexGrow: 1 }
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
      />
    </Container>
  );
};

export default AlertList;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
`;
