

export const calculateDeliveryCost = (seller, distanceKm) => {
  const { baseDistance, baseCharge, perKmCharge } = seller.deliveryCharges;
  if (distanceKm <= baseDistance) return baseCharge;
  return baseCharge + (distanceKm - baseDistance) * perKmCharge;
};
    