import { TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import { LatLng } from '@/api/map';
import { MarkerIcon } from '@/assets/icons';

const CustomMarker = ({
  track,
  isRoute,
  routeId,
  isLast,
  nextId,
  onPress,
}: {
  track: LatLng[];
  isRoute: boolean;
  routeId: number;
  isLast: boolean;
  nextId?: number;
  onPress: (id: number) => void;
}) => {
  return (
    <>
      {track[0] && (
        <Marker
          tracksViewChanges={false}
          onPress={() => onPress(routeId)}
          coordinate={{
            latitude: track[0].latitude,
            longitude: track[0].longitude,
          }}
          anchor={{ x: 0.5, y: 1 }}>
          <TouchableOpacity>
            <MarkerIcon width={30} height={30} />
          </TouchableOpacity>
        </Marker>
      )}

      {isRoute ||
        (isLast && track[track.length - 1] && (
          <Marker
            tracksViewChanges={false}
            onPress={() => onPress(nextId ? nextId : routeId)}
            coordinate={{
              latitude: track[track.length - 1].latitude,
              longitude: track[track.length - 1].longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}>
            <MarkerIcon width={30} height={30} />
          </Marker>
        ))}
    </>
  );
};

export default CustomMarker;
