'use client'

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from '@/app/i18n/client';
import { GoodData } from '@/types/entities';


type GoodDetailsProps = {
  goods: GoodData[];
  language: string;
};

const GoodsDetails: React.FC<GoodDetailsProps> = ({ goods, language }) => {
  const { t } = useTranslation(language, 'delivery');

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <p className="text-xl font-semibold">{t('goods_details', language)}</p>
      </div>
      <div className="">
        {goods.map((good) => (
          <Box key={good.id} className="mb-5 p-5 border border-gray-300 rounded-lg">
            <Typography variant="h6" className="mb-2">{good.name}</Typography>
            <Typography variant="body2" className="text-gray-600">{good.description}</Typography>
            <Typography variant="body2" className="text-black mt-2">
              {t('price', language)}: {good.price} {good.currency.code?.toUpperCase()}
            </Typography>
            <Typography variant="body2" className="mt-1 text-blue-500">
              <a href={good.link} target="_blank" rel="noopener noreferrer">
                {t('view_more', language)}
              </a>
            </Typography>
          </Box>
        ))}
      </div>
    </div>
  );
};



export default GoodsDetails;
