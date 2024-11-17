import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import AlertListItem from '@/components/lost/AlertListItem';
import { responsive } from '@/utils/common';
import { AlertData } from '@/types/lost';
import { showCustomErrorToast } from '@/utils';
import { ActivityIndicator } from 'react-native';

interface AlertListProps {
  data: AlertData[];
  isSelectMode: boolean;
  selected: number[];
  handleSelect: (id: number) => void;
  handleLongPress: (id: number) => void;
  goToDetail: (
    itmeId: number,
    readId?: number | undefined,
    type?: string | undefined,
  ) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  isLoading?: boolean;
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
  isLoading,
}: AlertListProps) => {
  return (
    <Container>
      <FlatList
        initialNumToRender={20}
        maxToRenderPerBatch={60}
        style={{ flex: 1 }}
        data={data}
        extraData={data}
        keyExtractor={(item) => `${item.id.toString()}`}
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
                  goToDetail(itemId, item.id, type);
                } else {
                  showCustomErrorToast('분실물 정보를 찾을 수 없습니다.');
                }
              }}
            />
          );
        }}
        contentContainerStyle={
          isSelectMode && { paddingBottom: responsive(70) }
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
      />
    </Container>
  );
};

export default AlertList;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.WHITE};
`;
