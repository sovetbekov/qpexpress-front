'use client'

import { useState } from 'react';
import { TrackingEvent, TrackingActivity } from "@/types";
import { useTranslation } from '@/app/i18n/client';

type TrackingEventsProps = {
  events: TrackingEvent[];
  language: string;
};

const TrackingEvents: React.FC<TrackingEventsProps> = ({ events, language }) => {
  const [trackingData, setTrackingData] = useState<TrackingEvent[]>(events);
  const { t } = useTranslation(language, 'delivery');

  return (
    <div className="mt-3 m-1 grow sm:mt-8 lg:mt-0">
      <div className="space-y-6 bg-white p-6">
        <h3 className="text-xl font-semibold text-gray-900 ">{t('order_history')}</h3>
        {trackingData.map((event: TrackingEvent, index: number) => (
          <ol key={index} className="relative ms-3 border-s border-gray-200 ">
            <li className="mb-10 ms-6 text-primary-700 ">
              <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white">
                <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                </svg>
              </span>
              <p className="mb-0.5 text-normal font-semibold">{event.date}</p>
              {event.activity.map((activity: TrackingActivity, index: number) => (
                <div key={index} className="my-3">
                  <p>{activity.time}</p>
                  <p className="text-sm">{activity.city}: {activity.name}</p>
                  <div className="mt-2 ">
                    {activity.status.includes('ISSPAY') ? (
                      <i className="border rounded-md p-1 font-medium text-white bg-green border-green-300">
                        {t(activity.status.join(', '))}
                      </i>
                    ) : (
                      <i className="border rounded-md p-1 font-medium text-white bg-blue border-blue-300">
                        {t(activity.status.join(', '))}
                      </i>
                    )}
                  </div>
                </div>
              ))}
            </li>
          </ol>
        ))}
      </div>
    </div>
  );
};

export default TrackingEvents;
