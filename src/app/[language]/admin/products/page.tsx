import React from "react";
import ProductsList from "./components/ProductsList";

type Props = {
  params: {
    language: string;
  };
};

export const dynamic = "force-dynamic";

export default function Page({ params: { language } }: Readonly<Props>) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Поиск</h1>
      <p className="text-gray-600 text-sm mb-6">
        Поиск продуктов по ключевым словам и экспорт результатов в Excel
      </p>
      <ProductsList language={language} />
    </div>
  );
}
