import { DeleteBagIcon } from '@/assets/icons';
import { TouchableOpacity } from 'react-native';

const DeleteButton = ({ onPressDelete }: { onPressDelete: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPressDelete}
      style={{ position: 'absolute', zIndex: 10, top: 5, left: 10 }}>
      <DeleteBagIcon width={15} height={15} />
    </TouchableOpacity>
  );
};

export default DeleteButton;
