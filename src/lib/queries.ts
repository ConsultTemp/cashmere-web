import { Posting } from '@siva/entities'
const BASE_URL = 'http://localhost:3000'

export async function getPosting(id: string): Promise<Posting> {
  const res = await fetch(`${BASE_URL}/api/postings/${id}`)
  return res.json()
}

export async function getFakePosting(): Promise<Posting> {
  const mock_posting: Posting = {
    id: 'b89e5b72-9d28-474d-ace3-44ca21437d97',
    created_at: '',
    posting_id: '',
    duration: 'GIORNALIERO',
    subtitle: null,
    dropoff_location_plain: '',
    pickup_location_plain: '',
    deposit: '',
    price: 1400,
    age_required: 0,
    distance_limit_in_km: '',
    taxes_included: false,
    vehicle_id: '',
    brand: 'Lamborghini',
    model: 'Huracan',
    fuel_type: '',
    year: 0,
    interior_material: null,
    interior_color: null,
    exterior_color: null,
    transmission_type: null,
    vehicle_images: [
      'https://mkvfjhboywoocbqdzilx.supabase.co/storage/v1/object/public/images/kia-sorento-2024-frontal-lateral.369513.webp?t=2024-09-25T16%3A15%3A47.703Z',
    ],
    renter_name: null,
    bookmarked: false,
    vehicle_type: '',
    services: [],
    insurancePolicies: [],
    otherServices: [],
  }
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return mock_posting
}
