import { DeleteBagIcon } from '@/assets/icons';
import { TouchableOpacity } from 'react-native';

const DeleteButton = ({ onPressDelete }: { onPressDelete: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPressDelete}
      style={{ position: 'absolute', zIndex: 10, top: 2, left: 2 }}>
      <DeleteBagIcon width={20} height={20} />
    </TouchableOpacity>
  );
};

export default DeleteButton;
