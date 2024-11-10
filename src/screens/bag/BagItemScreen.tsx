import React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import styled from 'styled-components/native';
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard';
import { bagNavigations, colors } from '@/constants';
import { BagStackParamList } from '@/navigations/stack/BagStackNavigator';
import { DropdownIcon } from '@/assets/icons';
import { responsive, responsiveVertical } from '@/utils';
import CustomItemHeader from '@/components/bag/item/CustomItemHeader';
import CustomText from '@/components/common/CustomText';
import AuthButton from '@/components/auth/AuthButton';
import useBagStore from '@/store/useBagStore';
import {
  useCreateBagItemMutation,
  useEditBagItemMutation,
} from '@/queries/bagQueries';

type BagItemScreenRouteProp = RouteProp<
  BagStackParamList,
  typeof bagNavigations.BAG_ITEM
>;

const BagItemScreen = ({ route }: { route: BagItemScreenRouteProp }) => {
  const navigation = useNavigation<NavigationProp<BagStackParamList>>();
  const selectBagId = useBagStore((state) => state.selectBagId);
  const { item } = route?.params || {};
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [selectEmoji, setSelectEmoji] = useState<string>(
    item ? item.emoticon : '❔',
  );
  const [name, setName] = useState<string>(item ? item.name : '');
  const [colorKey, setColorKey] = useState<number>(item ? item.colorKey : 0);
  const [backColor, setBackColor] = useState(
    item
      ? colors[`THINGS_BACK_${item.colorKey}` as keyof typeof colors]
      : colors.THINGS_BACK_0,
  );
  const nameRef = useRef<TextInput>(null);

  const handlePressEmoji = () => {
    setIsOpenDropdown(false);
    nameRef.current?.blur();
    setIsOpenEmojiPicker((prev) => !prev);
  };

  const handleFocusInput = () => {
    setIsOpenEmojiPicker(false);
    setIsOpenDropdown(false);
  };

  const handlePick = (emojiObject: EmojiType) => {
    setSelectEmoji(emojiObject.emoji);
  };

  const handleChangeText = (text: string) => {
    setName(text);
  };

  const handleToggleDropdown = () => {
    nameRef.current?.blur();
    setIsOpenEmojiPicker(false);
    setIsOpenDropdown((prev) => !prev);
  };

  useEffect(() => {
    setBackColor(colors[`THINGS_BACK_${colorKey}` as keyof typeof colors]);
  }, [colorKey]);

  const onSelectOption = (option: number) => {
    setColorKey(option);
  };

  const editMutation = useEditBagItemMutation();
  const createMutation = useCreateBagItemMutation();

  const handlePressConfirm = () => {
    console.log('confirm', selectEmoji, name, colorKey);
    if (!name) {
      Toast.show({
        type: 'error',
        text1: '이름을 입력해 주세요',
      });
    } else {
      try {
        if (item) {
          editMutation.mutateAsync({
            id: item.itemId,
            requestItem: {
              emoticon: selectEmoji,
              name: name,
              colorKey: colorKey,
            },
          });
        } else {
          createMutation.mutate({
            bagId: selectBagId,
            emoticon: selectEmoji,
            name: name,
            colorKey: colorKey,
          });
        }
        navigation.navigate(bagNavigations.BAG_MAIN);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <StyledContainer>
      <CustomItemHeader {...(item ? { itemId: item.itemId } : {})} />
      <View style={{ padding: 40 }}>
        <StyleOptionContainer>
          <StyleTitleText>아이콘</StyleTitleText>
          <TouchableOpacity onPress={handlePressEmoji}>
            <CustomText style={{ fontSize: 50 }}>{selectEmoji}</CustomText>
          </TouchableOpacity>
        </StyleOptionContainer>
        <StyleOptionContainer>
          <StyleTitleText>이름</StyleTitleText>
          <StyleTextInput
            ref={nameRef}
            onChangeText={handleChangeText}
            onFocus={handleFocusInput}
            value={name}
            placeholder='ex) 지갑'
          />
        </StyleOptionContainer>
        <StyleOptionContainer>
          <StyleTitleText>대표색</StyleTitleText>
          <StyleTouchableDropdown onPress={handleToggleDropdown}>
            <StyleDropdownColor backColor={backColor} />
            <DropdownIcon />
          </StyleTouchableDropdown>
        </StyleOptionContainer>
        {isOpenDropdown && (
          <StyleDropdownContainer>
            {[0, 1, 2, 3, 4, 5, 6].map((option) => (
              <StyledDropdownContent
                option={option}
                key={option}
                onPress={() => onSelectOption(option)}
              />
            ))}
          </StyleDropdownContainer>
        )}
      </View>
      <EmojiPicker
        onEmojiSelected={handlePick}
        open={isOpenEmojiPicker}
        onClose={() => setIsOpenEmojiPicker(false)}
      />
      <View style={{ position: 'absolute', bottom: 20 }}>
        <AuthButton
          title={'확인'}
          onPress={handlePressConfirm}
          style={'enable'}
        />
      </View>
    </StyledContainer>
  );
};

export default BagItemScreen;

const StyledContainer = styled.SafeAreaView`
  flex: 1;
  align-items: center;
`;

const StyleTitleText = styled(CustomText)`
  font-size: 18px;
  text-align: center;
  width: ${responsive(70)}px;
`;
const StyleTextInput = React.forwardRef<TextInput, TextInputProps>(
  (props, ref) => <StyledInput {...props} ref={ref} />,
);

const StyleOptionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${responsiveVertical(100)}px;
`;

const StyledInput = styled(TextInput)`
  font-family: OAGothic-Medium;
  width: ${responsive(220)}px;
  font-size: 18px;
  text-align: right;
`;

const StyleTouchableDropdown = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  padding: 5px;
  border-color: ${colors.GRAY_500};
  border-radius: 10px;
`;

const StyleDropdownColor = styled.View<{ backColor: string }>`
  background-color: ${(props) => props.backColor};
  width: 50px;
  height: 20px;
  border-radius: 5px;
  margin-right: 5px;
  margin-left: 3px;
`;

const StyleDropdownContainer = styled.View`
  position: absolute;
  top: 100%;
  margin-top: ${responsiveVertical(20)}px;
  border-width: 1px;
  border-radius: 10px;
  border-color: ${colors.GRAY_500};
  right: 40px;
  padding: 5px;
`;

const StyledDropdownContent = styled.TouchableOpacity<{ option: number }>`
  width: ${responsive(68)}px;
  height: ${responsiveVertical(20)}px;
  border-radius: 5px;
  margin: 5px;
  background-color: ${(props) =>
    colors[`THINGS_BACK_${props.option}` as keyof typeof colors]};
`;
