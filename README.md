# 단디


<img src="readme/dandi_title.png" width=600 />


> 외출 시 소지품 관리를 돕고 분실물 회수를 지원하는 애플리케이션

<br>

**👩‍💻 개발 기간 및 정보**

2024.10 - 2024.11 (6주)

6인(프론트엔드 2, 백엔드 4), 프론트엔드 담당

   <br>
   <br>

### 💡 담당 업무

- 위치 기반 이동 감지
   - GPS 기반 이동/정지 자동 판정
   - 이동 시작 시 소지품 체크 푸시 알림 전송
   - 사용자 동선 추적 및 지도 표시

- 소지품 관리
   - 소지품 등록/수정/삭제 및 드래그 앤 드롭 순서 변경
   - 커스텀 가방별 소지품 관리

- UI/UX
   - Google Maps API를 이용한 경로 시각화 (마커·폴리라인)

- 협업
   - 위치 판정 로직 문서화
   - 주간 회의 주도 및 GPS 테스트 결과 공유

<br><br>


### 🛠️ 기술 스택

|분류|기술|
|:--:|:--:|
|프레임워크|ReactNative|
|언어|TypeScript|
|상태 관리|Zustand, React Query|
|스타일|Styled Components|
|지도|Google Maps API|

<br>

### 📺 기능 화면

|                 메인 홈                  |                  가방 메인                   |가방 만들기                  |                  편집 모드                   |
| :--------------------------------------: | :------------------------------------------: |:------------------------------------------: | :------------------------------------------: |
| <img src="readme/home.png" width="200"/> | <img src="readme/bag-main.jpg" width="200"/> |<img src="readme/make-bag.jpg" width="200"/> | <img src="readme/edit-bag.jpg" width="200"/> |


|                   소지품 생성                   |                  소지품 편집                  |                  내 경로                  |          이동 시작 시 체크 알림          |
| :---------------------------------------------: | :-------------------------------------------: | :---------------------------------------: | :--------------------------------------: |
| <img src="readme/create-item.jpg" width="200"/> | <img src="readme/edit-item.jpg" width="200"/> |<img src="readme/route.jpg" width="200"/> | <img src="readme/push.jpg" width="200"/> |



<br><br>


### 📝 구현 상세

**위치 기반 이동/정지 판정 기준**
- **정확도 필터링**: 정확도 100m 이하 데이터만 사용 (실내/지하 오차 제거)
- **판정 데이터 개수**: 60개(10분) 위치 데이터의 평균 속도로 판단
  - 이동 경로 추적이 목적이므로 일시적 정지(신호등 대기)는 이동 중으로 유지
- **속도 임계값**: 0.5 m/s
   - 성인의 평균 걷는 속도(약 1.2m/s)보다 낮게 설정해 천천히 걷거나 잠시 멈춰도 이동으로 판정

```typescript
const averageSpeed = calculateAverageSpeed(distances.current);
const newIsMoving = averageSpeed > 0.5;
```
<br />

**배터리 효율 개선**

위치 정보를 지속적으로 수집하면 배터리 소모가 크기 때문에 이동/정지 상태에 따라 위치 정확도 모드를 다르게 적용했습니다.

- **이동 중**: `PRIORITY_HIGH_ACCURACY`
  - 동선 추적이 필요하므로 고정확도 모드 사용
- **정지 중**: `PRIORITY_BALANCED_POWER_ACCURACY`
  - 정지 상태에서는 정확한 위치가 불필요하므로 저전력 모드 전환

```kotlin
priority = if (isMoving) {
    LocationRequest.PRIORITY_HIGH_ACCURACY
} else {
    LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY
}
```

<br><br>

**🪜 와이어 프레임**

- [Figma](https://www.figma.com/design/u5KP1sLXYu9uTQJwuTFPS3/dandi?node-id=0-1&t=guBrvHa3aIM75m43-1)

<br><br>

**💽 ERD**

<img src="readme/erd.png" />
