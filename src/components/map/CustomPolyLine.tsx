import { Polyline } from 'react-native-maps';
import { LatLng } from '@/api/map';
import { colors } from '@/constants';

const CustomPolyline = ({
  track,
  id,
  onPress,
}: {
  track: LatLng[];
  id: number;
  onPress: (id: number) => void;
}) => (
  <>
    <Polyline
      coordinates={track}
      strokeWidth={10}
      strokeColor={colors.GRAY_800}
      tappable={true}
      onPress={() => onPress(id)}
    />
    <Polyline
      coordinates={track}
      strokeWidth={8}
      strokeColor={colors.WHITE}
      tappable={true}
      onPress={() => onPress(id)}
    />
    <Polyline
      coordinates={track}
      strokeWidth={5}
      strokeColor={colors.PRIMARY}
      tappable={true}
      onPress={() => onPress(id)}
    />
  </>
);

export default CustomPolyline;
