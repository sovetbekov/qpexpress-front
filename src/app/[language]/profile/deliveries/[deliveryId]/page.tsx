// app/page.tsx (or wherever your server component is located)
import { getTrackingData } from '@/services/tracking';
import TrackingEvents from '../TrackingEvents';
import { getMyDelivery } from '@/services/deliveries';
import { isError } from '@/app/lib/utils';
import GoodsDetails from '../GoodsDetails';

type Props = {
  params: {
      language: string
      deliveryId: string
  }
}

export default async function Page({ params: { deliveryId, language } }: Readonly<Props>) {
  const deliveryResponse = await getMyDelivery(deliveryId)
  
  if (isError(deliveryResponse)) {
    return <div>Ошибка</div>
  }

  const kazPostTrackNumber = deliveryResponse.data?.kazPostTrackNumber
  const goods = deliveryResponse.data?.goods


  if(kazPostTrackNumber === undefined || kazPostTrackNumber === null) {
    return (
      <div>
        <p>Ошибка: нету трек номера</p>
      </div>
    )
  }

  const trackingResponse: any = await getTrackingData(kazPostTrackNumber);
  if (trackingResponse.data.error) {
    return (
      <div className="p-10">
        <p>{trackingResponse.data?.error}</p>
      </div>
    );
  }

  const successResponse = trackingResponse;
  const trackingData = successResponse.data;

  return (
    <div className="flex flex-col gap-2 m-0 md:m-4 lg:m-7 shadow py-6 px-4 border border-gray-200 rounded-lg sm:flex-col md:flex-row">
    
      <div className="basis-2/4">
        <TrackingEvents events={trackingData.events} language={language} />
      </div>
      <div className="basis-2/4">
        <GoodsDetails goods={goods} language={language} />
      </div>
      
      
    </div>
  );
}
