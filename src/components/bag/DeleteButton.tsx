import { TouchableOpacity } from 'react-native';
import { DeleteBagIcon } from '@/assets/icons';

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
