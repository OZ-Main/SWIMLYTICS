import { SwimEquipment } from '@/shared/domain'

export const SWIM_EQUIPMENT_LABEL: Record<SwimEquipment, string> = {
  [SwimEquipment.PullBuoy]: 'Pull buoy',
  [SwimEquipment.Paddles]: 'Paddles',
  [SwimEquipment.Fins]: 'Fins',
  [SwimEquipment.Snorkel]: 'Snorkel',
  [SwimEquipment.Kickboard]: 'Kickboard',
}

export const SWIM_EQUIPMENT_ORDER: SwimEquipment[] = [
  SwimEquipment.PullBuoy,
  SwimEquipment.Paddles,
  SwimEquipment.Fins,
  SwimEquipment.Snorkel,
  SwimEquipment.Kickboard,
]
